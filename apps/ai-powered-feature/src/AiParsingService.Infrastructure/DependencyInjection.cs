using AiParsingService.Application.Abstractions;
using AiParsingService.Domain.Entities;
using AiParsingService.Infrastructure.Repositories;
using AiParsingService.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Parsing;
using Parsing.Configuration;

namespace AiParsingService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Template repository with seed data
        var repository = new InMemoryTemplateRepository();
        SeedData(repository);
        services.AddSingleton<ITemplateRepository>(repository);

        // AI config generator: real or mock
        var aiSection = configuration.GetSection(AzureOpenAiOptions.SectionName);
        if (aiSection.Exists() && !string.IsNullOrEmpty(aiSection["Endpoint"]))
        {
            services.Configure<AzureOpenAiOptions>(aiSection);
            services.AddSingleton<IConfigurationGeneratorService, SemanticKernelConfigurationGeneratorService>();
        }
        else
        {
            services.AddSingleton<IConfigurationGeneratorService, MockConfigurationGeneratorService>();
        }

        // CSV file parser
        services.AddSingleton<ICsvFileParser, CsvFileParser>();

        return services;
    }

    private static void SeedData(InMemoryTemplateRepository repository)
    {
        var templates = new[]
        {
            new TemplateWithConfiguration(
                ParsingTemplate.Seed(
                    Guid.Parse("c0c0c0c0-0001-0001-0001-000000000001"),
                    "FOSS Benchtop (comma-separated)",
                    DateTime.UtcNow.AddDays(-7)),
                new CsvFileParsingConfiguration
                {
                    Separator = ",",
                    HasHeader = true,
                    Grouping = new CsvGroupingConfiguration { PropertyLogicalName = "customerreference" },
                    Blocks =
                    [
                        new CsvFileBlockConfiguration
                        {
                            LogicalName = "sampledetails",
                            IsCollection = false,
                            StartIndex = 0,
                            Parameters =
                            [
                                new CsvFileParameterMapping { Index = 0, LogicalName = "sampledate", Variants = ["Analysis Time"], Source = ValueSource.Header, Type = CsvParameterType.DateTime },
                                new CsvFileParameterMapping { Index = 1, LogicalName = "productname", Variants = ["Product Name"], Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 2, LogicalName = "productcode", Variants = ["Product Code"], Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 4, LogicalName = "customerreference", Variants = ["Sample Number"], Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 6, LogicalName = "devicename", Variants = ["Instrument Name"], Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 7, LogicalName = "devicecode", Variants = ["Instrument Serial Number"], Source = ValueSource.Header, Type = CsvParameterType.String }
                            ]
                        },
                        new CsvFileBlockConfiguration
                        {
                            LogicalName = "results",
                            IsCollection = true,
                            StartIndex = 8,
                            ItemSize = 4,
                            Parameters =
                            [
                                new CsvFileParameterMapping { Index = 0, LogicalName = "nutrientname", Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 0, LogicalName = "nutrientresult", Source = ValueSource.Cell, Type = CsvParameterType.Double },
                                new CsvFileParameterMapping { Index = 2, LogicalName = "nutrientgh", Source = ValueSource.Cell, Type = CsvParameterType.Double },
                                new CsvFileParameterMapping { Index = 3, LogicalName = "nutrientnh", Source = ValueSource.Cell, Type = CsvParameterType.Double }
                            ]
                        }
                    ]
                }),

            new TemplateWithConfiguration(
                ParsingTemplate.Seed(
                    Guid.Parse("c0c0c0c0-0002-0002-0002-000000000002"),
                    "Sample Default (semicolon-separated)",
                    DateTime.UtcNow.AddDays(-3)),
                new CsvFileParsingConfiguration
                {
                    Separator = ";",
                    HasHeader = true,
                    Grouping = new CsvGroupingConfiguration { PropertyLogicalName = "customerreference" },
                    Blocks =
                    [
                        new CsvFileBlockConfiguration
                        {
                            LogicalName = "sampledetails",
                            IsCollection = false,
                            StartIndex = 0,
                            Parameters =
                            [
                                new CsvFileParameterMapping { Index = 0, LogicalName = "sampledate", Type = CsvParameterType.DateTime, Format = "dd/MM/yyyy HH:mm:ss" },
                                new CsvFileParameterMapping { Index = 1, LogicalName = "productname", Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 2, LogicalName = "productcode", Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 4, LogicalName = "customerreference", Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 5, LogicalName = "comment", Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 6, LogicalName = "devicename", Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 7, LogicalName = "devicecode", Type = CsvParameterType.String }
                            ]
                        },
                        new CsvFileBlockConfiguration
                        {
                            LogicalName = "results",
                            IsCollection = true,
                            StartIndex = 8,
                            ItemSize = 4,
                            Parameters =
                            [
                                new CsvFileParameterMapping { Index = 0, LogicalName = "nutrientname", Source = ValueSource.Header, Type = CsvParameterType.String },
                                new CsvFileParameterMapping { Index = 0, LogicalName = "nutrientresult", Source = ValueSource.Cell, ReplacePattern = ",", ReplaceWith = ".", Type = CsvParameterType.Double },
                                new CsvFileParameterMapping { Index = 2, LogicalName = "nutrientgh", Source = ValueSource.Cell, ReplacePattern = ",", ReplaceWith = ".", Type = CsvParameterType.Double },
                                new CsvFileParameterMapping { Index = 3, LogicalName = "nutrientnh", Source = ValueSource.Cell, ReplacePattern = ",", ReplaceWith = ".", Type = CsvParameterType.Double }
                            ]
                        }
                    ]
                })
        };

        repository.Seed(templates);
    }
}
