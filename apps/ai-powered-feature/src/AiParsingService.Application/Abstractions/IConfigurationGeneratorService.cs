using Parsing.Configuration;

namespace AiParsingService.Application.Abstractions;

public record GeneratedConfigResult(
    CsvFileParsingConfiguration Configuration,
    string DetectedFormat,
    List<string> DetectedColumns,
    string Separator,
    List<string> Warnings);

public interface IConfigurationGeneratorService
{
    Task<GeneratedConfigResult> GenerateConfigurationAsync(Stream fileStream, string fileName);
}
