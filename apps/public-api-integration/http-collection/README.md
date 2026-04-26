# HTTP Collection

This directory contains HTTP test files for the APIM Subscription Manager API.

## Structure

```
http-collection/
├── api-tests.http          # API test requests for all endpoints
├── http-client.env.json    # Environment configuration (base URLs)
└── README.md
```

## Prerequisites

Use any HTTP client that supports `.http` files:

- [JetBrains HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) (built into IntelliJ / Rider)
- [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [httpYac](https://httpyac.github.io/)

## Configuration

Base URL is configured via environment files:

- `http-client.env.json` — environment-specific variables (base URL per profile)

Available environments:

| Environment | Base URL                |
|-------------|-------------------------|
| `local`     | `http://localhost:5199` |

## Running Tests

### JetBrains HTTP Client (Rider / IntelliJ)

Open `api-tests.http`, select the `local` environment from the dropdown, and click the green play button next to any request.

### VS Code REST Client

Open `api-tests.http` and click "Send Request" above any request block.

### httpYac CLI

```bash
# Install
npm install -g httpyac

# Run all requests
httpyac ./http-collection/api-tests.http -e local --all

# Run a single request
httpyac ./http-collection/api-tests.http -e local --name "List subscriptions for current user"
```

## Notes

- The API uses `X-User-Id` header to simulate user identity (PoC — no real auth)
- Replace `{id}` placeholders with actual subscription GUIDs from create responses
- Admin endpoints have no user scoping and return all subscriptions
