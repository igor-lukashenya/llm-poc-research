using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using UtfUnknown;

namespace Parsing;

/// <summary>
/// Default implementation of <see cref="ICsvFileParser"/> that uses CsvHelper
/// to read CSV data and maps it into a configuration-driven object model.
/// </summary>
public class CsvFileParser : ICsvFileParser
{
    /// <inheritdoc />
    public List<Dictionary<string, object?>> Parse(Stream stream, CsvFileParsingConfiguration config,
        string[]? headerColumns = null, bool autoDetectedHeader = false)
    {
        var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = config.Separator,
            HasHeaderRecord = config.HasHeader,
            IgnoreBlankLines = true,
            MissingFieldFound = _ => { }
        };

        var encoding = ResolveEncoding(stream, config.Encoding);
        using var reader = new StreamReader(stream, encoding);
        using var csv = new CsvReader(reader, csvConfig);

        string[]? headerRow = [];
        if (config.HasHeader)
        {
            csv.Read();
            csv.ReadHeader();

            headerRow = csv.HeaderRecord;
        }

        var rows = new List<Dictionary<string, object?>>();

        while (csv.Read())
        {
            var hasAutodetectHeader = AutoDetectHeaderRow(csv, headerColumns, autoDetectedHeader);

            if (hasAutodetectHeader)
            {
                continue;
            }


            var result = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

            for (int index = 0; index < config.Blocks.Count; index++)
            {
                CsvFileBlockConfiguration csvFileBlock = config.Blocks[index];
                if (!csvFileBlock.IsCollection)
                {
                    foreach (var p in csvFileBlock.Parameters)
                    {
                        var value = ResolveMappingValue(csv, headerRow, config.HasHeader, p);
                        value = ApplyTransforms(value, p.ReplacePattern, p.ReplaceWith, p.ExtractPattern);
                        result[p.LogicalName] = ConvertToType(value, p);
                    }

                    continue;
                }

                var items = new List<Dictionary<string, object?>>();

                int startIndex = ResolveBlockStartIndex(csvFileBlock, csv, out bool variantMatched);

                // If the block declares variants but none matched in this row, skip entirely
                // so that a later block with different variants/item-size can claim the same logical name.
                if (!variantMatched && csvFileBlock.Variants is { Count: > 0 })
                {
                    continue;
                }

                int blockSize = Math.Max(1, csvFileBlock.ItemSize);
                int total = csv.Parser.Count;
                int boundary = GetNextBoundary(config.Blocks, index + 1, total);

                while (startIndex < boundary && startIndex + blockSize <= boundary)
                {
                    var itemParams = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

                    bool hasHeaderName = true;
                    bool hasAnyValue = false;

                    foreach (var p in csvFileBlock.Parameters)
                    {
                        int colIdx = startIndex + p.Index;
                        var value = ResolveValue(csv, headerRow, config.HasHeader,
                            new CsvFileParameterMapping
                            {
                                Index = colIdx,
                                LogicalName = p.LogicalName,
                                Variants = p.Variants,
                                Source = p.Source,
                                ReplacePattern = p.ReplacePattern,
                                ReplaceWith = p.ReplaceWith,
                                ExtractPattern = p.ExtractPattern
                            });

                        if (p.Source == ValueSource.Header && string.IsNullOrWhiteSpace(value))
                        {
                            hasHeaderName = false;
                            break;
                        }

                        value = ApplyTransforms(value, p.ReplacePattern, p.ReplaceWith, p.ExtractPattern);
                        var converted = ConvertToType(value, p);
                        itemParams[p.LogicalName] = converted;

                        if (converted is string s)
                        {
                            if (!string.IsNullOrWhiteSpace(s))
                            {
                                hasAnyValue = true;
                            }
                        }
                        else if (converted is not null)
                        {
                            hasAnyValue = true;
                        }
                    }

                    if (!hasHeaderName)
                    {
                        break;
                    }

                    if (!hasAnyValue)
                    {
                        startIndex += blockSize;
                        continue;
                    }

                    items.Add(itemParams);
                    startIndex += blockSize;
                }

                result[csvFileBlock.LogicalName] = items;
            }

            rows.Add(result);
        }

        if (config.Grouping is null || string.IsNullOrWhiteSpace(config.Grouping.PropertyLogicalName))
        {
            return rows;
        }

        var collectionBlockNames = new HashSet<string>(
            config.Blocks.Where(b => b.IsCollection).Select(b => b.LogicalName),
            StringComparer.OrdinalIgnoreCase);

        rows = rows
            .GroupBy(r => r.GetValueOrDefault(config.Grouping.PropertyLogicalName))
            .Select(g => MergeGroup(g, collectionBlockNames))
            .ToList();

        return rows;
    }

    private bool AutoDetectHeaderRow(CsvReader csv, string[]? headerColumnTemplate, bool autoDetectHeader = false)
    {
        if (autoDetectHeader && headerColumnTemplate != null)
        {
            var csvHeaders = csv.Parser.Record;
            var hasHeaderRecord = csvHeaders?.Intersect(headerColumnTemplate).Count() == csvHeaders?.Length;

            return hasHeaderRecord;
        }

        return false;
    }

    private static int ResolveBlockStartIndex(CsvFileBlockConfiguration block, CsvReader csv,
        out bool variantMatched)
    {
        variantMatched = false;

        // If variants are provided, find the marker in the current record and start right after it.
        if (block.Variants is not { Count: > 0 })
        {
            return Math.Max(0, block.StartIndex);
        }

        var record = csv.Parser.Record ?? [];

        for (int i = 0; i < record.Length; i++)
        {
            if (block.Variants.Any(v => string.Equals(record[i], v, StringComparison.OrdinalIgnoreCase)))
            {
                variantMatched = true;
                return i + 1;
            }
        }

        return Math.Max(0, block.StartIndex);
    }

    private static string? ResolveValue(CsvReader csv, string[]? headerRow, bool hasHeader,
        CsvFileParameterMapping csvFileParameter)
    {
        return ResolveValue(csv, headerRow, hasHeader, csvFileParameter.Index, csvFileParameter.Variants,
            csvFileParameter.Offset, csvFileParameter.Source);
    }

    /// <summary>
    /// Top-level resolution for a parameter mapping. When <see cref="CsvFileParameterMapping.MergeFrom"/>
    /// contains entries, each source is resolved independently and the results are
    /// concatenated with <see cref="CsvFileParameterMapping.MergeSeparator"/>.
    /// Otherwise falls through to the standard single-value <see cref="ResolveValue"/> path.
    /// </summary>
    private static string? ResolveMappingValue(CsvReader csv, string[]? headerRow, bool hasHeader,
        CsvFileParameterMapping mapping)
    {
        if (mapping.MergeFrom is not { Count: > 0 })
        {
            return ResolveValue(csv, headerRow, hasHeader, mapping);
        }

        var parts = new List<string>(mapping.MergeFrom.Count);
        foreach (var source in mapping.MergeFrom)
        {
            var part = ResolveValue(csv, headerRow, hasHeader,
                source.Index, source.Variants, source.Offset, source.Source);

            if (part is not null)
            {
                parts.Add(part);
            }
        }

        return parts.Count > 0 ? string.Join(mapping.MergeSeparator, parts) : null;
    }

    private static string? ResolveValue(CsvReader csv, string[]? headerRow, bool hasHeader,
        int index, List<string> variants, int offset, ValueSource source)
    {
        if (source == ValueSource.Header)
        {
            if (!hasHeader || headerRow == null)
            {
                throw new InvalidOperationException("Header is required when ValueSource is Header.");
            }

            if (variants is { Count: > 0 })
            {
                foreach (var h in variants.Where(headerRow.Contains))
                {
                    return csv.GetField(h);
                }
            }

            if (index >= 0 && index < headerRow.Length)
            {
                return headerRow[index];
            }
        }

        if (index >= 0)
        {
            csv.TryGetField(index, out string? value);
            return value;
        }

        // When Index is negative, Source is Cell, and Variants are provided,
        // scan all cells in the current record for a substring match.
        // When Offset is non-zero, return the cell at matchedIndex + Offset instead.
        if (source == ValueSource.Cell && variants is { Count: > 0 })
        {
            var record = csv.Parser.Record ?? [];
            for (var i = 0; i < record.Length; i++)
            {
                if (variants.Any(v =>
                        record[i].Contains(v, StringComparison.OrdinalIgnoreCase)))
                {
                    var targetIndex = i + offset;
                    if (targetIndex >= 0 && targetIndex < record.Length)
                    {
                        return record[targetIndex];
                    }

                    return null;
                }
            }

            return null;
        }

        if (!hasHeader || headerRow is not { Length: > 0 } || variants is not { Count: > 0 })
        {
            return null;
        }

        foreach (var h in variants)
        {
            if (headerRow.Contains(h))
            {
                return csv.GetField(h);
            }
        }

        return null;
    }

    private static int GetNextBoundary(List<CsvFileBlockConfiguration> blocks, int startFromBlockIndex,
        int totalColumns)
    {
        int boundary = totalColumns;

        for (int i = startFromBlockIndex; i < blocks.Count; i++)
        {
            var next = blocks[i];

            if (next.IsCollection)
            {
                boundary = Math.Min(boundary, Math.Max(0, next.StartIndex));
            }
            else
            {
                var minParamIndex = next.Parameters
                    .Where(p => p.Index >= 0)
                    .Select(p => p.Index)
                    .DefaultIfEmpty(totalColumns)
                    .Min();

                boundary = Math.Min(boundary, minParamIndex);
            }

            if (boundary == 0)
            {
                break;
            }
        }

        return boundary <= 0 ? totalColumns : boundary;
    }

    private static string? ApplyTransforms(string? value, string? replacePattern, string? replaceWith,
        string? extractPattern)
    {
        if (!string.IsNullOrEmpty(replacePattern))
        {
            value = Regex.Replace(value ?? string.Empty, replacePattern, replaceWith ?? string.Empty,
                RegexOptions.IgnoreCase);
        }

        if (string.IsNullOrEmpty(extractPattern))
        {
            return value;
        }

        var match = Regex.Match(value ?? string.Empty, extractPattern, RegexOptions.IgnoreCase);
        if (match is { Success: true, Groups.Count: > 1 })
        {
            value = match.Groups[1].Value;
        }

        return value;
    }

    private static Dictionary<string, object?> MergeGroup(
        IGrouping<object?, Dictionary<string, object?>> group,
        HashSet<string> collectionBlockNames)
    {
        var merged = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

        foreach (var row in group)
        {
            foreach (var kvp in row)
            {
                if (collectionBlockNames.Contains(kvp.Key) &&
                    kvp.Value is List<Dictionary<string, object?>> items)
                {
                    if (!merged.TryGetValue(kvp.Key, out var existing) ||
                        existing is not List<Dictionary<string, object?>> existingList)
                    {
                        merged[kvp.Key] = new List<Dictionary<string, object?>>(items);
                    }
                    else
                    {
                        existingList.AddRange(items);
                    }
                }
                else
                {
                    merged[kvp.Key] = kvp.Value;
                }
            }
        }

        return merged;
    }

    private static object? ConvertToType(string? value, CsvFileParameterMapping parameter)
    {
        if (value is null)
        {
            return null;
        }

        var type = parameter.Type;
        var format = parameter.Format;

        switch (type)
        {
            case CsvParameterType.String:
                return value;

            case CsvParameterType.Int:
                return int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var i) ? i : null;

            case CsvParameterType.Long:
                return long.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var l) ? l : null;

            case CsvParameterType.Decimal:
                return decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out var d) ? d : null;

            case CsvParameterType.Double:
                return double.TryParse(value, NumberStyles.Float | NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out var dbl) ? dbl : null;

            case CsvParameterType.Bool:
                if (parameter.TrueValues is { Count: > 0 })
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        return null;
                    }

                    var normalized = value.Trim();
                    return parameter.TrueValues.Any(tv =>
                        string.Equals(tv, normalized, StringComparison.OrdinalIgnoreCase));
                }

                return bool.TryParse(value, out var b) ? b : null;

            case CsvParameterType.DateTime:
                if (string.IsNullOrWhiteSpace(value))
                {
                    return null;
                }

                // Build the list of formats to try: Format first, then Formats.
                var formats = new List<string>();
                if (!string.IsNullOrWhiteSpace(format))
                {
                    formats.Add(format);
                }

                if (parameter.Formats is { Count: > 0 })
                {
                    formats.AddRange(parameter.Formats);
                }

                // When the configuration explicitly declares a UTC offset,
                // parse as DateTimeOffset so the offset from the data is honoured.
                if (parameter.HasUtcOffset)
                {
                    // Normalize compact offsets like -0300 → -03:00 so that the
                    // standard zzz specifier can parse them.
                    var normalizedValue = NormalizeUtcOffset(value);

                    if (DateTimeOffset.TryParseExact(normalizedValue, [.. formats],
                            CultureInfo.InvariantCulture, DateTimeStyles.None, out var dto))
                    {
                        return dto.UtcDateTime;
                    }

                    return null;
                }

                DateTime parsed;

                if (formats.Count > 0)
                {
                    if (!DateTime.TryParseExact(value, [.. formats],
                            CultureInfo.InvariantCulture, DateTimeStyles.None, out var dtExact))
                    {
                        return null;
                    }

                    parsed = dtExact;
                }
                else if (!DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
                {
                    return null;
                }
                else
                {
                    parsed = dt;
                }

                // If a time zone is configured, interpret the parsed value as
                // local time in that zone and convert to UTC.
                if (!string.IsNullOrWhiteSpace(parameter.TimeZoneId))
                {
                    var timeZone = TimeZoneInfo.FindSystemTimeZoneById(parameter.TimeZoneId);
                    var unspecified = DateTime.SpecifyKind(parsed, DateTimeKind.Unspecified);
                    return TimeZoneInfo.ConvertTimeToUtc(unspecified, timeZone);
                }

                // No time zone configured: treat the parsed value as UTC.
                return DateTime.SpecifyKind(parsed, DateTimeKind.Utc);

            default:
                return value;
        }
    }

    /// <summary>
    /// Normalizes compact UTC offsets such as <c>-0300</c> or <c>+0530</c>
    /// into the colon-separated form <c>-03:00</c> / <c>+05:30</c> expected
    /// by the <c>zzz</c> format specifier.
    /// </summary>
    private static string NormalizeUtcOffset(string value)
    {
        return Regex.Replace(value, @"([+-])(\d{2})(\d{2})\s*$", "$1$2:$3");
    }

    /// <summary>
    /// Resolves the <see cref="System.Text.Encoding"/> to use when reading
    /// the CSV stream.
    /// <list type="number">
    ///   <item>If <paramref name="configuredEncoding"/> is specified, use it.</item>
    ///   <item>Otherwise use <see cref="CharsetDetector"/> (UTF-unknown) to
    ///         auto-detect the encoding from the stream content.</item>
    ///   <item>Fall back to UTF-8 when detection is inconclusive.</item>
    /// </list>
    /// </summary>
    private static Encoding ResolveEncoding(Stream stream, string? configuredEncoding)
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        // 1. Explicit encoding from configuration.
        if (!string.IsNullOrWhiteSpace(configuredEncoding))
        {
            return Encoding.GetEncoding(configuredEncoding);
        }

        // 2. Auto-detect using UTF-unknown.
        if (!stream.CanSeek)
        {
            return Encoding.UTF8;
        }

        var position = stream.Position;
        var result = CharsetDetector.DetectFromStream(stream);
        stream.Position = position;

        if (result.Detected is { Encoding: not null, Confidence: >= 0.5f })
        {
            return result.Detected.Encoding;
        }

        // 3. Fallback.
        return Encoding.UTF8;
    }
}