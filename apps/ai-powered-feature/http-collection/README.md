# HTTP Collection

This directory contains HTTP test files and sample data for the AI Parsing Service API.

## Structure

```
http-collection/
├── api-tests.http          # API test requests for all endpoints
├── http-client.env.json    # Environment configuration (base URLs)
├── configs/                # Sample parsing configuration JSON files
├── files/                  # Sample CSV files for testing
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

| Environment     | Base URL                     |
|-----------------|------------------------------|
| `local`         | `http://localhost:5200`      |
| `local-https`   | `https://localhost:7200`     |

## Running Tests

### JetBrains HTTP Client (Rider / IntelliJ)

Open `api-tests.http`, select an environment from the dropdown, and click the green play button next to any request.

### VS Code REST Client

Open `api-tests.http` and click "Send Request" above any request block. Set the environment in VS Code settings if needed.

### httpYac CLI

```bash
# Install
npm install -g httpyac

# Run all requests
httpyac ./http-collection/api-tests.http -e local --all

# Run a single request
httpyac ./http-collection/api-tests.http -e local --name "List all templates"
```

## Sample Data

The `files/` directory contains anonymized sample CSV files that can be used for:

- Testing the parse endpoint (`POST /api/parse`)
- Testing AI configuration generation (`POST /api/generate-configuration`)
- Validating parsing configurations from `configs/`

The `configs/` directory contains sample `CsvFileParsingConfiguration` JSON files that match the sample CSV files.
