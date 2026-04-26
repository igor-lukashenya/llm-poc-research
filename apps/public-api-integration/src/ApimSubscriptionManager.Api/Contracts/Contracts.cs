namespace ApimSubscriptionManager.Api.Contracts;

public record CreateSubscriptionRequest(string DisplayName, List<string> ProductIds);

public record UpdateProductsRequest(List<string> ProductIds);

public record SubscriptionResponse(
    Guid Id,
    string DisplayName,
    string OwnerId,
    string State,
    List<string> ProductIds,
    string ActiveKey,
    string ActiveKeyValue,
    DateTime CreatedAt,
    DateTime LastRotatedAt,
    DateTime RotationDueAt,
    bool IsRotationDue,
    bool IsRotationApproaching);

public record PaginatedResponse<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages,
    bool HasNextPage,
    bool HasPreviousPage);
