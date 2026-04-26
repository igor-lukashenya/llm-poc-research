using System.Collections.Concurrent;
using ApimSubscriptionManager.Application.Abstractions;
using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Infrastructure.Repositories;

public class InMemorySubscriptionRepository : ISubscriptionRepository
{
    private readonly ConcurrentDictionary<Guid, Subscription> _store = new();

    public Task<Subscription?> GetByIdAsync(Guid id)
    {
        _store.TryGetValue(id, out var subscription);
        return Task.FromResult(subscription);
    }

    public Task<IReadOnlyList<Subscription>> GetByOwnerAsync(string ownerId)
    {
        var result = _store.Values
            .Where(s => s.OwnerId.Equals(ownerId, StringComparison.OrdinalIgnoreCase))
            .ToList();
        return Task.FromResult<IReadOnlyList<Subscription>>(result);
    }

    public Task<IReadOnlyList<Subscription>> GetAllAsync()
    {
        return Task.FromResult<IReadOnlyList<Subscription>>(_store.Values.ToList());
    }

    public Task AddAsync(Subscription subscription)
    {
        _store[subscription.Id] = subscription;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Subscription subscription)
    {
        _store[subscription.Id] = subscription;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        _store.TryRemove(id, out _);
        return Task.CompletedTask;
    }

    public void Seed(IEnumerable<Subscription> subscriptions)
    {
        foreach (var sub in subscriptions)
            _store[sub.Id] = sub;
    }
}
