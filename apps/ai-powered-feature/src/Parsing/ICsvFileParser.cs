namespace Parsing;

/// <summary>
/// Defines a service that parses CSV streams into a structured, configuration-driven
/// representation suitable for further processing.
/// </summary>
public interface ICsvFileParser
{
    /// <summary>
    /// Parses the provided CSV stream according to the supplied configuration
    /// and returns a list of logical records.
    /// </summary>
    /// <param name="stream">Input stream containing CSV data.</param>
    /// <param name="config">Parsing configuration that controls delimiter, blocks and mappings.</param>
    /// <param name="headerColumns">list of columns for header detection</param>
    /// <param name="autoDetectedHeader"> flag if we should use auto header detection or not</param>
    /// <returns>
    /// A list of records, where each record is represented as a case-insensitive
    /// dictionary of logical names to parsed values.
    /// </returns>
    List<Dictionary<string, object?>> Parse(Stream stream, CsvFileParsingConfiguration config, string[]? headerColumns = null, bool autoDetectedHeader = false);
}