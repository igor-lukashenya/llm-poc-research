using ApimSubscriptionManager.Application.Abstractions;

namespace ApimSubscriptionManager.Infrastructure.ExternalServices;

public class MockApimClient : IApimClient
{
    public Task<string> CreateSubscriptionAsync(string displayName, IEnumerable<string> productIds)
    {
        return Task.FromResult(Guid.NewGuid().ToString());
    }

    public Task CancelSubscriptionAsync(string externalId)
    {
        return Task.CompletedTask;
    }

    public Task<(string Primary, string Secondary)> RegenerateKeyAsync(string externalId, bool primary)
    {
        var key = Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..22];
        return primary
            ? Task.FromResult((key, string.Empty))
            : Task.FromResult((string.Empty, key));
    }

    public Task UpdateProductsAsync(string externalId, IEnumerable<string> productIds)
    {
        return Task.CompletedTask;
    }
}
