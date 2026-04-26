using System.Collections.Concurrent;
using AiParsingService.Application.Abstractions;

namespace AiParsingService.Infrastructure.Repositories;

public class InMemoryTemplateRepository : ITemplateRepository
{
    private readonly ConcurrentDictionary<Guid, TemplateWithConfiguration> _store = new();

    public Task<TemplateWithConfiguration?> GetByIdAsync(Guid id)
    {
        _store.TryGetValue(id, out var template);
        return Task.FromResult(template);
    }

    public Task<IReadOnlyList<TemplateWithConfiguration>> GetAllAsync()
    {
        return Task.FromResult<IReadOnlyList<TemplateWithConfiguration>>(_store.Values.ToList());
    }

    public Task AddAsync(TemplateWithConfiguration template)
    {
        _store[template.Template.Id] = template;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(TemplateWithConfiguration template)
    {
        _store[template.Template.Id] = template;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        _store.TryRemove(id, out _);
        return Task.CompletedTask;
    }

    public void Seed(IEnumerable<TemplateWithConfiguration> templates)
    {
        foreach (var t in templates)
            _store[t.Template.Id] = t;
    }
}
