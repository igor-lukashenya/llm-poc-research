using System.Text.Json.Serialization;

namespace Parsing.Configuration;

/// <summary>
/// Defines the supported target types for CSV parameter values
/// after parsing and conversion.
/// </summary>
public enum CsvParameterType
{
    /// <summary>
    /// The raw text value is kept as a string.
    /// </summary>
    String,

    /// <summary>
    /// The value is converted to a 32-bit integer.
    /// </summary>
    Int,

    /// <summary>
    /// The value is converted to a 64-bit integer.
    /// </summary>
    Long,

    /// <summary>
    /// The value is converted to a decimal number.
    /// </summary>
    Decimal,

    /// <summary>
    /// The value is converted to a double-precision floating point number.
    /// </summary>
    Double,

    /// <summary>
    /// The value is converted to a boolean.
    /// </summary>
    Bool,

    /// <summary>
    /// The value is converted to a <see cref="DateTime"/>, optionally using
    /// a specific format string.
    /// </summary>
    DateTime
}

/// <summary>
/// Configuration that specifies how parsed CSV rows should be grouped
/// into higher-level logical records.
/// </summary>
public class CsvGroupingConfiguration
{
    /// <summary>
    /// Logical name of the property that will be used as a grouping key
    /// when combining multiple parsed rows into a single logical record.
    /// </summary>
    public string PropertyLogicalName { get; init; } = string.Empty;
}

/// <summary>
/// Root configuration describing how a CSV file should be parsed, including
/// delimiter, logical blocks and optional grouping behavior.
/// </summary>
public sealed class CsvFileParsingConfiguration
{
    /// <summary>
    /// Column separator used in the CSV file, for example "," or ";".
    /// </summary>
    public string Separator { get; init; } = ",";

    /// <summary>
    /// Indicates whether the CSV file contains a header row.
    /// A header is required when any parameter uses <see cref="ValueSource.Header"/>.
    /// </summary>
    public bool HasHeader { get; init; } = true;

    /// <summary>
    /// Logical blocks that describe how to map sections of a CSV record
    /// into structured data, including scalar and collection sections.
    /// </summary>
    public List<CsvFileBlockConfiguration> Blocks { get; init; } = [];

    /// <summary>
    /// Optional configuration that instructs the parser to group
    /// multiple rows by a specific logical property.
    /// </summary>
    public CsvGroupingConfiguration? Grouping { get; init; }

    /// <summary>
    /// Optional encoding name (e.g. "iso-8859-1", "utf-8", "windows-1252")
    /// used to read the CSV file. When omitted the parser attempts BOM-based
    /// auto-detection, then validates the stream as UTF-8, and falls back
    /// to Windows-1252 if the bytes are not valid UTF-8.
    /// </summary>
    public string? Encoding { get; init; }
}

/// <summary>
/// Describes a logical block within a CSV record, which can be either a
/// single (scalar) section or a repeating collection of items.
/// </summary>
public sealed class CsvFileBlockConfiguration
{
    /// <summary>
    /// Logical name of the block. For scalar blocks this becomes a property
    /// name; for collection blocks it becomes the collection key in the result.
    /// </summary>
    public string LogicalName { get; init; } = string.Empty;

    /// <summary>
    /// Indicates whether this block represents a repeating collection of
    /// items within a single CSV row.
    /// </summary>
    public bool IsCollection { get; init; }

    /// <summary>
    /// Zero-based starting column index of the block when <see cref="Variants"/>
    /// are not used to dynamically locate the block.
    /// </summary>
    public int StartIndex { get; init; }

    /// <summary>
    /// Number of columns that make up a single item in a collection block.
    /// Ignored for non-collection blocks.
    /// </summary>
    public int ItemSize { get; init; }

    /// <summary>
    /// Optional marker values that can be used to dynamically find the
    /// beginning of this block in the current record.
    /// </summary>
    public List<string> Variants { get; init; } = [];

    /// <summary>
    /// Parameter mappings that describe how individual columns inside the
    /// block are read, transformed and converted.
    /// </summary>
    public List<CsvFileParameterMapping> Parameters { get; init; } = [];
}

/// <summary>
/// Lightweight source descriptor used inside <see cref="CsvFileParameterMapping.MergeFrom"/>
/// to resolve a single cell value that will be concatenated with other sources.
/// Supports the same three resolution modes as <see cref="CsvFileParameterMapping"/>:
/// fixed index, variant scan, and variant + offset.
/// </summary>
public sealed class CsvMergeSource
{
    /// <summary>
    /// Zero-based column index to read. Set to a negative value when
    /// using <see cref="Variants"/> to locate the column dynamically.
    /// </summary>
    public int Index { get; init; } = -1;

    /// <summary>
    /// Marker values used to locate the column by scanning the current
    /// record for a case-insensitive substring match.
    /// </summary>
    public List<string> Variants { get; init; } = [];

    /// <summary>
    /// Positional offset applied after a cell is located via
    /// <see cref="Variants"/>. Works identically to
    /// <see cref="CsvFileParameterMapping.Offset"/>.
    /// </summary>
    public int Offset { get; init; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    /// <summary>
    /// Source of the value: cell or header.
    /// </summary>
    public ValueSource Source { get; init; } = ValueSource.Cell;
}

/// <summary>
/// Describes how a single CSV column (or header-derived value) is mapped,
/// transformed and converted into a typed logical value.
/// </summary>
public sealed class CsvFileParameterMapping
{
    /// <summary>
    /// Zero-based index of the column to read. When negative, the parser
    /// may resolve the value by header name and <see cref="Variants"/>.
    /// </summary>
    public int Index { get; init; } = -1;

    /// <summary>
    /// Logical name of the value produced by this mapping in the parsed result.
    /// </summary>
    public string LogicalName { get; init; } = string.Empty;

    /// <summary>
    /// Alternative header names or marker values used to locate the value.
    /// <para>
    /// When <see cref="Source"/> is <see cref="ValueSource.Header"/>, these are
    /// alternative header names checked by exact match.
    /// </para>
    /// <para>
    /// When <see cref="Source"/> is <see cref="ValueSource.Cell"/> and
    /// <see cref="Index"/> is negative, the parser scans every cell in the
    /// current record for a case-insensitive substring match. If
    /// <see cref="Offset"/> is zero the matched cell itself is returned;
    /// otherwise the cell at <c>matchedIndex + Offset</c> is returned.
    /// </para>
    /// </summary>
    public List<string> Variants { get; init; } = [];

    /// <summary>
    /// Positional offset applied after a cell is located via
    /// <see cref="Variants"/> substring scan. A value of <c>0</c> (default)
    /// returns the matched cell; <c>-1</c> returns the cell immediately
    /// before the match, <c>1</c> the cell after, and so on.
    /// Only used when <see cref="Source"/> is <see cref="ValueSource.Cell"/>,
    /// <see cref="Index"/> is negative, and <see cref="Variants"/> is not empty.
    /// </summary>
    public int Offset { get; init; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    /// <summary>
    /// Source of the value: either from a cell in the record or from
    /// the header row.
    /// </summary>
    public ValueSource Source { get; init; } = ValueSource.Cell;

    /// <summary>
    /// Optional regular expression pattern used to replace parts of the
    /// raw value before type conversion.
    /// </summary>
    public string? ReplacePattern { get; init; }

    /// <summary>
    /// Replacement text used together with <see cref="ReplacePattern"/>.
    /// </summary>
    public string? ReplaceWith { get; init; }

    /// <summary>
    /// Optional regular expression pattern used to extract a specific
    /// capture group from the raw value.
    /// </summary>
    public string? ExtractPattern { get; init; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    /// <summary>
    /// Target type to which the value should be converted.
    /// </summary>
    public CsvParameterType Type { get; init; } = CsvParameterType.String;

    /// <summary>
    /// Optional list of raw values that should be interpreted as <c>true</c>
    /// when <see cref="Type"/> is <see cref="CsvParameterType.Bool"/>.
    /// Comparisons are case-insensitive. Values not present in this list
    /// will be interpreted as <c>false</c> (unless the raw value is null
    /// or whitespace, in which case the result will be <c>null</c>).
    /// </summary>
    public List<string> TrueValues { get; init; } = [];

    /// <summary>
    /// Optional format string used for parsing values, for example a
    /// date/time pattern when <see cref="Type"/> is <see cref="CsvParameterType.DateTime"/>.
    /// When <see cref="Formats"/> is also provided, this value is tried first.
    /// </summary>
    public string? Format { get; init; }

    /// <summary>
    /// Optional list of additional format strings. The parser tries
    /// <see cref="Format"/> first, then each entry in this list in order.
    /// Useful when a single configuration must handle files with different
    /// date formats (e.g., <c>MM/dd/yy</c> and <c>yyyy-MM-dd</c>).
    /// </summary>
    public List<string> Formats { get; init; } = [];

    /// <summary>
    /// Optional time zone identifier that should be applied when
    /// <see cref="Type"/> is <see cref="CsvParameterType.DateTime"/>.
    /// When specified, the parsed value is interpreted in this time zone
    /// and converted to UTC. When omitted, parsed date/time values are
    /// treated as UTC.
    /// </summary>
    public string? TimeZoneId { get; init; }

    /// <summary>
    /// Optional list of sources whose resolved values are concatenated
    /// (joined by <see cref="MergeSeparator"/>) to produce the raw value
    /// for this parameter. When provided, <see cref="Index"/>,
    /// <see cref="Variants"/> and <see cref="Offset"/> on this mapping
    /// are ignored for value resolution — the merge sources are used instead.
    /// Transforms (<see cref="ReplacePattern"/>, <see cref="ExtractPattern"/>)
    /// and type conversion are still applied to the merged result.
    /// </summary>
    public List<CsvMergeSource> MergeFrom { get; init; } = [];

    /// <summary>
    /// Separator used to join the values resolved by <see cref="MergeFrom"/>.
    /// Defaults to a single space.
    /// </summary>
    public string MergeSeparator { get; init; } = " ";

    /// <summary>
    /// When <c>true</c> and <see cref="Type"/> is <see cref="CsvParameterType.DateTime"/>,
    /// the parser treats the raw value as containing a UTC offset (e.g. <c>-0300</c>
    /// or <c>+05:30</c>) and parses it via <see cref="System.DateTimeOffset"/> so the
    /// offset is honoured. Compact 4-digit offsets are normalised automatically.
    /// </summary>
    public bool HasUtcOffset { get; init; }
}