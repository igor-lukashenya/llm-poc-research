using AiParsingService.Domain.Entities;
using Parsing.Configuration;

namespace AiParsingService.Application.Abstractions;

public record TemplateWithConfiguration(ParsingTemplate Template, CsvFileParsingConfiguration Configuration);

public interface ITemplateRepository
{
    Task<TemplateWithConfiguration?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<TemplateWithConfiguration>> GetAllAsync();
    Task AddAsync(TemplateWithConfiguration template);
    Task UpdateAsync(TemplateWithConfiguration template);
    Task DeleteAsync(Guid id);
}
