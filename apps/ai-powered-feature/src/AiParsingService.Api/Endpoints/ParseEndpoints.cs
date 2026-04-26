using System.Text.Json;
using AiParsingService.Api.Contracts;
using AiParsingService.Application.Abstractions;
using Parsing;
using Parsing.Configuration;

namespace AiParsingService.Api.Endpoints;

public static class ParseEndpoints
{
    public static RouteGroupBuilder MapParseEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/parse").WithTags("Parsing");

        group.MapPost("/", ParseFile).DisableAntiforgery();

        return group;
    }

    private static async Task<IResult> ParseFile(
        IFormFile file,
        ICsvFileParser parser,
        ITemplateRepository templateRepository,
        HttpRequest request)
    {
        if (file.Length == 0)
            return Results.BadRequest(new ErrorResponse("No file uploaded."));

        if (file.Length > 10 * 1024 * 1024)
            return Results.BadRequest(new ErrorResponse("File exceeds 10MB limit."));

        // Resolve configuration: from template ID, form field, or query string
        CsvFileParsingConfiguration? config = null;

        if (request.Query.TryGetValue("templateId", out var tidValue) && Guid.TryParse(tidValue, out var templateId))
        {
            var template = await templateRepository.GetByIdAsync(templateId);
            if (template is null)
                return Results.NotFound(new ErrorResponse($"Template '{templateId}' not found."));

            config = template.Configuration;
        }
        else
        {
            // Accept configuration from form field or query string
            string? configJson = request.Form.ContainsKey("configuration")
                ? request.Form["configuration"].ToString()
                : request.Query.ContainsKey("configuration")
                    ? request.Query["configuration"].ToString()
                    : null;

            if (!string.IsNullOrWhiteSpace(configJson))
            {
                try
                {
                    config = JsonSerializer.Deserialize<CsvFileParsingConfiguration>(configJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
                    });
                }
                catch (JsonException ex)
                {
                    return Results.BadRequest(new ErrorResponse("Invalid configuration JSON.", [ex.Message]));
                }
            }
        }

        if (config is null)
            return Results.BadRequest(new ErrorResponse("Provide either 'templateId' or 'configuration' parameter."));

        try
        {
            await using var stream = file.OpenReadStream();
            var rows = parser.Parse(stream, config);

            return Results.Ok(new ParseResponse(
                FileName: file.FileName,
                TotalRows: rows.Count,
                Rows: rows));
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: 500);
        }
    }
}
