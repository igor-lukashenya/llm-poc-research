using ApimSubscriptionManager.Domain.Enums;

namespace ApimSubscriptionManager.Domain.Entities;

public class Subscription
{
    public Guid Id { get; private set; }
    public string DisplayName { get; private set; } = string.Empty;
    public string OwnerId { get; private set; } = string.Empty;
    public SubscriptionState State { get; private set; }
    public List<string> ProductIds { get; private set; } = [];
    public string PrimaryKey { get; private set; } = string.Empty;
    public string SecondaryKey { get; private set; } = string.Empty;
    public ActiveKey ActiveKey { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime LastRotatedAt { get; private set; }
    public DateTime RotationDueAt { get; private set; }

    private static readonly int RotationIntervalDays = 90;
    private static readonly int RotationWarningDays = 5;

    private Subscription() { }

    public static Subscription Create(string displayName, string ownerId, IEnumerable<string> productIds)
    {
        var now = DateTime.UtcNow;
        return new Subscription
        {
            Id = Guid.NewGuid(),
            DisplayName = displayName,
            OwnerId = ownerId,
            State = SubscriptionState.Active,
            ProductIds = productIds.ToList(),
            PrimaryKey = GenerateKey(),
            SecondaryKey = GenerateKey(),
            ActiveKey = ActiveKey.Primary,
            CreatedAt = now,
            LastRotatedAt = now,
            RotationDueAt = now.AddDays(RotationIntervalDays)
        };
    }

    public void Cancel()
    {
        if (State == SubscriptionState.Cancelled)
            throw new InvalidOperationException("Subscription is already cancelled.");

        State = SubscriptionState.Cancelled;
    }

    public void ReplaceProducts(IEnumerable<string> productIds)
    {
        if (State == SubscriptionState.Cancelled)
            throw new InvalidOperationException("Cannot modify a cancelled subscription.");

        ProductIds = productIds.ToList();
    }

    public void RotateKeys()
    {
        if (State == SubscriptionState.Cancelled)
            throw new InvalidOperationException("Cannot rotate keys on a cancelled subscription.");

        var now = DateTime.UtcNow;

        if (ActiveKey == ActiveKey.Primary)
        {
            SecondaryKey = GenerateKey();
            ActiveKey = ActiveKey.Secondary;
        }
        else
        {
            PrimaryKey = GenerateKey();
            ActiveKey = ActiveKey.Primary;
        }

        LastRotatedAt = now;
        RotationDueAt = now.AddDays(RotationIntervalDays);
    }

    public bool IsRotationDue() => DateTime.UtcNow >= RotationDueAt;

    public bool IsRotationApproaching() =>
        !IsRotationDue() && DateTime.UtcNow >= RotationDueAt.AddDays(-RotationWarningDays);

    public string GetActiveKeyValue() => ActiveKey == ActiveKey.Primary ? PrimaryKey : SecondaryKey;

    private static string GenerateKey() => Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..22];

    // For seeding/testing
    internal static Subscription Seed(
        Guid id, string displayName, string ownerId, IEnumerable<string> productIds,
        DateTime createdAt, DateTime lastRotatedAt, ActiveKey activeKey = ActiveKey.Primary,
        SubscriptionState state = SubscriptionState.Active)
    {
        return new Subscription
        {
            Id = id,
            DisplayName = displayName,
            OwnerId = ownerId,
            State = state,
            ProductIds = productIds.ToList(),
            PrimaryKey = GenerateKey(),
            SecondaryKey = GenerateKey(),
            ActiveKey = activeKey,
            CreatedAt = createdAt,
            LastRotatedAt = lastRotatedAt,
            RotationDueAt = lastRotatedAt.AddDays(RotationIntervalDays)
        };
    }
}
