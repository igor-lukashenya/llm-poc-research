# AI Parsing Service

ASP.NET Minimal API (.NET 8) that manages **parsing templates** (name + configuration) with CRUD operations, and provides **AI-powered configuration generation** — upload a CSV file and the service auto-detects its structure and returns a ready-to-use parsing configuration.

> **PoC Note:** By default the project uses a **mock AI service** (heuristic-based). A real **Azure OpenAI + Semantic Kernel** implementation is included and activates automatically when you provide the `AzureOpenAI` configuration section.

## Architecture

| Project | Role |
|---------|------|
| `AiParsingService.Api` | Minimal API — endpoints, contracts, Swagger |
| `AiParsingService.Application` | Business logic — template service, validation, abstractions |
| `AiParsingService.Domain` | Domain entities (`ParsingTemplate`) — zero dependencies |
| `AiParsingService.Infrastructure` | Repositories (in-memory), AI services (mock + Semantic Kernel) |
| `Parsing` | CSV file parser (CsvHelper-based, configuration-driven) |
| `Parsing.Configuration` | Configuration models / DTOs (pure contracts, zero dependencies) |

### Flows

**Templates CRUD** — create, read, update, delete parsing templates (name + `CsvFileParsingConfiguration`).

**AI Configuration Generation** — stateless endpoint: upload a file, receive a generated configuration. The user can then save it as a template.

```
1. User uploads CSV       →  POST /api/generate-configuration
2. AI analyzes file (headers, separator, types)
3. Generates CsvFileParsingConfiguration
4. Validates the configuration
5. Returns: config + metadata + validation result

6. User saves config      →  POST /api/templates  (with name + config)
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) (for React client)
- [GNU Make](https://www.gnu.org/software/make/) (optional, for Makefile commands)

## Quick Start

```bash
cd apps/ai-powered-feature
make install   # restore .NET packages + npm install
make run       # start API (port 5200) and client (port 3000) in parallel
```

Run `make help` to see all available commands.

## Build

```bash
cd apps/ai-powered-feature/src
dotnet build AiParsingService.slnx
```

## Run

### API

```bash
cd apps/ai-powered-feature/src
dotnet run --project AiParsingService.Api --launch-profile https
```

The API starts at `https://localhost:7200` (configured in `Properties/launchSettings.json`).

- **Swagger UI:** [https://localhost:7200/swagger](https://localhost:7200/swagger)

Two seed templates are pre-loaded for quick testing.

### React Client

```bash
cd apps/ai-powered-feature/src/client
npm install
npm run dev
```

The client starts at `http://localhost:3000` and proxies API calls to `http://localhost:5200`.

> **Note:** The client dev server proxy targets the **http** launch profile (port 5200). Run the API with `--launch-profile http` when developing with the client.

## API Endpoints

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | List all templates (summary) |
| GET | `/api/templates/{id}` | Get template with full configuration |
| POST | `/api/templates` | Create a new template |
| PUT | `/api/templates/{id}` | Update an existing template |
| DELETE | `/api/templates/{id}` | Delete a template |

### AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-configuration` | Upload a file → get AI-generated configuration |

### Parsing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse?templateId={id}` | Parse a file using a stored template |
| POST | `/api/parse?configuration={json}` | Parse a file using inline configuration |

## Usage Examples

### List templates

```bash
curl https://localhost:7200/api/templates
```

### Get a template by ID

```bash
curl https://localhost:7200/api/templates/{id}
```

### Create a template

```bash
curl -X POST https://localhost:7200/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Template",
    "configuration": {
      "separator": ";",
      "hasHeader": true,
      "headerRowIndex": 0,
      "dataStartRowIndex": 1,
      "blocks": []
    }
  }'
```

### Update a template

```bash
curl -X PUT https://localhost:7200/api/templates/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "configuration": {
      "separator": ",",
      "hasHeader": true,
      "headerRowIndex": 0,
      "dataStartRowIndex": 1,
      "blocks": []
    }
  }'
```

### Delete a template

```bash
curl -X DELETE https://localhost:7200/api/templates/{id}
```

### Generate configuration from a file

```bash
curl -X POST https://localhost:7200/api/generate-configuration \
  -F "file=@sample.csv"
```

**Constraints:** file must be `.csv`, `.txt`, or `.tsv`, max 10 MB.

**Response includes:**

- `configuration` — the generated `CsvFileParsingConfiguration`
- `detectedFormat`, `separator`, `detectedColumns` — what the AI detected
- `warnings` — any issues found during analysis
- `isValid`, `validationErrors`, `validationWarnings` — configuration validation result

### Parse a file with a stored template

```bash
curl -X POST "https://localhost:7200/api/parse?templateId={id}" \
  -F "file=@sample.csv"
```

### Parse a file with inline configuration

```bash
curl -X POST https://localhost:7200/api/parse \
  -F "file=@sample.csv" \
  -G --data-urlencode 'configuration={"separator":";","hasHeader":true,"blocks":[...]}'
```

**Response includes:**

- `fileName` — the uploaded file name
- `totalRows` — number of parsed records
- `rows` — array of parsed records (dictionaries of logical name → value)

## Mock AI Service

The `MockConfigurationGeneratorService` simulates what Azure OpenAI would do:

- Detects column separator (`;`, `,`, `\t`, `|`)
- Reads header row to identify columns
- Infers data types from first data row (int, decimal, datetime, bool, string)
- Generates a complete `CsvFileParsingConfiguration`

### Using Real Azure OpenAI

Add an `AzureOpenAI` section to `appsettings.json` to activate the Semantic Kernel implementation:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "DeploymentName": "gpt-4o",
    "ApiKey": "your-api-key"
  }
}
```

When present, the service automatically switches from mock to Semantic Kernel.

## Parsing Library

The `Parsing` and `Parsing.Configuration` projects are a configuration-driven CSV parsing system. See [Parsing.Configuration/README.md](src/Parsing.Configuration/README.md) for full documentation on the configuration model.

Key capabilities:
- Flexible column mapping (index-based, header-based, variant scanning)
- Block-based parsing (scalar + collection blocks)
- Regex transforms (replace, extract patterns)
- Type conversion (string, numeric, bool, datetime with timezone)
- Row grouping/merging
- Encoding auto-detection
