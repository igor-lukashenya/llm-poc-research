using Parsing.Configuration;
using System.Text.RegularExpressions;

namespace AiParsingService.Application.Validation;

public record ValidationResult(bool IsValid, List<string> Errors, List<string> Warnings);

public static class ConfigurationValidator
{
    public static ValidationResult Validate(CsvFileParsingConfiguration config)
    {
        var errors = new List<string>();
        var warnings = new List<string>();

        if (string.IsNullOrWhiteSpace(config.Separator))
            errors.Add("Separator is required.");

        if (config.Blocks == null || config.Blocks.Count == 0)
        {
            errors.Add("At least one block is required.");
            return new ValidationResult(errors.Count == 0, errors, warnings);
        }

        foreach (var block in config.Blocks)
        {
            if (string.IsNullOrWhiteSpace(block.LogicalName))
                errors.Add("Block logical name is required.");

            if (block.IsCollection && block.ItemSize <= 0)
                errors.Add($"Collection block '{block.LogicalName}' must have ItemSize > 0.");

            if (block.Parameters == null || block.Parameters.Count == 0)
            {
                warnings.Add($"Block '{block.LogicalName}' has no parameters.");
                continue;
            }

            foreach (var param in block.Parameters)
            {
                if (string.IsNullOrWhiteSpace(param.LogicalName))
                    errors.Add($"Parameter in block '{block.LogicalName}' has no logical name.");

                if (param.Index < 0 && (param.Variants == null || param.Variants.Count == 0))
                    errors.Add($"Parameter '{param.LogicalName}' has negative index without variants.");

                if (!string.IsNullOrEmpty(param.ReplacePattern))
                {
                    try { Regex.Match("", param.ReplacePattern); }
                    catch { errors.Add($"Parameter '{param.LogicalName}' has invalid ReplacePattern regex."); }
                }

                if (!string.IsNullOrEmpty(param.ExtractPattern))
                {
                    try { Regex.Match("", param.ExtractPattern); }
                    catch { errors.Add($"Parameter '{param.LogicalName}' has invalid ExtractPattern regex."); }
                }

                if (param.Type == CsvParameterType.DateTime && string.IsNullOrEmpty(param.Format) && (param.Formats == null || param.Formats.Count == 0))
                    warnings.Add($"DateTime parameter '{param.LogicalName}' has no format specified.");
            }
        }

        return new ValidationResult(errors.Count == 0, errors, warnings);
    }
}
