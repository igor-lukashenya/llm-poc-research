using ApimSubscriptionManager.Api.Contracts;
using ApimSubscriptionManager.Application.Services;
using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Api.Endpoints;

public static class AdminEndpoints
{
    public static RouteGroupBuilder MapAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/admin/subscriptions").WithTags("Admin");

        group.MapGet("/", ListAllSubscriptions);
        group.MapGet("/rotation-status", GetRotationStatus);

        return group;
    }

    private static async Task<IResult> ListAllSubscriptions(
        SubscriptionQueryService queryService,
        string? owner = null,
        string? name = null,
        string? state = null,
        string? sortBy = null,
        bool desc = false,
        int page = 1,
        int pageSize = 20)
    {
        var result = await queryService.ListAllAsync(owner, name, state, sortBy, desc, page, pageSize);
        return Results.Ok(SubscriptionEndpoints.MapToPaginatedResponse(result));
    }

    private static async Task<IResult> GetRotationStatus(
        SubscriptionQueryService queryService,
        int page = 1,
        int pageSize = 20)
    {
        var result = await queryService.GetRotationStatusAsync(page, pageSize);
        return Results.Ok(SubscriptionEndpoints.MapToPaginatedResponse(result));
    }
}
