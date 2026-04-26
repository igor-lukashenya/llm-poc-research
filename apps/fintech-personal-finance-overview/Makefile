.PHONY: start web android ios install lint typecheck clean help

## Start Expo dev server
start:
	npx expo start

## Start for web platform
web:
	npx expo start --web

## Start for Android
android:
	npx expo start --android

## Start for iOS
ios:
	npx expo start --ios

## Install dependencies
install:
	npm install

## Run ESLint
lint:
	npx expo lint

## Run TypeScript type checking
typecheck:
	npx tsc --noEmit

## Remove build artifacts and caches
clean:
	rm -rf dist .expo node_modules/.cache

## Show available targets
help:
	@echo Available targets:
	@echo   start      - Start Expo dev server
	@echo   web        - Start for web platform
	@echo   android    - Start for Android
	@echo   ios        - Start for iOS
	@echo   install    - Install dependencies
	@echo   lint       - Run ESLint
	@echo   typecheck  - Run TypeScript type checking
	@echo   clean      - Remove build artifacts and caches
	@echo   help       - Show this help
