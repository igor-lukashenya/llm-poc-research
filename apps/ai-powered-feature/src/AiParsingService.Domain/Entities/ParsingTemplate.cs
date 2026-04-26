namespace AiParsingService.Domain.Entities;

public class ParsingTemplate
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Configuration is stored at the repository level as CsvFileParsingConfiguration

    private ParsingTemplate() { }

    public static ParsingTemplate Create(string name)
    {
        var now = DateTime.UtcNow;
        return new ParsingTemplate
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    public void UpdateName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }

    internal static ParsingTemplate Seed(Guid id, string name, DateTime createdAt)
    {
        return new ParsingTemplate
        {
            Id = id,
            Name = name,
            CreatedAt = createdAt,
            UpdatedAt = createdAt
        };
    }
}
