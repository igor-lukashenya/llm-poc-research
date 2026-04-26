# LLM PoC Research Report – Summary

## Executive Summary

This research investigated whether LLMs can reliably accelerate proof of concept development across five distinct domains: e-commerce web client (React), financial tracker mobile app (React Native), public API integration (ASP.NET + Azure APIM), private API integration (ASP.NET + private NuGet), and AI-powered feature development (ASP.NET + Semantic Kernel + Azure OpenAI). An alternative tool (SpecKit) was also evaluated. Models used included Claude Opus 4.5, Claude Opus 4.6, GPT-4.1, and GPT-5.1 via VS Code with GitHub Copilot.

- **LLM can be used for PoC development**, but its effectiveness varies dramatically by domain and task type
- **Strong results:** ADR/design generation (1 iteration), project scaffolding (less than 5 iterations), server-side C# code for well-documented APIs (production-quality with unit tests), structured test data generation
- **Poor results:** UI/frontend development (broken layouts after every iteration, blind process without visual feedback), mobile development (200+ iterations for a single screen), private API/package integration (25+ iterations, prompt writing overhead sometimes exceeded manual coding), infrastructure provisioning (all generated scripts were unusable)
- **Key observation:** LLM does not work as expected for UI development, private APIs and packages, newer package versions, or cloud infrastructure management
- **Conclusion:** LLM is a viable productivity accelerator for backend-heavy PoCs with well-documented public APIs, but it cannot replace a developer. For UI-focused PoCs, mobile apps, and integrations with private or undocumented APIs, manual development remains faster and more reliable.

---

## Research Scope & Methodology

- **Goal:** Test LLM's ability to write complete PoC code across different domains and technology stacks
- **Evaluation criteria:** Business use cases, reliability, code quality, speed, prompting effectiveness
- **Working style:** Requirements provided as structured prompts, refined iteratively. LLM handled ADR generation, code scaffolding, code generation, and unit tests. Human handled visual validation, layout/style fixes, infrastructure provisioning, private package documentation, and final integration.
- **Measurement:** Prompt iteration count, manual code review, functional testing, comparison to estimated manual development baseline

---

## Case 1 – E-Commerce Product Catalog Web Client

**Stack:** React, TypeScript, Vite

**Requirements:** Product catalog MVP with filtering, search, sorting, favorites. Later: Netflix-style UI redesign with carousels, sidebar navigation, dark theme, responsive design.

**LLM delegated:** Project scaffolding, packages, ESLint/Prettier setup, code generation, tests
**Human required:** Templates and layouts, styles fixes, visual validation

**Key findings:**

- Project setup completed in less than 5 iterations; scaffolding is LLM's strongest area
- UI development failed: broken layouts after every iteration, app was unusable
- LLM could not prioritize changes; applied them in random order
- Router package confusion (react-router-dom vs react-router) persisted across iterations despite explicit corrections
- LLM ignored explicit requirements (sidebar "Sale" and "Popular" sections were never implemented)
- LLM added unrequested features (popups, zoom buttons) while missing requested ones
- Package issues: outdated versions, packages installed for wrong Node version, imports from non-installed packages
- Code quality is poor: monolithic files, no component decomposition, no DRY, no logic/view separation, no performance optimization (missing useMemo, useCallback, React.memo)
- Manual UI development would be faster overall due to constant blind iterations and layout fixes

**SpecKit evaluation:** Not suitable for PoC development. Designed for full-scale projects; generates excessive unused code. Cleanup overhead exceeded manual implementation time.

---

## Case 2 – Financial Tracker Mobile App

**Stack:** React Native, Expo Go, TypeScript

**Requirements:** Personal finance tracker with accounts, categories, transactions, analytics, and family sharing. MVP scope: working UI screens with mock API.

**LLM delegated:** Scaffolding, screen/component generation, navigation, mock data, state management
**Human required:** Layout adjustments, Expo Go debugging, physical device testing, device-specific fixes

**Key findings:**

- 200+ iterations to get even one view (account list) working on Android Samsung phone
- The same view did not work as expected on Samsung tablet
- Each iteration required manual debugging, code fixes, and reloading via Expo Go
- Same code quality issues as E-Commerce case: monolithic components, no separation of concerns, no DRY
- Mobile-specific best practices not followed (responsive layouts, platform-specific styling)
- LLM cannot handle device-specific rendering differences
- 200+ iterations for a single list view screen demonstrates LLM-driven mobile UI development is not viable
- Significantly slower than manual development; net negative speedup

---

## Case 3 – Integration with Existing Public API

**Stack:** ASP.NET (C#), Azure API Management, Microsoft Entra ID

**Requirements:** Create and manage APIM subscriptions, manage products per subscription, subscription rotation every 90 days, admin panel with filtering/sorting/pagination.

**LLM delegated:** ADR and feature design, C# code generation, unit tests, ASP.NET API integration
**Human required:** APIM product configuration, Entra ID token management, admin panel listing (initially missed by LLM)

**Key findings:**

- ADR and feature design generated in initial iterations; significant speedup
- Core subscription management code generated in less than 5 iterations; production-quality with unit tests and mock support
- C# code integrated smoothly into existing ASP.NET API with minimal effort
- LLM failed on Azure-specific tasks: APIM product configuration and Entra ID token management required fully manual implementation
- LLM ignored one explicit requirement (admin panel listing); required additional iterations to address
- Server-side/API code generation is a strong LLM use case; Azure infrastructure and identity management is not

---

## Case 4 – Integration with Private Customer API

**Stack:** ASP.NET (C#), private authorization service, private NuGet package

**Requirements:** Integrate existing application with company's private authorization service that handles user roles and grants across applications.

**LLM delegated:** ADR and feature design, C# code generation, unit tests
**Human required:** Private NuGet package investigation, explaining package logic and contracts to LLM

**Key findings:**

- Results consistent with Public API case but amplified by private nature of the service
- 25+ iterations to get a working solution (vs less than 5 for public API)
- Each iteration required explaining private NuGet package internals because the service is not in LLM's training data
- Writing detailed prompts about package behavior sometimes took more time than writing the code manually using IntelliSense
- Developer becomes a bottleneck: translating private API documentation into LLM-friendly prompts adds overhead
- After sufficient context is provided, LLM generates working, production-quality code with unit tests
- Cost-benefit analysis is less compelling than for well-documented public APIs; net speedup is marginal or negative

---

## Case 5 – New AI Feature in Existing App

**Stack:** ASP.NET (backend), React (frontend), Azure OpenAI, Semantic Kernel

**Requirements:** Add AI-powered parsing configuration to existing data import application. User uploads file, parsing configuration is generated automatically with data preview.

**LLM delegated:** ADR and initial design, server-side code and unit tests, Semantic Kernel integration
**Human required:** Azure OpenAI resource creation and configuration, private parsing module documentation, UI layouts and styles, testing files

**Key findings:**

- ADR and initial design generated in 1 iteration; provided immediate business value for feasibility assessment
- Server-side implementation: 1 prompt + less than 5 iterations for documentation refinement
- Infrastructure: at least 10 iterations for Azure OpenAI scripts, all failed; resources created manually
- UI: more than 10 iterations for layout updates, all failed; layouts written manually, then 3 iterations for API integration logic
- Semantic Kernel integration generated by LLM; Azure OpenAI wiring done manually
- LLM-generated infrastructure scripts are unreliable and potentially dangerous to existing resources
- LLM is most productive for backend logic, ADR, and API integration; least productive for UI layouts and infrastructure provisioning

---

## Cross-Case Analysis

### Business Use Cases

- UI-focused PoCs (E-Commerce, mobile app) did not meet business requirements; final results were unusable
- Server-side/API integration PoCs (public API, private API, AI feature backend) met core business requirements after sufficient iterations
- LLM consistently missed or ignored explicit requirements across all cases
- ADR and feature design generation met business needs in every case where it was used
- Server-side domain was the most LLM-friendly; UI/frontend was the least

### Reliability

- UI development experience with LLM is terrible across all cases: broken layouts after every iteration in E-Commerce, 200+ iterations for mobile, 10+ failed iterations for AI feature UI
- Server-side C# code was reliable and production-ready when working with well-documented public APIs (less than 5 iterations)
- LLM fails on Azure-specific services: APIM configuration, Entra ID token management, Azure OpenAI provisioning
- LLM cannot work with private or undocumented APIs and packages without extensive human-provided documentation (25+ iterations vs less than 5 for public API)
- LLM has significant issues with newer package versions: falls back to outdated APIs, installs for wrong Node versions, uses non-existent packages
- Infrastructure scripts were unusable in every case (incorrect commands, missing parameters, wrong API versions)
- LLM ignores requirements between iterations and adds unrequested features on its own

### Code Quality

- UI code quality is poor across all cases: monolithic files, no component decomposition, no DRY, no logic/view separation, no performance optimization, no mobile-specific best practices
- Server-side C# code quality is good to production-ready: clean structure, proper unit tests with mocks, ready for integration
- ADR and design artifacts were well-structured and usable as-is
- Infrastructure scripts were consistently unusable
- Code quality improves significantly when ADR is provided as context for subsequent prompts

### Speed & Productivity

- Biggest speedups: project scaffolding (less than 5 iterations), ADR generation (1 iteration), server-side C# code for public APIs (less than 5 iterations), unit tests (generated alongside code at no extra cost)
- Net negative speedup: UI development (blind iterations), mobile development (200+ iterations), infrastructure provisioning (all manual after failures), private API integration (25+ iterations, prompt overhead)
- Key bottlenecks: visual validation, private package documentation, Azure resource configuration, device-specific testing, package version management

---

## Prompting Strategy

### Effective Patterns

- **ADR-First Development:** Generate ADR before implementation; use as context for follow-up prompts. Consistently produced the best results across all server-side cases.
- **Structured Test Data Generation:** Provide specific categories, brands, constraints for realistic sample data. The more specific the requirements, the better the output.
- **Step-by-Step Feature Implementation:** Break features into explicitly numbered steps. Prevents LLM from skipping or reordering requirements.
- **Code Generation with Existing Codebase Context:** Provide module documentation, interfaces, and existing patterns. Essential for private packages and existing codebases.
- **Project Scaffolding:** Specify exact package names, tooling, and project structure. LLM's strongest area; works in less than 5 iterations.

### Ineffective Approaches

- Asking LLM to fix visual issues without screenshots; it cannot see rendering results
- Providing all requirements at once without step-by-step ordering; LLM misses items
- Expecting LLM to discover private package APIs on its own; it hallucinates methods and interfaces
- Asking LLM to configure Azure infrastructure; generated scripts consistently failed
- Relying on LLM for package version management; it uses outdated versions from training data
- Giving broad UI redesign instructions; LLM breaks existing layouts and functionality
- Asking LLM to handle device-specific rendering; it cannot account for phone vs tablet differences

---

## Conclusions & Recommendations

### Overall Viability

- LLM-based PoC development is viable, but only for specific domains and task types
- LLM delivers the most value in server-side code generation, ADR/design artifacts, project scaffolding, and unit test generation
- LLM does not work as expected for UI development, private API/package integration, or infrastructure provisioning
- LLM is a useful tool for accelerating PoC development in backend-heavy scenarios, but it cannot replace a developer

### When to Use LLMs

- ADR and feature design generation: fastest and most reliable use case, immediate business value
- Project scaffolding: less than 5 iterations for new projects
- Server-side code generation for well-documented public APIs: production-quality with unit tests
- Structured test data generation: realistic data when given specific constraints
- Unit test generation: generated alongside code at no extra cost

### When Not to Use LLMs

- UI and frontend development: blind iterations, broken layouts, manual development is faster
- Mobile development: all UI problems amplified, 200+ iterations for a single screen
- Private API/package integration: 25+ iterations, prompt overhead often exceeds manual coding
- Infrastructure provisioning: generated scripts consistently unusable, potentially dangerous
- Newer package versions: falls back to outdated APIs, uses non-existent packages

### Recommendations for Future PoCs

- Start every feature with ADR generation; use as context for subsequent implementation prompts
- Break requirements into explicit, numbered steps to prevent skipped or reordered work
- Separate backend and frontend: delegate server-side code to LLM, keep UI/layout work manual
- Prepare documentation for private packages upfront before starting LLM-assisted development
- Always review LLM output for missed requirements; use checklist-based review after each cycle
- Do not use LLM for infrastructure provisioning; create Azure resources and configure identity providers manually
- Use LLM for generating unit tests alongside code: low-cost, high-value addition
- Plan for human intervention on visual validation in every UI-related PoC
