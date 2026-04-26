using AiParsingService.Api.Contracts;
using AiParsingService.Application.Services;

namespace AiParsingService.Api.Endpoints;

public static class TemplateEndpoints
{
    public static RouteGroupBuilder MapTemplateEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/templates").WithTags("Templates");

        group.MapGet("/", ListTemplates);
        group.MapGet("/{id:guid}", GetTemplate);
        group.MapPost("/", CreateTemplate);
        group.MapPut("/{id:guid}", UpdateTemplate);
        group.MapDelete("/{id:guid}", DeleteTemplate);

        return group;
    }

    private static async Task<IResult> ListTemplates(TemplateService templateService)
    {
        var all = await templateService.GetAllAsync();
        var response = all.Select(t => new TemplateSummaryResponse(
            t.Template.Id,
            t.Template.Name,
            t.Configuration.Separator,
            t.Template.CreatedAt,
            t.Template.UpdatedAt)).ToList();

        return Results.Ok(response);
    }

    private static async Task<IResult> GetTemplate(Guid id, TemplateService templateService)
    {
        var template = await templateService.GetByIdAsync(id);
        if (template is null) return Results.NotFound();

        return Results.Ok(new TemplateDetailResponse(
            template.Template.Id,
            template.Template.Name,
            template.Configuration,
            template.Template.CreatedAt,
            template.Template.UpdatedAt));
    }

    private static async Task<IResult> CreateTemplate(
        CreateTemplateRequest request,
        TemplateService templateService)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Results.BadRequest(new ErrorResponse("Template name is required."));

        var (result, validation) = await templateService.CreateAsync(request.Name, request.Configuration);

        if (!validation.IsValid)
            return Results.UnprocessableEntity(new ErrorResponse("Configuration validation failed.", validation.Errors));

        return Results.Created($"/api/templates/{result!.Template.Id}", new TemplateDetailResponse(
            result.Template.Id,
            result.Template.Name,
            result.Configuration,
            result.Template.CreatedAt,
            result.Template.UpdatedAt));
    }

    private static async Task<IResult> UpdateTemplate(
        Guid id,
        UpdateTemplateRequest request,
        TemplateService templateService)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Results.BadRequest(new ErrorResponse("Template name is required."));

        var (result, validation, found) = await templateService.UpdateAsync(id, request.Name, request.Configuration);

        if (!found)
            return Results.NotFound();

        if (validation is not null && !validation.IsValid)
            return Results.UnprocessableEntity(new ErrorResponse("Configuration validation failed.", validation.Errors));

        return Results.Ok(new TemplateDetailResponse(
            result!.Template.Id,
            result.Template.Name,
            result.Configuration,
            result.Template.CreatedAt,
            result.Template.UpdatedAt));
    }

    private static async Task<IResult> DeleteTemplate(Guid id, TemplateService templateService)
    {
        var deleted = await templateService.DeleteAsync(id);
        return deleted ? Results.NoContent() : Results.NotFound();
    }
}
