using ApimSubscriptionManager.Application.Abstractions;
using ApimSubscriptionManager.Domain.Entities;

namespace ApimSubscriptionManager.Application.Services;

public class SubscriptionQueryService
{
    private readonly ISubscriptionRepository _repository;

    public SubscriptionQueryService(ISubscriptionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Subscription?> GetByIdAsync(Guid id, string ownerId)
    {
        var subscription = await _repository.GetByIdAsync(id);
        if (subscription is null || subscription.OwnerId != ownerId)
            return null;

        return subscription;
    }

    public async Task<PaginatedResult<Subscription>> ListByOwnerAsync(
        string ownerId, string? nameFilter, string? sortBy, bool descending, int page, int pageSize)
    {
        var all = await _repository.GetByOwnerAsync(ownerId);
        return ApplyFilterSortPage(all, nameFilter, sortBy, descending, page, pageSize);
    }

    public async Task<PaginatedResult<Subscription>> ListAllAsync(
        string? ownerFilter, string? nameFilter, string? stateFilter,
        string? sortBy, bool descending, int page, int pageSize)
    {
        var all = await _repository.GetAllAsync();

        IEnumerable<Subscription> filtered = all;

        if (!string.IsNullOrWhiteSpace(ownerFilter))
            filtered = filtered.Where(s => s.OwnerId.Equals(ownerFilter, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(stateFilter) && Enum.TryParse<Domain.Enums.SubscriptionState>(stateFilter, true, out var state))
            filtered = filtered.Where(s => s.State == state);

        return ApplyFilterSortPage(filtered.ToList(), nameFilter, sortBy, descending, page, pageSize);
    }

    public async Task<PaginatedResult<Subscription>> GetRotationStatusAsync(int page, int pageSize)
    {
        var all = await _repository.GetAllAsync();
        var atRisk = all
            .Where(s => s.State == Domain.Enums.SubscriptionState.Active)
            .Where(s => s.IsRotationDue() || s.IsRotationApproaching())
            .OrderBy(s => s.RotationDueAt)
            .ToList();

        return Paginate(atRisk, page, pageSize);
    }

    private static PaginatedResult<Subscription> ApplyFilterSortPage(
        IReadOnlyList<Subscription> items, string? nameFilter, string? sortBy, bool descending, int page, int pageSize)
    {
        IEnumerable<Subscription> result = items;

        if (!string.IsNullOrWhiteSpace(nameFilter))
            result = result.Where(s => s.DisplayName.Contains(nameFilter, StringComparison.OrdinalIgnoreCase));

        result = (sortBy?.ToLowerInvariant()) switch
        {
            "name" => descending ? result.OrderByDescending(s => s.DisplayName) : result.OrderBy(s => s.DisplayName),
            "created" => descending ? result.OrderByDescending(s => s.CreatedAt) : result.OrderBy(s => s.CreatedAt),
            "rotation" => descending ? result.OrderByDescending(s => s.RotationDueAt) : result.OrderBy(s => s.RotationDueAt),
            _ => result.OrderByDescending(s => s.CreatedAt)
        };

        return Paginate(result.ToList(), page, pageSize);
    }

    private static PaginatedResult<Subscription> Paginate(IReadOnlyList<Subscription> items, int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var total = items.Count;
        var paged = items.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new PaginatedResult<Subscription>(paged, total, page, pageSize);
    }
}

public record PaginatedResult<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
