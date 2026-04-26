using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.ApiManagement;
using Azure.ResourceManager.ApiManagement.Models;
using ApimSubscriptionManager.Application.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ApimSubscriptionManager.Infrastructure.ExternalServices;

public class AzureApimClient : IApimClient
{
    private readonly ApimClientOptions _options;
    private readonly ILogger<AzureApimClient> _logger;
    private readonly ArmClient _armClient;

    public AzureApimClient(IOptions<ApimClientOptions> options, ILogger<AzureApimClient> logger)
    {
        _options = options.Value;
        _logger = logger;

        TokenCredential credential = !string.IsNullOrEmpty(_options.TenantId)
            ? new ClientSecretCredential(_options.TenantId, _options.ClientId, _options.ClientSecret)
            : new DefaultAzureCredential();

        _armClient = new ArmClient(credential);
    }

    public async Task<string> CreateSubscriptionAsync(string displayName, IEnumerable<string> productIds)
    {
        var service = await GetServiceAsync();
        var sid = $"sub-{Guid.NewGuid():N}"[..32];

        var content = new ApiManagementSubscriptionCreateOrUpdateContent
        {
            DisplayName = displayName,
            Scope = $"/products/{productIds.First()}",
            State = SubscriptionState.Active
        };

        _logger.LogInformation("Creating APIM subscription {Id} for {DisplayName}", sid, displayName);

        var response = await service.GetApiManagementSubscriptions()
            .CreateOrUpdateAsync(WaitUntil.Completed, sid, content);

        return response.Value.Data.Name;
    }

    public async Task CancelSubscriptionAsync(string externalId)
    {
        var subscription = await GetSubscriptionResourceAsync(externalId);

        _logger.LogInformation("Cancelling APIM subscription {Id}", externalId);

        var etag = await GetETagAsync(subscription);
        await subscription.DeleteAsync(WaitUntil.Completed, etag);
    }

    public async Task<(string Primary, string Secondary)> RegenerateKeyAsync(string externalId, bool primary)
    {
        var subscription = await GetSubscriptionResourceAsync(externalId);

        _logger.LogInformation("Regenerating {KeyType} key for subscription {Id}",
            primary ? "Primary" : "Secondary", externalId);

        if (primary)
            await subscription.RegeneratePrimaryKeyAsync();
        else
            await subscription.RegenerateSecondaryKeyAsync();

        var secrets = await subscription.GetSecretsAsync();
        return (secrets.Value.PrimaryKey ?? string.Empty, secrets.Value.SecondaryKey ?? string.Empty);
    }

    public async Task UpdateProductsAsync(string externalId, IEnumerable<string> productIds)
    {
        var subscription = await GetSubscriptionResourceAsync(externalId);
        var etag = await GetETagAsync(subscription);

        var patchData = new ApiManagementSubscriptionPatch
        {
            Scope = $"/products/{productIds.First()}"
        };

        _logger.LogInformation("Updating products for subscription {Id}", externalId);

        await subscription.UpdateAsync(etag, patchData);
    }

    private async Task<ApiManagementServiceResource> GetServiceAsync()
    {
        var resourceId = ApiManagementServiceResource.CreateResourceIdentifier(
            _options.SubscriptionId,
            _options.ResourceGroupName,
            _options.ServiceName);

        return await _armClient.GetApiManagementServiceResource(resourceId).GetAsync();
    }

    private async Task<ApiManagementSubscriptionResource> GetSubscriptionResourceAsync(string subscriptionId)
    {
        var service = await GetServiceAsync();
        return await service.GetApiManagementSubscriptionAsync(subscriptionId);
    }

    private static async Task<ETag> GetETagAsync(ApiManagementSubscriptionResource subscription)
    {
        var response = await subscription.GetAsync();
        var etagHeader = response.GetRawResponse().Headers
            .FirstOrDefault(h => h.Name.Equals("ETag", StringComparison.OrdinalIgnoreCase));
        return etagHeader.Value is not null ? new ETag(etagHeader.Value) : ETag.All;
    }
}
