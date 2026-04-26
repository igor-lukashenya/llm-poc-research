# ADR-001: AI-Powered Parsing Configuration Service

**Date:** -

## Context

The system includes a powerful, configuration-driven CSV file parser. The parser supports flexible column mapping (index-based, header-based, variant scanning), block-based parsing (scalar and collection blocks), regex transforms, type conversion, row grouping, and encoding detection. This flexibility comes at a cost: the configuration model (`CsvFileParsingConfiguration`) is too complex for non-technical users to author manually — it requires understanding column indices, regex patterns, value sources, data types, date formats, and block structures.

Currently, configurations are created by developers or technical staff, which creates a bottleneck. The goal is to use AI to auto-generate parsing configurations from sample files, and to manage reusable parsing templates via a simple CRUD API.

## Decision Drivers

- Non-technical users need self-service configuration generation without developer involvement
- Parsing templates (name + configuration) must be storable and reusable
- AI-generated configurations must be validated before being returned to the caller
- Configurations must also be validated on template save/update
- PoC must be self-contained and demonstrable without Azure OpenAI infrastructure

## Decision

Build an ASP.NET Minimal API (.NET 8, C#) with Clean Architecture that provides three focused concerns:

1. **Templates CRUD** — Create, read, update, and delete parsing templates (name + `CsvFileParsingConfiguration`)
2. **AI Configuration Generation** — Upload a CSV file, receive an AI-generated `CsvFileParsingConfiguration` with validation results
3. **File Parsing** — Upload a CSV file with a configuration (inline or via template reference), parse it using the existing parsing library, and return structured results

> **PoC scope limitation:** The mock AI service generates configurations for **simple tabular CSV files** (flat headers, uniform columns, standard delimiters). Advanced parsing patterns — repeated collection blocks, header variant scanning, regex extraction, grouped rows — are not covered by the AI generator in this PoC. The ADR does not claim AI solves the full configuration problem; it proves the concept for the common case.

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                  AiParsingService.Api                  │
│         (Minimal API Endpoints, Contracts)             │
├──────────────────────────────────────────────────────┤
│              AiParsingService.Application              │
│    (TemplateService, Abstractions, Validation)         │
├──────────────────────────────────────────────────────┤
│               AiParsingService.Domain                  │
│                  (ParsingTemplate)                      │
├──────────────────────────────────────────────────────┤
│            AiParsingService.Infrastructure             │
│      (In-Memory Repository, Mock AI Service)           │
├──────────────────────────────────────────────────────┤
│       Parsing.Configuration + Parsing (existing)       │
│     (Configuration models / types, CSV parser)         │
└──────────────────────────────────────────────────────┘
```

**Layers:**

- **Api** — HTTP endpoints (Templates CRUD, AI Generation, File Parsing), request/response contracts, file upload handling
- **Application** — `TemplateService` for CRUD orchestration, `ConfigurationValidator`, abstractions (`ITemplateRepository`, `IConfigurationGeneratorService`)
- **Domain** — `ParsingTemplate` entity (Id, Name, CreatedAt, UpdatedAt), logical name constants (`FieldLogicNames`, `NutrientLogicNames`)
- **Infrastructure** — `InMemoryTemplateRepository` with seed data, `MockConfigurationGeneratorService`, `SemanticKernelConfigurationGeneratorService`, `CsvFileParser` registration
- **Parsing.Configuration** — existing library providing `CsvFileParsingConfiguration` and related types, unchanged
- **Parsing** — existing CSV file parser (`ICsvFileParser`), used by the parse endpoint

### API Endpoints

The API has three resource groups: **Templates** (CRUD), **AI Generation** (stateless), and **Parsing** (stateless).

#### Templates (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/templates` | Create template (name + configuration) |
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/{id}` | Get template details with full configuration |
| PUT | `/api/templates/{id}` | Update template (name, configuration) |
| DELETE | `/api/templates/{id}` | Delete template |

#### AI Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-configuration` | Upload CSV file → returns generated configuration with validation |

**Upload contract:** `multipart/form-data`, max 10 MB, allowed extensions: `.csv`, `.txt`, `.tsv`. The AI service sees sampled content (first N lines), not the full file.

#### Parsing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse` | Parse a CSV file using provided configuration |

**Accepts:** `multipart/form-data` with a `file` field and either:
- `configuration` form field — inline JSON configuration
- `templateId` query parameter — reference to a stored template

**Returns:** `{ fileName, totalRows, rows }` where `rows` is an array of dictionaries mapping logical names to parsed values. Collection blocks produce nested arrays within each row.

### Domain Model

```csharp
ParsingTemplate
├── Id (Guid)
├── Name (string)
├── CreatedAt (DateTime)
└── UpdatedAt (DateTime)
```

Configuration (`CsvFileParsingConfiguration`) is stored alongside the template at the repository level via `TemplateWithConfiguration(ParsingTemplate, CsvFileParsingConfiguration)`. This keeps the domain entity lean while the infrastructure layer manages the composite storage.

### Configuration Validation

Configurations are validated in two places:

1. **On AI generation** — the generated configuration is validated before being returned to the caller, with `IsValid`, `ValidationErrors`, and `ValidationWarnings` included in the response
2. **On template save/update** — the configuration is validated before persisting; invalid configurations are rejected with a 422 response

Validation checks:

- Required fields (separator, at least one block with parameters)
- Index bounds (no negative indices without variants)
- Regex pattern compilation (invalid regex caught before runtime)
- Type/format consistency (DateTime parameters should have a format)
- Block structure integrity (collection blocks need ItemSize > 0)

Validation returns structured errors/warnings, not silent failures.

### Mock AI Service

The `MockConfigurationGeneratorService` simulates what Azure OpenAI + Semantic Kernel would do in production:

- Detects column separator (`;`, `,`, `\t`, `|`) by frequency analysis
- Reads header row to identify column names
- Infers data types from the first data row (int, decimal, datetime, bool, string)
- Generates a flat `CsvFileParsingConfiguration` with one scalar block mapping all detected columns
- Returns detected metadata (format, columns, separator) and warnings

**Limitations (documented):** The mock only handles flat tabular CSVs. It does not generate collection blocks, variant-based lookups, regex transforms, or grouping configurations. These advanced patterns require manual configuration or a more sophisticated AI model.

### Data Persistence

- **PoC:** In-memory `ConcurrentDictionary` for templates. Data is lost on restart — acceptable for demonstration.
- **Target architecture:** Persistent store (e.g., Azure SQL, Cosmos DB) for templates.

> **PoC tradeoff:** The "reusable template" driver is only fully satisfied within a single process lifetime. Templates disappear on restart. For a demo, pre-seed sample templates at startup to ensure the flow is always demonstrable.

## Alternatives Considered

1. **Manual configuration UI (form-based editor)** — Build a frontend wizard that walks users through configuration creation step by step. Rejected for PoC: high UI effort, and research showed LLM-generated UI is unreliable. Could complement AI generation in production.

2. **Template-based configuration cloning** — Provide a library of pre-built templates for common file formats. Users pick the closest template and adjust. Simpler than AI but less adaptive. Could be a fallback when AI generation produces poor results.

3. **Rule-based generator only (no AI)** — Use deterministic heuristics (detect separator, map headers, infer types) without an AI model. This is essentially what the mock service does. Sufficient for flat CSVs but cannot handle complex patterns without AI reasoning.

## PoC Boundaries

### In scope

- Minimal API with Templates CRUD, AI Generation, and File Parsing endpoints
- Mock AI configuration generator (flat tabular CSV)
- Domain-aware AI prompt with logical name mapping
- In-memory template store with seed data
- Configuration validation on generate and on save/update
- File upload validation (size, extension)
- React client (templates list, editor with RJSF form, Monaco JSON editor, file upload, AI generate, test parse)

### Out of scope

- Real Azure OpenAI / Semantic Kernel integration (code exists, requires configuration)
- NIR file support (CSV only)
- Persistent database
- User authentication and authorization
- Advanced AI patterns (collection blocks, regex, grouping)
- Production deployment and CI/CD

### Known limitations

- In-memory store resets on restart — seed data ensures demo flow works
- Mock AI only handles flat CSVs with uniform columns
- Real Semantic Kernel integration requires Azure OpenAI configuration (code is ready, just needs credentials)

## Risks

- **Mock AI gives false confidence:** The heuristic generator works for simple files but may give the impression that AI solves the full configuration problem. ADR explicitly scopes the PoC claim to flat tabular CSVs.
- **Configuration model complexity:** Even with AI generation, users may need to understand the configuration model to make meaningful adjustments. A frontend with guided editing would mitigate this in production.

## Assumptions & Open Questions

### Assumptions

- Files are CSV format with a header row (most common case)
- File sizes are reasonable for PoC (< 10 MB)
- One template maps to one configuration (1:1 relationship)
- Template naming is user-provided — no auto-naming from AI

### Open Questions

- Should the AI service suggest a template name based on detected content?
- Should templates support versioning (edit → new version)?
- Should the generate endpoint optionally accept a template name to auto-save?

## Consequences

### Positive

- Non-technical users can generate parsing configurations without developer help (for simple files)
- Reusable templates reduce repeated setup work
- Validation catches errors early, both on AI generation and on template save
- Clean Architecture enables easy swap from mock to real AI service
- Simplified API surface (two concerns) is easier to understand and maintain

### Negative

- Mock AI only covers flat CSVs — advanced file formats still require manual configuration
- In-memory storage limits the reuse story to a single process lifetime
- No frontend means the adjustment step is API-level only — not truly self-service in PoC
- Configuration model remains complex; AI generation is a mitigation, not a full solution

## LLM Applicability

Based on research findings from the original Case 5 evaluation:

**Suitable for LLM generation:**
- API endpoints, request/response contracts
- Application services and business logic
- Domain entities and validation rules
- Unit tests with mocks
- Mock AI service implementation
- Configuration seeding and sample data

**Requires manual implementation or validation:**
- Azure OpenAI resource provisioning and configuration
- Semantic Kernel integration and prompt engineering
- Real AI configuration generation logic
- Frontend UI (research showed LLM UI generation is unreliable)
- Integration testing with real file formats
