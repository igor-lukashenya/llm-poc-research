# APIM Subscription Manager

ASP.NET Web API (.NET 8) for managing Azure API Management subscriptions - including creation, key rotation, product assignment, and admin oversight.

> **PoC Note:** This project uses a **mock APIM client** and **in-memory data store** so it can run locally without any Azure infrastructure. No Azure subscription, APIM instance, or Entra ID tenant is required.

## Architecture

Clean Architecture with four layers:

| Project | Role |
|---------|------|
| `ApimSubscriptionManager.Api` | Minimal API endpoints, Swagger, request/response contracts |
| `ApimSubscriptionManager.Application` | Business logic, service interfaces, abstractions |
| `ApimSubscriptionManager.Domain` | Entities, enums, domain rules (zero external dependencies) |
| `ApimSubscriptionManager.Infrastructure` | Mock APIM client, in-memory repository, seed data |

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Build

```bash
cd apps/public-api-integration/src
dotnet build
```

## Run

```bash
cd apps/public-api-integration/src/ApimSubscriptionManager.Api
dotnet run
```

The API starts at `http://localhost:5199` by default.

- **Swagger UI:** [http://localhost:5199/swagger](http://localhost:5199/swagger)

## API Endpoints

All user endpoints use the `X-User-Id` header to simulate authentication (e.g., `X-User-Id: user-alice`).

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscriptions` | Create a new subscription |
| GET | `/api/subscriptions` | List your subscriptions (supports `name`, `sortBy`, `desc`, `page`, `pageSize`) |
| GET | `/api/subscriptions/{id}` | Get subscription details |
| DELETE | `/api/subscriptions/{id}` | Cancel a subscription |
| POST | `/api/subscriptions/{id}/rotate` | Rotate subscription keys |
| PUT | `/api/subscriptions/{id}/products` | Replace product assignments |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/subscriptions` | List all subscriptions (supports `owner`, `name`, `state`, `sortBy`, `desc`, `page`, `pageSize`) |
| GET | `/api/admin/subscriptions/rotation-status` | List subscriptions approaching or overdue for key rotation |

## Quick Test

```bash
# List subscriptions for user-alice
curl -H "X-User-Id: user-alice" http://localhost:5199/api/subscriptions

# Create a subscription
curl -X POST -H "Content-Type: application/json" -H "X-User-Id: user-alice" \
  -d '{"displayName":"My New API","productIds":["weather-basic"]}' \
  http://localhost:5199/api/subscriptions

# Rotate keys
curl -X POST -H "X-User-Id: user-alice" \
  http://localhost:5199/api/subscriptions/{id}/rotate

# Admin: view all subscriptions
curl http://localhost:5199/api/admin/subscriptions

# Admin: check rotation status
curl http://localhost:5199/api/admin/subscriptions/rotation-status
```

## Seed Data

The app starts with 5 pre-loaded subscriptions across 3 users (`user-alice`, `user-bob`, `user-charlie`), including one that is overdue for key rotation. Data is stored in-memory and resets on restart.

## Mock APIM Client

The `MockApimClient` simulates Azure APIM SDK operations (`Azure.ResourceManager.ApiManagement`) without requiring a real Azure connection. All subscription creation, cancellation, key regeneration, and product updates return successful mock responses. To integrate with a real APIM instance, replace the `IApimClient` registration in `Infrastructure/DependencyInjection.cs` with a real implementation.
