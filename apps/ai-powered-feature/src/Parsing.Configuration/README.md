# Parsing Configuration

This project contains configuration models used for parsing external data. It is intended to be reused by services and components that need to describe how incoming data (such as CSV files) should be interpreted and mapped into structured domain structures.

The actual parsing logic is implemented in separate projects (for example, `Parsing` with `CsvFileParser`). This project only contains the configuration contracts.

## CSV Parsing Configuration

The primary configuration type for generic CSV parsing is `CsvFileParsingConfiguration`.

## Core Types

`CsvFileParsingConfiguration` is composed of:

- `CsvFileParsingConfiguration`
  - Global options such as column separator and whether the file has a header.
  - A collection of logical blocks that describe how parts of each row are mapped.
  - Optional grouping options to merge multiple rows into a single logical record.
- `CsvFileBlockConfiguration`
  - Describes one logical block within a row.
  - A block can be a scalar section or a repeating collection.
- `CsvFileParameterMapping`
  - Describes how a single column (or header-derived value) is read, transformed, and converted to a typed value.
- `CsvGroupingConfiguration`
  - Describes how parsed rows should be grouped into higher-level records.
- `CsvParameterType`
  - Enumerates the supported target types (string, numeric types, bool, `DateTime`) used during conversion.

Additional types in this project (such as `ValueSource` and other mapping-specific types) support different parsing scenarios and can be used in more specialized configurations.

## Configuration Details

### CsvFileParsingConfiguration

- `Separator` (string)
  - Column separator used in the CSV file (for example, `","` or `";"`).
- `HasHeader` (bool)
  - Indicates whether the CSV file contains a header row.
  - A header is required when any parameter uses `ValueSource.Header`.
- `Blocks` (list of `CsvFileBlockConfiguration`)
  - Logical blocks that describe how to map sections of a CSV record into structured data.
- `Grouping` (`CsvGroupingConfiguration`, optional)
  - When set, rows will be grouped by a specific logical property to build higher-level records.

### CsvFileBlockConfiguration

- `LogicalName` (string)
  - Logical name of the block.
  - For scalar blocks this becomes a property name; for collection blocks this becomes the collection key in the result.
- `IsCollection` (bool)
  - Indicates whether this block represents a repeating collection of items within a single CSV row.
- `StartIndex` (int)
  - Zero-based starting column index of the block when `Variants` are not used to dynamically locate the block.
- `ItemSize` (int)
  - Number of columns that make up a single item in a collection block.
  - Ignored for non-collection blocks.
- `Variants` (list of string)
  - Optional marker values that can be used to dynamically find the beginning of this block in the current record.
- `Parameters` (list of `CsvFileParameterMapping`)
  - Parameter mappings that describe how individual columns inside the block are read, transformed and converted.

### CsvFileParameterMapping

- `Index` (int)
  - Zero-based index of the column to read.
  - When negative, the parser resolves the value using `Variants` (see below).
- `LogicalName` (string)
  - Logical name of the value produced by this mapping in the parsed result.
- `Variants` (list of string)
  - When `Source` is `Header`: alternative header names (exact match) used to locate the column.
  - When `Source` is `Cell` and `Index` is negative: the parser scans every cell in the current record for a case-insensitive substring match. If `Offset` is zero the matched cell itself is returned; otherwise the cell at `matchedIndex + Offset` is returned. This is useful when the column position varies between file formats.
- `Offset` (int, default `0`)
  - Positional offset applied after a cell is located via `Variants` substring scan.
  - `0` returns the matched cell, `-1` returns the cell immediately before the match, `1` the cell after, etc.
  - Only used when `Source` is `Cell`, `Index` is negative, and `Variants` is not empty.
- `Source` (`ValueSource`)
  - Source of the value: either from a cell in the record or from the header row.
- `ReplacePattern` (string, optional)
  - Regular expression pattern used to replace parts of the raw value before type conversion.
- `ReplaceWith` (string, optional)
  - Replacement text used together with `ReplacePattern`.
- `ExtractPattern` (string, optional)
  - Regular expression pattern used to extract a specific capture group from the raw value.
- `Type` (`CsvParameterType`)
  - Target type to which the value should be converted.
- `TrueValues` (list of string, optional)
  - When `Type` is `Bool`, defines which raw values (after any regex transforms) should be interpreted as `true`.
  - Comparisons are case-insensitive; non-matching non-empty values are interpreted as `false`, and `null`/whitespace stays `null`.
- `Format` (string, optional)
  - Optional format string used for parsing values, for example a date/time pattern when `Type` is `CsvParameterType.DateTime`.
  - When `Formats` is also provided, `Format` is tried first.
- `Formats` (list of string, optional)
  - Additional format strings tried after `Format`. The parser calls `TryParseExact` with all formats combined, so a single config can handle files with different date layouts (e.g., `MM/dd/yy` and `yyyy-MM-dd`).
- `TimeZoneId` (string, optional)
  - When `Type` is `DateTime`, an optional time zone identifier (for example, `UTC` or `Pacific Standard Time`).
  - When specified, parsed values are interpreted in this time zone and converted to UTC.
  - When omitted, parsed `DateTime` values are treated as UTC.

### CsvGroupingConfiguration

- `PropertyLogicalName` (string)
  - Logical name of the property used as a grouping key when combining multiple parsed rows into a single logical record.

### CsvParameterType

Defines the supported target types for CSV parameter values after parsing and conversion:

- `String` – keep the raw text.
- `Int` – convert to 32-bit integer.
- `Long` – convert to 64-bit integer.
- `Decimal` – convert to decimal number.
- `Double` – convert to double-precision floating point number.
- `Bool` – convert to boolean.
- `DateTime` – convert to `DateTime`, optionally using a specified format.

## How Parsing Works (Conceptual)

When used with a compatible parser (for example, `CsvFileParser`):

1. The CSV is read using the configured `Separator` and `HasHeader` settings.
2. For each row, the parser iterates over the configured `Blocks` in order.
3. For scalar blocks (`IsCollection == false`):
   - Each `CsvFileParameterMapping` is evaluated.
   - The value is resolved from the header or cell (`Source` and `Index` / `Variants`).
   - Optional transformations are applied (`ReplacePattern`, `ReplaceWith`, `ExtractPattern`).
   - The value is converted to the requested `Type` using `Format` when applicable.
4. For collection blocks (`IsCollection == true`):
   - A starting index is resolved using `StartIndex` or `Variants` as markers.
   - The parser walks across the row in steps of `ItemSize`, building a collection of items.
   - Each item is built using the block's `Parameters`, with the same resolution and transformation rules as scalar blocks.
5. The result for each row is a dictionary keyed by logical names (block names and parameter names).
6. If `Grouping` is configured, rows are grouped by the configured logical property and merged so that collection blocks are aggregated across rows.

## Example JSON Configuration

Below is an example of how a CSV parsing configuration might be represented in JSON (for example, in `appsettings.json`) to be consumed by a service or other component:

```json
{
  "CsvParsing": {
    "Separator": ";",
    "HasHeader": true,
    "Blocks": [
      {
        "LogicalName": "HeaderInfo",
        "IsCollection": false,
        "StartIndex": 0,
        "ItemSize": 0,
        "Variants": [],
        "Parameters": [
          {
            "Index": 0,
            "LogicalName": "SampleId",
            "Variants": ["SampleId", "Sample_ID"],
            "Source": "Header",
            "Type": "String"
          },
          {
            "Index": 1,
            "LogicalName": "SampleDate",
            "Variants": ["SampleDate"],
            "Source": "Cell",
            "Type": "DateTime",
            "Format": "yyyy-MM-dd"
          }
        ]
      },
      {
        "LogicalName": "Measurements",
        "IsCollection": true,
        "StartIndex": 2,
        "ItemSize": 2,
        "Variants": [],
        "Parameters": [
          {
            "Index": 0,
            "LogicalName": "AnalyteName",
            "Variants": [],
            "Source": "Cell",
            "Type": "String"
          },
          {
            "Index": 1,
            "LogicalName": "AnalyteValue",
            "Variants": [],
            "Source": "Cell",
            "Type": "Decimal",
            "ReplacePattern": ",",
            "ReplaceWith": "."
          }
        ]
      }
    ],
    "Grouping": {
      "PropertyLogicalName": "SampleId"
    }
  }
}
```

> **Note:** The example above uses PascalCase property names to match the .NET configuration types. Each consuming project is responsible for configuring its own JSON serialization settings (for example, naming policy and casing) according to its conventions. Ensure that your JSON serializer is aligned with how you expect these configuration objects to be bound.

## Usage Notes

- Treat this configuration model as the source of truth for how CSV files are interpreted and mapped into structured data.
- Validate configuration where possible (for example, separator characters, index ranges, regex patterns, and type/format combinations).
- When building tools or services that expose this configuration:
  - Provide clear labels and help text matching the descriptions above.
  - Optionally validate mappings before persisting configuration (for example, compile regular expressions, check for overlapping indices).
- The same configuration object can be serialized and passed to any component or service that references this configuration project and uses a compatible CSV parser implementation.
