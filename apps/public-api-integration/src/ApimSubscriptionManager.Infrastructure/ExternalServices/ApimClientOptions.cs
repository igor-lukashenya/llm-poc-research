namespace ApimSubscriptionManager.Infrastructure.ExternalServices;

public class ApimClientOptions
{
    public const string SectionName = "AzureApim";

    public string SubscriptionId { get; set; } = string.Empty;
    public string ResourceGroupName { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;

    /// <summary>
    /// Optional. When set, uses ClientSecretCredential instead of DefaultAzureCredential.
    /// </summary>
    public string? TenantId { get; set; }
    public string? ClientId { get; set; }
    public string? ClientSecret { get; set; }
}
