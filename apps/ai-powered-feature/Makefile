.PHONY: build build-api build-client run run-api run-client install restore clean

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────

build: build-api build-client ## Build API and client

build-api: ## Build .NET API
	cd src && dotnet build AiParsingService.slnx

build-client: ## Build React client
	cd src/client && npm run build

# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────

run: ## Run API and client (parallel)
	$(MAKE) -j2 run-api run-client

run-api: ## Run .NET API (http profile, port 5200)
	cd src && dotnet run --project AiParsingService.Api --launch-profile http

run-client: ## Run React dev server (port 3000)
	cd src/client && npm run dev

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────

install: restore ## Install all dependencies
	cd src/client && npm install

restore: ## Restore .NET packages
	cd src && dotnet restore AiParsingService.slnx

# ──────────────────────────────────────────────
# Clean
# ──────────────────────────────────────────────

clean: ## Clean build artifacts
	cd src && dotnet clean AiParsingService.slnx -q
	cd src/client && rm -rf dist node_modules/.vite

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
