using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using AiParsingService.Application.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Parsing.Configuration;

namespace AiParsingService.Infrastructure.Services;

public class AzureOpenAiOptions
{
    public const string SectionName = "AzureOpenAi";

    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DeploymentName { get; set; } = string.Empty;
}

public class SemanticKernelConfigurationGeneratorService : IConfigurationGeneratorService
{
    private const int MaxSampleLines = 20;
    private const int MaxFileContentBytes = 50 * 1024;

    private readonly Kernel _kernel;
    private readonly ILogger<SemanticKernelConfigurationGeneratorService> _logger;

    public SemanticKernelConfigurationGeneratorService(
        IOptions<AzureOpenAiOptions> options,
        ILogger<SemanticKernelConfigurationGeneratorService> logger)
    {
        _logger = logger;

        var builder = Kernel.CreateBuilder();
        builder.AddAzureOpenAIChatCompletion(
            deploymentName: options.Value.DeploymentName,
            endpoint: options.Value.Endpoint,
            apiKey: options.Value.ApiKey);

        _kernel = builder.Build();
    }

    public async Task<GeneratedConfigResult> GenerateConfigurationAsync(Stream fileStream, string fileName)
    {
        using var reader = new StreamReader(fileStream, Encoding.UTF8, leaveOpen: true);

        var sampleLines = new List<string>();
        for (var i = 0; i < MaxSampleLines && await reader.ReadLineAsync() is { } line; i++)
            sampleLines.Add(line);

        var prompt = BuildPrompt(fileName, sampleLines);

        _logger.LogInformation("Generating parsing configuration for {FileName} via Azure OpenAI", fileName);

        var result = await _kernel.InvokePromptAsync(prompt);
        var responseText = result.GetValue<string>() ?? string.Empty;

        var config = ParseAiResponse(responseText);

        fileStream.Position = 0;

        var columns = config.HasHeader && sampleLines.Count > 0
            ? sampleLines[0].Split(config.Separator).Select(c => c.Trim().Trim('"')).ToList()
            : [];

        return new GeneratedConfigResult(
            config,
            DetectedFormat: "CSV",
            DetectedColumns: columns,
            Separator: config.Separator,
            Warnings: []);
    }

    private static string BuildPrompt(string fileName, List<string> sampleLines)
    {
        var sampleContent = string.Join("\n", sampleLines);

        return $$"""
            You are a CSV parsing configuration generator. Analyze the provided CSV file and produce a JSON object
            that conforms to the CsvFileParsingConfiguration schema (camelCase property names).

            ## Schema

            ```
            {
              "separator": string,        // column delimiter, e.g. "," or ";"
              "hasHeader": bool,           // true if the first row is a header
              "encoding": string|null,     // e.g. "utf-8", "iso-8859-1" (omit if UTF-8)
              "grouping": { "propertyLogicalName": string } | null,
              "blocks": [
                {
                  "logicalName": string,   // "sampledetails" (scalar) or "results" (collection)
                  "isCollection": bool,
                  "startIndex": int,       // 0-based starting column index
                  "itemSize": int,         // columns per repeating item (0 for scalar blocks)
                  "variants": [string],    // marker values to locate the block dynamically
                  "parameters": [
                    {
                      "index": int,        // 0-based column index within the block
                      "logicalName": string,
                      "source": "Cell"|"Header",  // "Cell" = read from data row (default), "Header" = read from header row
                      "type": "String"|"Int"|"Long"|"Decimal"|"Double"|"Bool"|"DateTime",
                      "format": string|null,       // datetime format pattern
                      "variants": [string],        // alternative header names for matching
                      "offset": int,               // position offset after variant match
                      "extractPattern": string|null,   // regex to extract value, e.g. "Sample:(\\d+)"
                      "replacePattern": string|null,   // regex to replace before conversion
                      "replaceWith": string|null       // replacement text
                    }
                  ]
                }
              ]
            }
            ```

            ## Valid Field Logical Names (for "sampledetails" scalar block)

            - `sampledate` — date/time when sample was analyzed
            - `customerreference` — sample identifier or order number (often extracted via regex)
            - `productname` — material/ingredient name
            - `productcode` — product code identifier
            - `devicename` — instrument/device name
            - `devicecode` — instrument serial number
            - `iscalibration` — whether the sample is a calibration run (bool)
            - `ordernumber` — order number
            - `samplenumber` — sample number
            - `sampletestid` — sample test identifier
            - `receiptdate` — date when sample was received
            - `resultsreadydate` — date when results were ready
            - `collecteddate` — date when sample was collected
            - `harverstdate` — date when sample was harvested
            - `sampledetails` — sample details/description
            - `comment` — sample comment
            - `suppliername` — supplier name
            - `suppliercode` — supplier code
            - `accountcode` — account code
            - `accountname` — account name
            - `tenantcode` — tenant code
            - `tenantname` — tenant name

            ## Valid Nutrient Logical Names (for "results" collection block)

            - `nutrientname` — nutrient/analyte name (e.g. "Moi", "CP", "Fat")
            - `nutrientresult` — measured value (double)
            - `nutrientunit` — unit of measurement (e.g. "%")
            - `nutrientgh` — Global H statistic
            - `nutrientnh` — Neighborhood H statistic
            - `nutrientcode` — nutrient code
            - `nutrientlowerlimit` — lower limit
            - `nutrientmaxgh` — max Global H
            - `nutrienttarget` — target value
            - `nutrientupperlimit` — upper limit
            - `nutrientmaxnh` — max Neighborhood H
            - `nutrienttestmethod` — test method

            ## Two-Block Pattern

            Every configuration MUST have exactly two blocks:
            1. **Block 1** — `logicalName: "sampledetails"`, `isCollection: false`: scalar sample-level fields (dates, product, device, etc.)
            2. **Block 2** — `logicalName: "results"`, `isCollection: true`: repeating nutrient groups with `startIndex` and `itemSize`

            ## Key Features

            - `source`: "Cell" (default, read from data row) or "Header" (read from header row)
            - `variants`: alternative header names for matching
            - `offset`: position offset after variant match
            - `extractPattern`: regex to extract values (e.g. `"Numero da amostra:(\\d+)"`)
            - `replacePattern`/`replaceWith`: regex replace before conversion (e.g. comma→dot for decimals)
            - `type`: String, Int, Long, Decimal, Double, Bool, DateTime
            - `format`: datetime format pattern
            - `grouping.propertyLogicalName`: field to group rows by

            ## Examples

            ### Example 1 — CSV with header, semicolon-separated

            Input:
            ```
            Analysis Time;Product Name;Product Code;Sample Number;Moisture;CP;Fat
            10/12/2025 07:47:12;Soy Meal;SM;025.010.528;11.98;46.62;0.94
            ```

            Output:
            ```json
            {
              "separator": ";",
              "hasHeader": true,
              "grouping": { "propertyLogicalName": "customerreference" },
              "blocks": [
                {
                  "logicalName": "sampledetails",
                  "isCollection": false,
                  "startIndex": 0,
                  "itemSize": 0,
                  "parameters": [
                    { "index": 0, "logicalName": "sampledate", "type": "DateTime", "format": "dd/MM/yyyy HH:mm:ss" },
                    { "index": 1, "logicalName": "productname", "type": "String" },
                    { "index": 2, "logicalName": "productcode", "type": "String" },
                    { "index": 3, "logicalName": "customerreference", "type": "String" }
                  ]
                },
                {
                  "logicalName": "results",
                  "isCollection": true,
                  "startIndex": 4,
                  "itemSize": 1,
                  "parameters": [
                    { "index": 0, "logicalName": "nutrientname", "source": "Header", "type": "String" },
                    { "index": 0, "logicalName": "nutrientresult", "source": "Cell", "replacePattern": ",", "replaceWith": ".", "type": "Double" }
                  ]
                }
              ]
            }
            ```

            ### Example 2 — CSV without header, comma-separated, collection with variant marker

            Input:
            ```
            1/12/2025,10:14:13,CORN,Sample:4462,Quant,Moi,12.61,%,0.001,0.022,0.085,CP,7.84,%,0.004,0.022,0.209
            ```

            Output:
            ```json
            {
              "separator": ",",
              "hasHeader": false,
              "grouping": { "propertyLogicalName": "customerreference" },
              "blocks": [
                {
                  "logicalName": "sampledetails",
                  "isCollection": false,
                  "startIndex": 0,
                  "itemSize": 0,
                  "parameters": [
                    { "index": 0, "logicalName": "sampledate", "type": "DateTime", "format": "M/d/yyyy" },
                    { "index": 2, "logicalName": "productname", "type": "String" },
                    { "index": 3, "logicalName": "customerreference", "extractPattern": "Sample:(\\d+)", "type": "String" }
                  ]
                },
                {
                  "logicalName": "results",
                  "isCollection": true,
                  "startIndex": 0,
                  "itemSize": 6,
                  "variants": ["Quant"],
                  "parameters": [
                    { "index": 0, "logicalName": "nutrientname", "type": "String" },
                    { "index": 1, "logicalName": "nutrientresult", "type": "Double" },
                    { "index": 2, "logicalName": "nutrientunit", "type": "String" },
                    { "index": 4, "logicalName": "nutrientgh", "type": "Double" },
                    { "index": 5, "logicalName": "nutrientnh", "type": "Double" }
                  ]
                }
              ]
            }
            ```

            ## Hard Rules

            1. ONLY use logical names from the lists above — no custom names allowed.
            2. Return ONLY valid JSON matching the schema. No markdown fences, no explanation.
            3. Always include a "sampledetails" scalar block and a "results" collection block.
            4. For collection blocks, `itemSize` must match the repeating group width.
            5. Use `"source": "Header"` for `nutrientname` when the file has headers and nutrient names are in the header row.
            6. Use `replacePattern`/`replaceWith` for decimal comma replacement when locale uses commas.

            ## File to Analyze

            File name: {{fileName}}
            Sample content (first {{sampleLines.Count}} lines):
            {{sampleContent}}
            """;
    }

    private static CsvFileParsingConfiguration ParseAiResponse(string responseText)
    {
        var json = responseText;
        var jsonStart = json.IndexOf('{');
        var jsonEnd = json.LastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart)
            json = json[jsonStart..(jsonEnd + 1)];

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };

        return JsonSerializer.Deserialize<CsvFileParsingConfiguration>(json, options)
               ?? throw new InvalidOperationException("AI returned null configuration.");
    }
}
