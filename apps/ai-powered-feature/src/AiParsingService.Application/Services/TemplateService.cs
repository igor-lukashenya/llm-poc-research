using AiParsingService.Application.Abstractions;
using AiParsingService.Application.Validation;
using AiParsingService.Domain.Entities;
using Parsing.Configuration;

namespace AiParsingService.Application.Services;

public class TemplateService
{
    private readonly ITemplateRepository _repository;

    public TemplateService(ITemplateRepository repository)
    {
        _repository = repository;
    }

    public async Task<TemplateWithConfiguration?> GetByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IReadOnlyList<TemplateWithConfiguration>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<(TemplateWithConfiguration? Result, ValidationResult Validation)> CreateAsync(
        string name, CsvFileParsingConfiguration configuration)
    {
        var validation = ConfigurationValidator.Validate(configuration);
        if (!validation.IsValid)
            return (null, validation);

        var template = ParsingTemplate.Create(name);
        var withConfig = new TemplateWithConfiguration(template, configuration);
        await _repository.AddAsync(withConfig);

        return (withConfig, validation);
    }

    public async Task<(TemplateWithConfiguration? Result, ValidationResult? Validation, bool Found)> UpdateAsync(
        Guid id, string name, CsvFileParsingConfiguration configuration)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
            return (null, null, false);

        var validation = ConfigurationValidator.Validate(configuration);
        if (!validation.IsValid)
            return (null, validation, true);

        existing.Template.UpdateName(name);
        var updated = new TemplateWithConfiguration(existing.Template, configuration);
        await _repository.UpdateAsync(updated);

        return (updated, validation, true);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }
}
