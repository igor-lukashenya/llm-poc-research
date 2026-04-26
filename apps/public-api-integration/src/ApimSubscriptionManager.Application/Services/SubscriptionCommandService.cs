using ApimSubscriptionManager.Application.Abstractions;
using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Application.Services;

public class SubscriptionCommandService
{
    private readonly ISubscriptionRepository _repository;
    private readonly IApimClient _apimClient;

    public SubscriptionCommandService(ISubscriptionRepository repository, IApimClient apimClient)
    {
        _repository = repository;
        _apimClient = apimClient;
    }

    public async Task<Subscription> CreateAsync(string displayName, string ownerId, IEnumerable<string> productIds)
    {
        var subscription = Subscription.Create(displayName, ownerId, productIds);
        await _apimClient.CreateSubscriptionAsync(displayName, productIds);
        await _repository.AddAsync(subscription);
        return subscription;
    }

    public async Task CancelAsync(Guid id, string ownerId)
    {
        var subscription = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Subscription {id} not found.");

        if (subscription.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You do not own this subscription.");

        subscription.Cancel();
        await _apimClient.CancelSubscriptionAsync(id.ToString());
        await _repository.UpdateAsync(subscription);
    }

    public async Task RotateKeysAsync(Guid id, string ownerId)
    {
        var subscription = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Subscription {id} not found.");

        if (subscription.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You do not own this subscription.");

        subscription.RotateKeys();
        await _repository.UpdateAsync(subscription);
    }

    public async Task ReplaceProductsAsync(Guid id, string ownerId, IEnumerable<string> productIds)
    {
        var subscription = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Subscription {id} not found.");

        if (subscription.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You do not own this subscription.");

        subscription.ReplaceProducts(productIds);
        await _apimClient.UpdateProductsAsync(id.ToString(), productIds);
        await _repository.UpdateAsync(subscription);
    }
}
