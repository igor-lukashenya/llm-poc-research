.PHONY: build run restore clean

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────

build: ## Build .NET API
	cd src && dotnet build ApimSubscriptionManager.slnx

# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────

run: ## Run .NET API (port 5199)
	cd src && dotnet run --project ApimSubscriptionManager.Api

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────

restore: ## Restore .NET packages
	cd src && dotnet restore ApimSubscriptionManager.slnx

# ──────────────────────────────────────────────
# Clean
# ──────────────────────────────────────────────

clean: ## Clean build artifacts
	cd src && dotnet clean ApimSubscriptionManager.slnx -q

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
