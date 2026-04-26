using System.Text;
using AiParsingService.Application.Abstractions;
using AiParsingService.Domain.Constants;
using Parsing.Configuration;

namespace AiParsingService.Infrastructure.Services;

public class MockConfigurationGeneratorService : IConfigurationGeneratorService
{
    private static readonly Dictionary<string, string> HeaderToLogicalName = new(StringComparer.OrdinalIgnoreCase)
    {
        // Dates
        ["Analysis Time"] = FieldLogicNames.SampleDate,
        ["Date"] = FieldLogicNames.SampleDate,
        ["Time"] = FieldLogicNames.SampleDate,
        ["Receipt Date"] = FieldLogicNames.ReceiptDate,

        // Product
        ["Product Name"] = FieldLogicNames.ProductName,
        ["Product Code"] = FieldLogicNames.ProductCode,
        ["Ingredient"] = FieldLogicNames.ProductName,

        // Sample
        ["Sample Number"] = FieldLogicNames.CustomerReference,
        ["Sample Type"] = FieldLogicNames.SampleDetails,
        ["Sample Comment"] = FieldLogicNames.Comment,
        ["Cup id"] = FieldLogicNames.DeviceCode,

        // Device
        ["Instrument Name"] = FieldLogicNames.DeviceName,
        ["Instrument Serial Number"] = FieldLogicNames.DeviceCode,
    };

    // Common nutrient-like header patterns
    private static readonly HashSet<string> NutrientLikeHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Moisture", "CP", "Fat", "Fiber", "Ash", "Protein", "Starch",
        "NDF", "ADF", "DM", "Dry Matter", "Crude Protein", "Crude Fat",
        "Moi", "Oil", "Sugar", "Energy"
    };

    public async Task<GeneratedConfigResult> GenerateConfigurationAsync(Stream fileStream, string fileName)
    {
        using var reader = new StreamReader(fileStream, Encoding.UTF8, leaveOpen: true);

        var firstLine = await reader.ReadLineAsync() ?? string.Empty;
        var secondLine = await reader.ReadLineAsync();

        var separator = DetectSeparator(firstLine);
        var columns = firstLine.Split(separator).Select(c => c.Trim().Trim('"')).ToList();

        var warnings = new List<string>();
        if (columns.Count == 1)
            warnings.Add("Only one column detected — separator may be incorrect.");
        if (secondLine is null)
            warnings.Add("File appears to have only a header row with no data.");

        var dataValues = secondLine?.Split(separator) ?? [];

        // Classify columns into scalar fields vs nutrient columns
        var scalarParameters = new List<CsvFileParameterMapping>();
        var nutrientStartIndex = -1;

        for (var i = 0; i < columns.Count; i++)
        {
            var col = columns[i];

            if (NutrientLikeHeaders.Contains(col) || NutrientLogicNames.All.Contains(col.ToLowerInvariant()))
            {
                if (nutrientStartIndex < 0)
                    nutrientStartIndex = i;
                continue;
            }

            // Once we've started finding nutrients, remaining non-nutrient columns are still nutrients
            if (nutrientStartIndex >= 0)
                continue;

            scalarParameters.Add(new CsvFileParameterMapping
            {
                Index = i,
                LogicalName = ResolveLogicalName(col),
                Variants = [col],
                Source = ValueSource.Header,
                Type = secondLine is not null ? InferType(dataValues.ElementAtOrDefault(i)) : CsvParameterType.String
            });
        }

        var blocks = new List<CsvFileBlockConfiguration>
        {
            new()
            {
                LogicalName = FieldLogicNames.SampleDetails,
                IsCollection = false,
                StartIndex = 0,
                ItemSize = 0,
                Variants = [],
                Parameters = scalarParameters
            }
        };

        if (nutrientStartIndex >= 0)
        {
            blocks.Add(new CsvFileBlockConfiguration
            {
                LogicalName = FieldLogicNames.Results,
                IsCollection = true,
                StartIndex = nutrientStartIndex,
                ItemSize = 1,
                Variants = [],
                Parameters =
                [
                    new CsvFileParameterMapping
                    {
                        Index = 0,
                        LogicalName = NutrientLogicNames.Name,
                        Source = ValueSource.Header,
                        Type = CsvParameterType.String
                    },
                    new CsvFileParameterMapping
                    {
                        Index = 0,
                        LogicalName = NutrientLogicNames.Result,
                        Source = ValueSource.Cell,
                        Type = CsvParameterType.Double
                    }
                ]
            });
        }
        else
        {
            blocks.Add(new CsvFileBlockConfiguration
            {
                LogicalName = FieldLogicNames.Results,
                IsCollection = true,
                StartIndex = columns.Count,
                ItemSize = 1,
                Variants = [],
                Parameters = []
            });
        }

        var config = new CsvFileParsingConfiguration
        {
            Separator = separator,
            HasHeader = true,
            Grouping = new CsvGroupingConfiguration
            {
                PropertyLogicalName = FieldLogicNames.CustomerReference
            },
            Blocks = blocks
        };

        fileStream.Position = 0;

        return new GeneratedConfigResult(
            config,
            DetectedFormat: "CSV",
            DetectedColumns: columns,
            Separator: separator,
            Warnings: warnings);
    }

    private static string ResolveLogicalName(string headerName)
    {
        if (HeaderToLogicalName.TryGetValue(headerName, out var logicalName))
            return logicalName;

        return SanitizeColumnName(headerName);
    }

    private static string DetectSeparator(string headerLine)
    {
        var separators = new[] { ";", "\t", ",", "|" };
        return separators
            .OrderByDescending(s => headerLine.Split(s).Length)
            .First();
    }

    private static string SanitizeColumnName(string name)
    {
        var sanitized = new string(name.Where(c => char.IsLetterOrDigit(c) || c == '_').ToArray());
        return string.IsNullOrEmpty(sanitized) ? "Column" : sanitized.ToLowerInvariant();
    }

    private static CsvParameterType InferType(string? sample)
    {
        if (string.IsNullOrWhiteSpace(sample)) return CsvParameterType.String;
        sample = sample.Trim().Trim('"');

        if (int.TryParse(sample, out _)) return CsvParameterType.Int;
        if (decimal.TryParse(sample, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out _)) return CsvParameterType.Decimal;
        if (DateTime.TryParse(sample, out _)) return CsvParameterType.DateTime;
        if (bool.TryParse(sample, out _)) return CsvParameterType.Bool;

        return CsvParameterType.String;
    }
}
