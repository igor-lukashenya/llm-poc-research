# LLM PoC Research

Research project investigating whether LLMs can reliably accelerate Proof of Concept development across different domains and technology stacks.

Models used: Claude Opus 4.5, Claude Opus 4.6, GPT-4.1, GPT-5.1 via VS Code with GitHub Copilot.

## Case Studies

| Case | Domain | Stack | Folder |
|------|--------|-------|--------|
| E-Commerce Product Catalog | Frontend Web | React, TypeScript, Vite | `apps/ecommerce-product-catalog-ui` |
| E-Commerce — SpecKit | Alternative Tool | SpecKit | `apps/ecommerce-product-catalog-ui-spec-kit-copilot` |
| Financial Tracker Mobile App | Mobile | React Native, Expo, TypeScript | `apps/fintech-personal-finance-overview` |
| Public API Integration | Backend API | ASP.NET, Azure APIM, Entra ID | `apps/public-api-integration` |
| Private API Integration | Backend API | ASP.NET, private NuGet | `apps/private-api-integration` |
| AI-Powered Feature | Full Stack + AI | ASP.NET, React, Azure OpenAI | `apps/ai-powered-feature` |

## Repository Structure

```
├── apps/                          # Case study implementations
│   ├── ai-powered-feature/
│   ├── ecommerce-product-catalog-ui/
│   ├── ecommerce-product-catalog-ui-spec-kit-copilot/
│   ├── fintech-personal-finance-overview/
│   ├── private-api-integration/
│   └── public-api-integration/
├── docs/                          # Research documentation (MkDocs source)
│   ├── index.md                   # Documentation homepage
│   ├── research-definition.md     # Research goals and methodology
│   ├── research-report.md         # Full research report
│   ├── research-report-summary.md # Condensed findings
│   ├── cases-ideas-and-definition.md
│   ├── case-report-template.md
│   └── <case-folder>/case-report.md  # Individual case reports
├── mkdocs.yml                     # MkDocs configuration
├── Makefile                       # Root-level make targets
└── README.md
```

## Documentation

The project uses [MkDocs](https://www.mkdocs.org/) with the [Material](https://squidfunk.github.io/mkdocs-material/) theme to serve documentation as a static site.

### Prerequisites

- Python 3.x
- pip

### Make Targets

| Command | Description |
|---------|-------------|
| `make install` | Install MkDocs and dependencies |
| `make serve` | Serve docs locally with live reload at http://127.0.0.1:8000 |
| `make build` | Build static site to `site/` directory |
| `make clean` | Remove built site |
| `make help` | Show available targets |

### Quick Start

```bash
make install
make serve
```

Each case in `apps/` may also have its own `Makefile` with case-specific targets. Check the `README.md` inside each case folder for details.