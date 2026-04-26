namespace ApimSubscriptionManager.Application.Abstractions;

public interface IApimClient
{
    Task<string> CreateSubscriptionAsync(string displayName, IEnumerable<string> productIds);
    Task CancelSubscriptionAsync(string externalId);
    Task<(string Primary, string Secondary)> RegenerateKeyAsync(string externalId, bool primary);
    Task UpdateProductsAsync(string externalId, IEnumerable<string> productIds);
}
