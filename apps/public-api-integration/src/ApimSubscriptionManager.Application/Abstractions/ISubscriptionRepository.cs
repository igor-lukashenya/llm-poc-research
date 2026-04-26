using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Application.Abstractions;

public interface ISubscriptionRepository
{
    Task<Subscription?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Subscription>> GetByOwnerAsync(string ownerId);
    Task<IReadOnlyList<Subscription>> GetAllAsync();
    Task AddAsync(Subscription subscription);
    Task UpdateAsync(Subscription subscription);
    Task DeleteAsync(Guid id);
}
