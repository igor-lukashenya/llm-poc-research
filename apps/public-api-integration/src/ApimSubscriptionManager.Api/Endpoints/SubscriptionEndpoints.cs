using ApimSubscriptionManager.Api.Contracts;
using ApimSubscriptionManager.Application.Services;
using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Api.Endpoints;

public static class SubscriptionEndpoints
{
    // PoC: simulated user identity via X-User-Id header
    private static string GetUserId(HttpContext ctx) =>
        ctx.Request.Headers["X-User-Id"].FirstOrDefault() ?? "anonymous";

    public static RouteGroupBuilder MapSubscriptionEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/subscriptions").WithTags("Subscriptions");

        group.MapPost("/", CreateSubscription);
        group.MapGet("/", ListSubscriptions);
        group.MapGet("/{id:guid}", GetSubscription);
        group.MapDelete("/{id:guid}", CancelSubscription);
        group.MapPost("/{id:guid}/rotate", RotateKeys);
        group.MapPut("/{id:guid}/products", ReplaceProducts);

        return group;
    }

    private static async Task<IResult> CreateSubscription(
        CreateSubscriptionRequest request,
        SubscriptionCommandService commandService,
        HttpContext ctx)
    {
        var userId = GetUserId(ctx);
        var subscription = await commandService.CreateAsync(request.DisplayName, userId, request.ProductIds);
        return Results.Created($"/api/subscriptions/{subscription.Id}", MapToResponse(subscription));
    }

    private static async Task<IResult> ListSubscriptions(
        SubscriptionQueryService queryService,
        HttpContext ctx,
        string? name = null,
        string? sortBy = null,
        bool desc = false,
        int page = 1,
        int pageSize = 20)
    {
        var userId = GetUserId(ctx);
        var result = await queryService.ListByOwnerAsync(userId, name, sortBy, desc, page, pageSize);
        return Results.Ok(MapToPaginatedResponse(result));
    }

    private static async Task<IResult> GetSubscription(
        Guid id,
        SubscriptionQueryService queryService,
        HttpContext ctx)
    {
        var userId = GetUserId(ctx);
        var subscription = await queryService.GetByIdAsync(id, userId);
        return subscription is null
            ? Results.NotFound()
            : Results.Ok(MapToResponse(subscription));
    }

    private static async Task<IResult> CancelSubscription(
        Guid id,
        SubscriptionCommandService commandService,
        HttpContext ctx)
    {
        var userId = GetUserId(ctx);
        try
        {
            await commandService.CancelAsync(id, userId);
            return Results.NoContent();
        }
        catch (KeyNotFoundException) { return Results.NotFound(); }
        catch (UnauthorizedAccessException) { return Results.Forbid(); }
        catch (InvalidOperationException ex) { return Results.Conflict(new { error = ex.Message }); }
    }

    private static async Task<IResult> RotateKeys(
        Guid id,
        SubscriptionCommandService commandService,
        HttpContext ctx)
    {
        var userId = GetUserId(ctx);
        try
        {
            await commandService.RotateKeysAsync(id, userId);
            return Results.Ok(new { message = "Keys rotated successfully." });
        }
        catch (KeyNotFoundException) { return Results.NotFound(); }
        catch (UnauthorizedAccessException) { return Results.Forbid(); }
        catch (InvalidOperationException ex) { return Results.Conflict(new { error = ex.Message }); }
    }

    private static async Task<IResult> ReplaceProducts(
        Guid id,
        UpdateProductsRequest request,
        SubscriptionCommandService commandService,
        HttpContext ctx)
    {
        var userId = GetUserId(ctx);
        try
        {
            await commandService.ReplaceProductsAsync(id, userId, request.ProductIds);
            return Results.Ok(new { message = "Products updated successfully." });
        }
        catch (KeyNotFoundException) { return Results.NotFound(); }
        catch (UnauthorizedAccessException) { return Results.Forbid(); }
        catch (InvalidOperationException ex) { return Results.Conflict(new { error = ex.Message }); }
    }

    internal static SubscriptionResponse MapToResponse(Subscription s) => new(
        s.Id, s.DisplayName, s.OwnerId, s.State.ToString(), s.ProductIds,
        s.ActiveKey.ToString(), s.GetActiveKeyValue(),
        s.CreatedAt, s.LastRotatedAt, s.RotationDueAt,
        s.IsRotationDue(), s.IsRotationApproaching());

    internal static PaginatedResponse<SubscriptionResponse> MapToPaginatedResponse(
        PaginatedResult<Subscription> result) => new(
        result.Items.Select(MapToResponse).ToList(),
        result.TotalCount, result.Page, result.PageSize,
        result.TotalPages, result.HasNextPage, result.HasPreviousPage);
}
