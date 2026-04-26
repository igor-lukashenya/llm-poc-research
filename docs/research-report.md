# LLM PoC Research Report

## 1. Executive Summary

This research investigated whether LLMs can reliably accelerate proof of concept development across five distinct domains: e-commerce web client (React), financial tracker mobile app (React Native), public API integration (ASP.NET + Azure APIM), private API integration (ASP.NET + private NuGet), and AI-powered feature development (ASP.NET + Semantic Kernel + Azure OpenAI). An alternative tool (SpecKit) was also evaluated. Models used included Claude Opus 4.5, Claude Opus 4.6, GPT-4.1, and GPT-5.1 via VS Code with GitHub Copilot.

- **LLM can be used for PoC development**, but its effectiveness varies dramatically by domain and task type
- **Strong results:** ADR/design generation (1 iteration), project scaffolding (less than 5 iterations), server-side C# code for well-documented APIs (production-quality with unit tests), structured test data generation
- **Poor results:** UI/frontend development (broken layouts after every iteration, blind process without visual feedback), mobile development (200+ iterations for a single screen), private API/package integration (25+ iterations, prompt writing overhead sometimes exceeded manual coding), infrastructure provisioning (all generated scripts were unusable)
- **Key observation:** LLM does not work as expected for UI development, private APIs and packages, newer package versions, or cloud infrastructure management
- **Conclusion:** LLM is a viable productivity accelerator for backend-heavy PoCs with well-documented public APIs, but it cannot replace a developer. For UI-focused PoCs, mobile apps, and integrations with private or undocumented APIs, manual development remains faster and more reliable. Teams should delegate server-side code, ADR generation, and unit tests to LLM while keeping UI work, infrastructure provisioning, and private package integration manual.

## 2. Research Context & Goals

- **Business context:** Investigate whether LLMs can be used to speed up the generation of proof of concept implementations for various product ideas. A PoC has to be small and may not be fully complete, but it has to be fully demonstrable to the client.
- **Main goal:** Focus on PoC implementation and test the ability of LLM to write complete code that covers PoC requirements across different domains and technology stacks.
- **Scope of this research:**
  - E-Commerce product catalog web client (React, TypeScript, Vite)
  - Financial tracker mobile app (React Native, Expo Go, TypeScript)
  - Integration with existing public API (ASP.NET, Azure API Management, Microsoft Entra ID)
  - Integration with private customer API (ASP.NET, private NuGet package)
  - New AI-powered feature in an existing app (ASP.NET, React, Azure OpenAI, Semantic Kernel)
  - Alternative tooling: SpecKit for E-Commerce catalog MVP
- **Evaluation criteria:**
  - Business use cases: whether initial requirements are met, ability to generate meaningful sample data, ability to generate working PoCs for different domains
  - Reliability: whether generated PoC functions correctly without major modifications, frequency of significant bugs or logical errors
  - Code quality: structure, readability, maintainability, unnecessary complexity, anti-patterns, ability to work across different technology stacks, integration with existing frameworks and third-party libraries
  - Speed: how LLM helped to speed up PoC development compared to traditional development methods, key bottlenecks requiring human intervention
  - Prompting: calibrated and refined prompts that worked best

## 3. Methodology

- **LLM setup:**
  - Models used: Claude Opus 4.5, Claude Opus 4.6, GPT-4.1, GPT-5.1
  - Tools/IDE used: VS Code + GitHub Copilot, Copilot CLI
  - Additional tools: SpecKit (evaluated for spec-driven development)
- **Working style:**
  - Requirements provided to LLM as structured prompts, refined iteratively based on output quality
  - LLM handled ADR generation, code scaffolding, code generation, and unit tests
  - Human handled visual validation, layout/style fixes, infrastructure provisioning, private package documentation, and final integration
  - Each PoC started with design/ADR generation, followed by implementation prompts, with iterative refinement as needed
- **Measurement approach:**
  - Speed estimated by counting prompt iterations and comparing effort to estimated manual development baseline
  - Correctness judged by manual code review, functional testing, and ability to run the application end-to-end
  - Code quality assessed by reviewing structure, patterns, maintainability, and adherence to best practices

---

## 4. PoC Case 1 – E-Commerce Product Catalog Web Client

📄 **Full report:** [ecommerce-product-catalog-ui/case-report.md](ecommerce-product-catalog-ui/case-report.md) | **SpecKit evaluation:** [ecommerce-product-catalog-ui-spec-kit-copilot/case-report.md](ecommerce-product-catalog-ui-spec-kit-copilot/case-report.md)

---

## 5. PoC Case 2 – Financial Tracker Mobile App

📄 **Full report:** [fintech-personal-finance-overview/case-report.md](fintech-personal-finance-overview/case-report.md)

---

## 6. PoC Case 3 – Integration with Existing Public API

📄 **Full report:** [public-api-integration/case-report.md](public-api-integration/case-report.md)

---

## 7. PoC Case 4 – Integration with Private Customer API

📄 **Full report:** [private-api-integration/case-report.md](private-api-integration/case-report.md)

---

## 8. PoC Case 5 – New AI Feature in Existing App

📄 **Full report:** [ai-powered-feature/case-report.md](ai-powered-feature/case-report.md)

---


## 9. Cross-Case Analysis

### 9.1 Business Use Cases

- UI-focused PoCs (E-Commerce web client, financial tracker mobile app) did not meet business requirements; final results were unusable in terms of UI/UX
- Server-side/API integration PoCs (public API, private API, AI feature backend) met core business requirements after sufficient iterations
- LLM consistently missed or ignored explicit requirements across all cases (e.g., sidebar sections in E-Commerce, admin panel listing in public API)
- ADR and feature design generation met business needs in every case where it was used (public API, private API, AI feature)
- LLM could generate meaningful sample data structures, but image placeholder services and mock data rendering did not work correctly
- Server-side domain (API integrations, backend logic) was the most LLM-friendly; UI/frontend domain was the least
- SpecKit was evaluated as an alternative tool but proved unsuitable for PoC scope due to excessive code generation overhead

### 9.2 Reliability

- UI development experience with LLM is terrible across all cases
  - E-Commerce: broken layouts after every iteration, styles never worked correctly, app was unusable
  - Mobile app: 200+ iterations for a single screen, device-specific rendering issues, constant breakage
  - AI feature UI: layouts and templates consistently broken, required manual rewrite after 10+ failed iterations
- Server-side C# code was reliable and production-ready when working with well-documented public APIs (less than 5 iterations)
- LLM fails on integration with Azure-specific services: APIM product configuration, Entra ID token management, Azure OpenAI resource provisioning
- LLM cannot work with private or undocumented APIs and packages
  - Private NuGet packages required extensive human-provided documentation before LLM could generate usable code
  - 25+ iterations for private API integration vs less than 5 for public API
- LLM has significant issues with newer package versions
  - Falls back to outdated package APIs (react-router-dom vs react-router)
  - Installs packages for wrong Node versions
  - Uses packages that are not installed or do not exist
  - Model training data does not include recent package updates, leading to incorrect imports and API usage
- Infrastructure scripts generated by LLM were unusable in every case (incorrect commands, missing parameters, wrong API versions)
- LLM ignores requirements between iterations and adds unrequested features on its own

### 9.3 Code Quality

- UI code quality is poor across all frontend and mobile cases
  - Monolithic files with no component decomposition
  - No DRY principle; code duplicated across components
  - No separation between logic and visualization layers
  - No performance optimization (missing useMemo, useCallback, React.memo)
  - Mobile-specific best practices not followed (responsive layouts, platform-specific styling)
- Server-side C# code quality is good to production-ready
  - Clean structure following existing patterns
  - Unit tests with proper mock support generated alongside code
  - Code ready for integration without significant rework
- ADR and design artifacts were well-structured and usable as-is across all cases
- Infrastructure scripts were consistently unusable (incorrect commands, wrong API versions, missing parameters)
- LLM struggles to work within existing codebases: cannot adapt to existing layouts, styles, and component patterns
- Code quality improves significantly when ADR is provided as context for subsequent implementation prompts

### 9.4 Speed & Productivity

- Biggest speedups
  - Project scaffolding and initial configuration (less than 5 iterations across all cases)
  - ADR and feature design generation (1 prompt iteration)
  - Server-side C# code generation for well-documented APIs (less than 5 iterations)
  - Unit tests with mock support (generated alongside code at no extra cost)
- Net negative speedup (slower than manual development)
  - UI development: constant blind iterations, broken layouts, manual fixes after every cycle
  - Mobile development: 200+ iterations for a single screen, device-specific debugging
  - Infrastructure provisioning: all cloud resources created manually after LLM failures
  - Private API integration: 25+ iterations, prompt writing overhead sometimes exceeded manual coding time
- Key bottlenecks requiring human intervention
  - Visual validation and layout/style fixes (LLM cannot see rendering results)
  - Private package documentation and API explanation (not in LLM training data)
  - Azure resource configuration and identity management (Entra ID, APIM)
  - Device-specific testing and debugging (Expo Go, physical devices)
  - Package version management and dependency resolution

---

## 10. Prompting Strategy & Best Prompts

### 10.1 Prompt Design Process

- Prompt design is critical for PoC development; instructions must be provided step by step because LLM cannot prioritize or order tasks on its own
- When multiple requirements are given at once, LLM applies changes without clear priority, often missing or reordering important steps
- Instructions to fix layouts, templates, or styles are ineffective because LLM cannot see the final visual result; these prompts lead to blind iterations
- The most effective prompts combine business requirements with high-level implementation steps, giving LLM a clear roadmap
- Generating an ADR before implementation is very helpful; LLM can use it as context for subsequent code generation, significantly improving output quality
- Prompts evolved from broad requests ("implement this feature") to structured, step-by-step instructions with explicit constraints and expected outcomes
- Providing existing code context, domain documentation, and package API descriptions upfront reduces iteration count

### 10.2 Effective Prompt Patterns

#### Pattern 1: ADR-First Development

- **Goal:** Generate architecture decision record before implementation to establish context and improve code generation quality
- **Example prompt:** "Generate an Architecture Decision Record for adding AI-powered parsing configuration to our existing ASP.NET application. The feature should allow users to upload a file and automatically generate parsing configuration. Consider integration with Semantic Kernel and Azure OpenAI. Backend is ASP.NET, frontend is React."
- **Notes:** ADR output can be used as context in follow-up implementation prompts. This pattern consistently produced the best results across all server-side cases.

#### Pattern 2: Structured Test Data Generation

- **Goal:** Generate realistic sample data for PoC by providing specific categories, brands, and data sources
- **Example prompt:** "Generate a TypeScript file with sample product data for an e-commerce catalog. Include the following categories: Phones (use real models from Apple iPhone, Samsung Galaxy, Xiaomi), Laptops (use models from Dell, Lenovo, MacBook), Headphones (use models from Sony, Bose, JBL). For each product include: name, category, brand, price (realistic market prices), rating (1-5), number of reviews, isPopular flag, isOnSale flag. Use placeholder images from a reliable source. Generate at least 5 products per category."
- **Notes:** The more specific the data requirements (real brand names, realistic prices, specific categories), the better the output. Avoid vague requests like "generate some products."

#### Pattern 3: Step-by-Step Feature Implementation

- **Goal:** Break down a feature into ordered steps so LLM implements them in the correct sequence
- **Example prompt:** "Implement Azure API Management subscription management for our ASP.NET API. Step 1: Create a SubscriptionService class with methods for creating, reading, updating, and deleting subscriptions. Step 2: Add subscription rotation logic that regenerates keys every 90 days. Step 3: Create REST API controllers for these operations. Step 4: Add unit tests with mock support for SubscriptionService."
- **Notes:** Numbering steps explicitly prevents LLM from skipping or reordering. Each step should be independently verifiable.

#### Pattern 4: Code Generation with Existing Codebase Context

- **Goal:** Generate code that integrates with existing application by providing module documentation and patterns
- **Example prompt:** "Using the ADR below as context, implement the server-side feature. The existing parsing module uses [describe interfaces, methods, and data models]. The module is available from our private NuGet package. Follow the existing service pattern: [provide example of an existing service class]. Add unit tests using the same testing patterns as the existing codebase."
- **Notes:** Essential for private packages and existing codebases. The more documentation and examples provided, the fewer iterations needed. Without this context, LLM cannot generate compatible code.

#### Pattern 5: Project Scaffolding and Configuration

- **Goal:** Set up a new project with tooling and best practices in a single prompt
- **Example prompt:** "Create a new React project using Vite with TypeScript. Configure ESLint with recommended rules. Add Prettier with the following settings: single quotes, semicolons, 2-space indent. Set up the project structure with separate folders for components, hooks, models, and services. Add a basic routing setup using react-router."
- **Notes:** This is LLM's strongest area. Works reliably in less than 5 iterations. Specify exact package names and versions when possible to avoid outdated package issues.

### 10.3 Ineffective Approaches

- Asking LLM to fix visual issues without providing screenshots or detailed layout descriptions; LLM cannot see rendering results and generates blind corrections
- Providing all requirements at once without step-by-step ordering; LLM applies changes in random order and misses items
- Expecting LLM to discover private package APIs on its own; without explicit documentation, it hallucinates methods and interfaces
- Asking LLM to configure Azure infrastructure resources (Entra ID, APIM, Azure OpenAI); generated scripts consistently had wrong commands, missing parameters, and incorrect API versions
- Relying on LLM for package version management; it falls back to outdated versions from training data and ignores the actual environment
- Giving broad UI redesign instructions (e.g., "make it look like Netflix"); LLM regenerates entire layouts, breaking existing styles and functionality
- Asking LLM to handle device-specific rendering; it cannot account for differences between phone and tablet displays

---

## 11. Conclusions & Recommendations

### 11.1 Overall Viability

- LLM-based PoC development is viable, but only for specific domains and task types
- LLM delivers the most value in server-side code generation, ADR/design artifacts, project scaffolding, and unit test generation
- LLM does not work as expected for UI development, private API/package integration, or infrastructure provisioning
- The overall conclusion is that LLM is a useful tool for accelerating PoC development in backend-heavy scenarios, but it cannot replace a developer and requires significant human oversight and intervention
- PoC teams should treat LLM as a productivity accelerator for well-defined backend tasks, not as a general-purpose code generator

### 11.2 When to Use LLMs

- ADR and feature design generation: fastest and most reliable use case across all PoCs, provides immediate business value for feasibility and effort estimation
- Project scaffolding and initial configuration: consistently works in less than 5 iterations for new projects (Vite, ESLint, Prettier, TypeScript setup)
- Server-side code generation for well-documented public APIs: produces production-quality C# code with unit tests and mock support
- Structured test data generation: generates realistic sample data when given specific categories, brands, and constraints
- Unit test generation: tests with proper mock support are generated alongside code at no extra iteration cost
- Step-by-step feature implementation: when requirements are broken down into ordered steps, LLM follows instructions reliably

### 11.3 When Not to Use LLMs (or Use with Caution)

- UI and frontend development: LLM cannot see the final visual result, leading to blind iterations with broken layouts and styles after every cycle; manual development is faster and more reliable
- Mobile development: all UI problems are amplified by device-specific rendering differences, physical device testing, and platform-specific constraints; 200+ iterations for a single screen is not viable
- Private API and package integration: LLM cannot discover or understand private NuGet packages, SDKs, or undocumented APIs without comprehensive human-provided documentation; writing detailed prompts to explain private package internals can take more time than writing the code manually
- Infrastructure provisioning and cloud resource management: LLM-generated scripts for Azure resources (Entra ID, APIM, Azure OpenAI) consistently had incorrect commands, missing parameters, and wrong API versions; infrastructure must be provisioned manually
- Newer package versions and dependency management: LLM falls back to outdated package APIs from training data, installs packages for wrong runtime versions, and uses packages that do not exist; package management requires human oversight
- Complex UI redesigns and layout-heavy work: broad instructions like "make it look like Netflix" cause LLM to regenerate entire layouts, breaking existing styles and functionality

### 11.4 Recommendations for Future PoCs

- Start every feature with ADR generation: use the ADR as context for all subsequent implementation prompts to significantly improve code generation quality
- Break requirements into explicit, numbered steps: LLM cannot prioritize or order tasks on its own; step-by-step instructions prevent skipped or reordered requirements
- Separate backend and frontend work: delegate server-side code generation to LLM, keep UI/layout work manual; this division maximizes LLM productivity and minimizes wasted iterations
- Prepare documentation for private packages upfront: if the PoC involves private APIs or NuGet packages, document interfaces, methods, and usage patterns before starting LLM-assisted development
- Always review LLM output for missed requirements: LLM consistently ignores or drops explicit requirements between iterations; a checklist-based review after each generation cycle is essential
- Do not use LLM for infrastructure provisioning: create Azure resources, configure identity providers, and manage environment variables manually; LLM-generated infrastructure scripts are unreliable and potentially dangerous to existing resources
- Use LLM for generating unit tests alongside code: this is a low-cost, high-value addition that improves code quality without extra iterations
- Plan for human intervention on visual validation: LLM cannot replace visual review; allocate time for manual layout and style fixes in every UI-related PoC
- Consider alternative tools carefully: SpecKit and similar spec-driven tools are designed for full-scale projects, not PoCs; evaluate whether the overhead of any tool is justified for PoC scope

