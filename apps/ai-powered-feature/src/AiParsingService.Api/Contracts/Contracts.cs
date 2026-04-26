using Parsing.Configuration;

namespace AiParsingService.Api.Contracts;

// Templates
public record CreateTemplateRequest(
    string Name,
    CsvFileParsingConfiguration Configuration);

public record UpdateTemplateRequest(
    string Name,
    CsvFileParsingConfiguration Configuration);

public record TemplateSummaryResponse(
    Guid Id,
    string Name,
    string Separator,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record TemplateDetailResponse(
    Guid Id,
    string Name,
    CsvFileParsingConfiguration Configuration,
    DateTime CreatedAt,
    DateTime UpdatedAt);

// AI Generation
public record GenerateConfigurationResponse(
    CsvFileParsingConfiguration Configuration,
    string DetectedFormat,
    List<string> DetectedColumns,
    string Separator,
    List<string> Warnings,
    bool IsValid,
    List<string> ValidationErrors,
    List<string> ValidationWarnings);

// Common
public record ErrorResponse(string Error, List<string>? Details = null);

// Parsing
public record ParseResponse(
    string FileName,
    int TotalRows,
    List<Dictionary<string, object?>> Rows);
