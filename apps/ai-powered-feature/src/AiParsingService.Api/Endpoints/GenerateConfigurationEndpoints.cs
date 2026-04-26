using AiParsingService.Api.Contracts;
using AiParsingService.Application.Abstractions;
using AiParsingService.Application.Validation;

namespace AiParsingService.Api.Endpoints;

public static class GenerateConfigurationEndpoints
{
    public static RouteGroupBuilder MapGenerateConfigurationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/generate-configuration").WithTags("AI Generation");

        group.MapPost("/", GenerateConfiguration).DisableAntiforgery();

        return group;
    }

    private static async Task<IResult> GenerateConfiguration(
        IFormFile file,
        IConfigurationGeneratorService generatorService)
    {
        if (file.Length == 0)
            return Results.BadRequest(new ErrorResponse("No file uploaded."));

        if (file.Length > 10 * 1024 * 1024)
            return Results.BadRequest(new ErrorResponse("File exceeds 10MB limit."));

        var allowedExtensions = new[] { ".csv", ".txt", ".tsv" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return Results.BadRequest(new ErrorResponse($"Unsupported file type: {ext}", allowedExtensions.ToList()));

        try
        {
            await using var stream = file.OpenReadStream();
            var result = await generatorService.GenerateConfigurationAsync(stream, file.FileName);

            // Validate the AI-generated configuration before returning
            var validation = ConfigurationValidator.Validate(result.Configuration);

            return Results.Ok(new GenerateConfigurationResponse(
                result.Configuration,
                result.DetectedFormat,
                result.DetectedColumns,
                result.Separator,
                result.Warnings,
                validation.IsValid,
                validation.Errors,
                validation.Warnings));
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: 500);
        }
    }
}
