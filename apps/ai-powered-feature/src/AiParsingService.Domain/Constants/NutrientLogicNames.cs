namespace AiParsingService.Domain.Constants;

public static class NutrientLogicNames
{
    public const string Code = "nutrientcode";
    public const string Name = "nutrientname";
    public const string Result = "nutrientresult";
    public const string Gh = "nutrientgh";
    public const string Nh = "nutrientnh";
    public const string LowerLimit = "nutrientlowerlimit";
    public const string MaxGh = "nutrientmaxgh";
    public const string Target = "nutrienttarget";
    public const string UpperLimit = "nutrientupperlimit";
    public const string MaxNh = "nutrientmaxnh";
    public const string Unit = "nutrientunit";
    public const string TestMethod = "nutrienttestmethod";

    public static IReadOnlyCollection<string> All = new HashSet<string>
    {
        Code, Name, Result, Gh, Nh, LowerLimit,
        MaxGh, Target, UpperLimit, MaxNh, Unit, TestMethod
    };
}
