using ApimSubscriptionManager.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ApimSubscriptionManager.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<SubscriptionCommandService>();
        services.AddScoped<SubscriptionQueryService>();
        return services;
    }
}
