.PHONY: build run install clean

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────

build: ## Build the application
	npm run build

# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────

run: ## Run dev server
	npm run dev

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────

install: ## Install dependencies
	npm install

# ──────────────────────────────────────────────
# Clean
# ──────────────────────────────────────────────

clean: ## Clean build artifacts
	rm -rf dist node_modules/.vite

# ──────────────────────────────────────────────
# Lint
# ──────────────────────────────────────────────

lint: ## Run ESLint
	npm run lint

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
