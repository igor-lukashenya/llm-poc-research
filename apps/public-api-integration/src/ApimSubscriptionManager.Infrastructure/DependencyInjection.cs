using ApimSubscriptionManager.Application.Abstractions;
using ApimSubscriptionManager.Domain.Entities;
using ApimSubscriptionManager.Domain.Enums;
using ApimSubscriptionManager.Infrastructure.ExternalServices;
using ApimSubscriptionManager.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ApimSubscriptionManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var repository = new InMemorySubscriptionRepository();
        SeedData(repository);

        services.AddSingleton<ISubscriptionRepository>(repository);
        services.AddSingleton<InMemorySubscriptionRepository>(repository);

        var apimSection = configuration.GetSection(ApimClientOptions.SectionName);
        if (apimSection.Exists() && !string.IsNullOrEmpty(apimSection["ServiceName"]))
        {
            services.Configure<ApimClientOptions>(apimSection);
            services.AddSingleton<IApimClient, AzureApimClient>();
        }
        else
        {
            services.AddSingleton<IApimClient, MockApimClient>();
        }

        return services;
    }

    private static void SeedData(InMemorySubscriptionRepository repository)
    {
        var now = DateTime.UtcNow;

        var subscriptions = new[]
        {
            Subscription.Seed(
                Guid.Parse("a1b2c3d4-0001-0001-0001-000000000001"),
                "Contoso Weather API", "user-alice",
                ["weather-basic", "weather-premium"],
                now.AddDays(-80), now.AddDays(-80)),

            Subscription.Seed(
                Guid.Parse("a1b2c3d4-0002-0002-0002-000000000002"),
                "Fabrikam Maps Service", "user-bob",
                ["maps-standard"],
                now.AddDays(-30), now.AddDays(-30)),

            Subscription.Seed(
                Guid.Parse("a1b2c3d4-0003-0003-0003-000000000003"),
                "Northwind Traders Data", "user-alice",
                ["data-analytics", "data-export"],
                now.AddDays(-100), now.AddDays(-100)),

            Subscription.Seed(
                Guid.Parse("a1b2c3d4-0004-0004-0004-000000000004"),
                "Adventure Works Catalog", "user-charlie",
                ["catalog-read"],
                now.AddDays(-60), now.AddDays(-45)),

            Subscription.Seed(
                Guid.Parse("a1b2c3d4-0005-0005-0005-000000000005"),
                "Woodgrove Bank Integration", "user-bob",
                ["banking-api", "payments-api"],
                now.AddDays(-120), now.AddDays(-120),
                state: SubscriptionState.Cancelled),
        };

        repository.Seed(subscriptions);
    }
}
