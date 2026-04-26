using AiParsingService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AiParsingService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<TemplateService>();
        return services;
    }
}
