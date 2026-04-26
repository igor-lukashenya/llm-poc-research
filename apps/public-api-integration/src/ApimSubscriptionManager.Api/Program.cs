using ApimSubscriptionManager.Api.Endpoints;
using ApimSubscriptionManager.Application;
using ApimSubscriptionManager.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "APIM Subscription Manager", Version = "v1" });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapSubscriptionEndpoints();
app.MapAdminEndpoints();

app.Run();
