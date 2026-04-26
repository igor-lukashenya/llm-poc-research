.PHONY: install serve build clean help

## Install mkdocs and dependencies
install:
	pip install mkdocs mkdocs-material

## Serve docs locally with live reload
serve:
	mkdocs serve

## Build static site to site/ directory
build:
	mkdocs build

## Remove built site
clean:
	mkdocs build --clean
	rmdir /s /q site 2>nul || true

## Show available targets
help:
	@echo Available targets:
	@echo   install  - Install mkdocs and dependencies
	@echo   serve    - Serve docs locally (http://127.0.0.1:8000)
	@echo   build    - Build static site to site/ directory
	@echo   clean    - Remove built site
