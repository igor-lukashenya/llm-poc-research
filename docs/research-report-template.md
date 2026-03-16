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

### 4.1 Business Use Case & Requirements

- Initial application requirements
  - Implement MVP for E-Commerce product catalog as a web application
  - Display a list of products with key details (name, category, brand, price, rating, image, reviews)
  - Filter products by category and brand
  - Search products by name
  - Sort products by price and rating
  - Add products to favorites
  - Generate realistic sample product data (multiple categories, brands, varied pricing)
  - Investigate how effectively LLM can implement a complete frontend PoC from scratch based on requirements
- New changes from business after initial implementation
  - Netflix-style UI redesign: replace grid layout with horizontally scrollable product carousels per category
  - Featured product banner at the top, dynamically selected by popularity or sale status
  - Left sidebar navigation with category selection, brand filter, search, favorites shortcut, and additional links
  - Responsive design: horizontal scroll on desktop and mobile, collapsible sidebar on small screens
  - Dark theme styling with hover effects, smooth transitions, and "Popular"/"On Sale" badges
  - Data model updates: add "isPopular" and "isOnSale" flags to product data
  - Accessibility and performance improvements: keyboard navigation, lazy loading for images
  - Investigate how well LLM can iterate on existing code with evolving customer requirements

### 4.2 Architecture & Technology Stack

- React
- Typescript
- Vite

### 4.3 LLM Involvement in Implementation

#### 4.3.1 What was delegated to the LLM

- Project setup and scaffolding (React + Vite + TypeScript)
- Packages installation and dependency management
- ESLint configuration
- Prettier configuration
- Best practices setup (project structure, coding conventions)
- Code generation (components, data models, styles, routing, filtering/sorting logic)
- Tests generation

#### 4.3.2 What required human input

- Templates and layouts management
- Styles adjustments and fixes
- Result validation and visual review

#### 4.3.3 Prompt interaction flow

- Project setup and configuration completed in less than 5 iterations
- Packages installed after 1 iteration, but required additional work to fix issues
  - Some packages used outdated versions
  - Some packages were installed for unsupported Node version
- LLM was not able to identify existing Node version
  - Tried to use latest version of Node instead of the one available in the environment

#### 4.3.4 Integration effort

- LLM could not prioritize and order changes, applied them without clear priority
- When requirements were updated to have multiple pages (catalog, details, etc.), LLM could not resolve the router package correctly
- When asked to add routing, LLM tried to use old react-router-dom instead of react-router
- Even after explicit update to react-router, LLM kept reverting to react-router-dom usage
- When creating new components, LLM tried to import code from packages that were not installed
- Requirements about sidebar sections for "Sale" and "Popular" were ignored
- When asked to implement Netflix-style design, LLM regenerated layout and horizontal scrolls, but styles were broken and the app was not usable
- After each iteration, layout and styles required manual fixes
- LLM added extra actions automatically without specific requirements (e.g., "View Details" popup, zoom buttons for photos)
- Issues with using image placeholder services for mock product data

### 4.4 Evaluation

#### 4.4.1 Business Use Cases

- PoC did not meet the initial requirements; the final result was unusable in terms of UI/UX
- New requirements and changes were applied, but the resulting UI/UX was broken after each iteration
- Some business requirements were missed entirely (e.g., "Sale" and "Popular" sidebar sections were ignored)
- Generated sample data was realistic in structure but image placeholder services did not work correctly

#### 4.4.2 Reliability

- PoC could not run end-to-end without significant fixes; each iteration required manual corrections
- Frequent issues with package dependencies: LLM used non-installed packages, outdated versions, and wrong imports
- After each failed iteration, manual debugging and code fixes were necessary before the app could run again

#### 4.4.3 Code Quality

- Overall code quality is poor
- LLM tends to keep all components in the same file instead of splitting into separate modules
- No component decomposition; generates huge monolithic files
- Does not follow DRY (Don't Repeat Yourself) principle; duplicates code across components
- No separation between logic and visualization layers
- No performance optimization (e.g., missing React hooks like useMemo, useCallback, React.memo)

#### 4.4.4 Speed

- Project setup and initial configuration is significantly faster with LLM compared to manual approach
- UI code generation and debugging is too slow; LLM cannot see the final visual result, which leads to many blind iterations
- LLM generates large monolithic components that are difficult to modify, making incremental changes painful
- Manual UI development would be faster overall due to the constant need for visual validation, layout fixes, and style corrections

### 4.5 Key Findings & Lessons Learned

- LLM can set up and configure a project effectively because scaffolding and tooling are well-documented (Vite, ESLint, Prettier, TypeScript)
- LLM cannot use newer NPM packages correctly because it lacks up-to-date information about them; falls back to outdated versions or wrong APIs
- LLM cannot see the final visual result, which makes UI development a blind process requiring constant manual validation and fixes
- Code quality is poor: monolithic files, no component decomposition, no DRY, no logic/view separation, no performance optimization
- LLM ignores or drops business requirements between iterations (e.g., "Sale" and "Popular" sections were never implemented)
- LLM adds unrequested features on its own (popups, zoom buttons) while missing explicitly requested ones
- Router package confusion (react-router-dom vs react-router) persisted across multiple iterations despite explicit corrections
- For frontend UI PoCs, it would be faster to implement manually than to iterate with LLM and fix broken layouts after each cycle
- LLM is useful for initial project scaffolding and generating sample data structure, but not for visual/layout-heavy work

### 4.6 Alternative Approach: SpecKit

- Attempted to implement the same E-Commerce Product Catalog using SpecKit with spec-driven development approach
- SpecKit is not suitable for PoC development; it is designed for real, full-scale projects that follow spec-driven development methodology
- Generates excessive amounts of unused and unreadable code that adds no value in a PoC context
- Time spent understanding and cleaning up generated code exceeded the time it would take to write the PoC manually
- For PoC purposes, SpecKit adds unnecessary complexity and overhead without meaningful productivity gains

---

## 5. PoC Case 2 – Financial Tracker Mobile App

### 5.1 Business Use Case & Requirements

- Implement a personal financial tracker mobile app with analytics
- Core features
  - Manage user accounts (create, edit, delete)
  - Manage expense/income categories
  - Track transactions with categorization
  - Analytics and overview of spending/income
- Killer feature: ability to share accounts and categories with family members
- MVP scope
  - Implement mobile app with working UI screens
  - Mock API communication (no real backend)

### 5.2 Architecture & Technology Stack

- React Native
- Expo Go (for loading and testing on physical devices)
- TypeScript

### 5.3 LLM Involvement in Implementation

#### 5.3.1 What was delegated to the LLM

- Project setup and scaffolding (React Native + Expo)
- Screen and component generation
- Navigation setup
- Mock data and API communication layer
- State management

#### 5.3.2 What required human input

- Manual coding and layout adjustments after each iteration
- Debugging and loading the app to physical device using Expo Go
- Visual validation on different Android devices (phone and tablet)
- Styles and layout fixes for device-specific rendering issues

#### 5.3.3 Prompt interaction flow

- More than 200 iterations to get even one view (account list management) working on Android Samsung phone
- The same view did not work as expected on Samsung tablet
- Each iteration required manual debugging, code fixes, and reloading via Expo Go
- Similar issues to E-Commerce case: broken layouts, style problems, blind iteration without visual feedback

#### 5.3.4 Integration effort

- Same problems as E-Commerce case with package versions and imports
- LLM could not account for device-specific rendering differences (phone vs tablet)
- Mock API layer was generated but required manual adjustments for proper integration with screens

### 5.4 Evaluation

#### 5.4.1 Business Use Cases

- MVP requirements were not met; even a single screen (account list) required 200+ iterations and was still not fully functional
- Cross-device compatibility was not achieved; layout worked differently on Samsung phone vs Samsung tablet

#### 5.4.2 Reliability

- Extremely unreliable; each iteration broke the app and required manual debugging
- Constant issues with package compatibility, navigation setup, and device-specific rendering

#### 5.4.3 Code Quality

- Same issues as E-Commerce case: monolithic components, no separation of concerns, no DRY
- Mobile-specific best practices were not followed (e.g., responsive layouts, platform-specific styling)

#### 5.4.4 Speed

- Significantly slower than manual development due to the extreme number of iterations (200+)
- Manual debugging and physical device testing added overhead that LLM could not reduce
- Net negative speedup compared to a developer building the screen manually

### 5.5 Key Findings & Lessons Learned

- Results are mostly the same as E-Commerce case, but amplified by mobile-specific challenges
- LLM cannot handle device-specific differences; what works on one device may break on another
- Mobile development adds an extra layer of complexity (Expo Go loading, physical device testing) that LLM cannot accelerate
- 200+ iterations for a single list view screen demonstrates that LLM-driven mobile UI development is not viable in its current state
- Manual mobile development would be significantly faster and more reliable

---

## 6. PoC Case 3 – Integration with Existing Public API

### 6.1 Business Use Case & Requirements

- Implement ability to create and manage Azure API Management subscriptions from ASP.NET server
- One of the products wants to use APIM subscriptions to protect their Azure Functions and provide these subscriptions to customers
- For each subscription, manage the list of products available through that subscription
- Implement subscription rotation every 90 days
- Provide subscriptions list on Admin panel with filtering, sorting, and pagination

### 6.2 Architecture & Technology Stack

- ASP.NET (C#)
- Azure API Management
- Microsoft Entra ID

### 6.3 LLM Involvement in Implementation

#### 6.3.1 What was delegated to the LLM

- Architecture Decision Records (ADR) and feature design
- Server-side C# code generation for subscription management
- Unit tests generation with mock support
- Integration with existing ASP.NET API

#### 6.3.2 What required human input

- Configuration of products list in Azure API Management
- Microsoft Entra ID token acquisition and configuration for APIM access
- Admin panel subscriptions listing with filtering, sorting, and pagination (initially missed by LLM)

#### 6.3.3 Prompt interaction flow

- ADR and feature design generated in initial prompt iterations
- Core subscription management code generated in less than 5 iterations
- Code was production-quality with unit tests and mock support out of the box
- Extra prompts required to address missing admin panel listing requirement (filtering, sorting, pagination)
- LLM was not able to configure APIM products list or Entra ID token management regardless of iteration count

#### 6.3.4 Integration effort

- C# code integrated smoothly into existing ASP.NET API with minimal effort
- Unit tests with mocks integrated without issues
- APIM product configuration required fully manual implementation
- Microsoft Entra ID setup for token management required fully manual implementation
- Admin panel listing feature required additional prompt iterations after LLM ignored the requirement

### 6.4 Evaluation

#### 6.4.1 Business Use Cases

- Core subscription management feature met business requirements
- Subscription rotation logic implemented correctly
- Admin panel listing with filtering, sorting, and pagination was initially missed; implemented after extra prompts
- Products list configuration per subscription in APIM was not achievable through LLM

#### 6.4.2 Reliability

- Core C# code was reliable and production-ready
- LLM failed on Azure-specific integration tasks: APIM product configuration and Entra ID token management
- LLM ignored one of the explicit requirements (admin panel listing), requiring additional iterations to address

#### 6.4.3 Code Quality

- Generated C# code was production-quality and followed existing patterns
- Unit tests were well-structured with proper mock support
- Code was ready for integration without significant rework
- APIM configuration and Entra ID integration code was unusable

#### 6.4.4 Speed

- ADR and feature design: significant speedup
- Core subscription management code: fast generation, less than 5 iterations
- Admin panel listing: moderate slowdown due to initially missed requirement and extra iterations
- APIM product configuration and Entra ID: no speedup, fully manual implementation required

### 6.5 Key Findings & Lessons Learned

- LLM generates high-quality, production-ready C# code for server-side features when integrating with well-documented public Azure APIs
- ADR and feature design generation continues to provide immediate value, consistent with findings from other cases
- LLM fails on Azure-specific resource configuration tasks (APIM product list management) that require knowledge of specific Azure service internals
- Microsoft Entra ID token acquisition and configuration remains outside LLM's reliable capabilities
- LLM can miss explicit requirements (admin panel listing was ignored), requiring careful review and additional prompts
- Server-side/API code generation is a strong use case for LLM; integration with existing Azure infrastructure and identity management is not
- Unit tests with mock support were generated alongside the code, improving overall code quality and testability

---

## 7. PoC Case 4 – Integration with Private Customer API

### 7.1 Business Use Case & Requirements

- One of the companies implemented their own user authorization service
- The service handles authorization, stores user roles and grants for each company application
- Administrators can manage user access from a single panel across all company applications
- Investigate ability to integrate an existing application with this private authorization service

### 7.2 Architecture & Technology Stack

- ASP.NET (C#)
- Private company authorization service
- Private NuGet package for service integration

### 7.3 LLM Involvement in Implementation

#### 7.3.1 What was delegated to the LLM

- Architecture Decision Records (ADR) and feature design
- Server-side C# code generation for authorization integration
- Unit tests generation with mock support

#### 7.3.2 What required human input

- Investigation of private NuGet package API and documentation
- Explaining private package logic, contracts, and usage patterns to LLM
- Providing detailed descriptions of authorization service behavior and integration points

#### 7.3.3 Prompt interaction flow

- Results are mostly the same as for Integration with Existing Public API, but with significantly more prompts and iterations
- About 25+ iterations to get a working solution
- Each iteration required explaining private NuGet package internals to LLM because the service is private and not in LLM's training data
- Writing detailed prompts about package behavior sometimes took more time than writing the code manually using IntelliSense
- After all explanations and additional prompts, the final solution was working and functional

#### 7.3.4 Integration effort

- Same patterns as Public API case: core C# code integrated smoothly once LLM understood the contracts
- Significant upfront effort to document and explain private NuGet package before LLM could generate usable code
- Developer had to act as a bridge between private package documentation and LLM, translating API surface into prompts

### 7.4 Evaluation

#### 7.4.1 Business Use Cases

- Final solution met business requirements for authorization integration
- Working integration achieved after extensive prompt iterations

#### 7.4.2 Reliability

- Same as Public API case: core code was reliable once generated correctly
- LLM could not independently discover or understand private NuGet package API without detailed human guidance

#### 7.4.3 Code Quality

- Generated C# code quality was good after sufficient context was provided
- Code followed existing patterns and was production-ready
- Unit tests with mock support were generated alongside the code

#### 7.4.4 Speed

- ADR and feature design: speedup consistent with other cases
- Core integration code: significantly slower than Public API case due to 25+ iterations and extensive prompt writing
- Time spent writing prompts to explain private package logic sometimes exceeded time to write the code manually
- Net speedup is marginal or negative when factoring in prompt preparation overhead

### 7.5 Key Findings & Lessons Learned

- Results are consistent with Public API case but amplified by the private nature of the service
- LLM cannot work with private NuGet packages without comprehensive human-provided documentation and explanations
- Writing detailed prompts to explain private package internals can take more time than implementing the code manually using IntelliSense
- The developer becomes a bottleneck: translating private API documentation into LLM-friendly prompts adds overhead that may negate productivity gains
- After sufficient context is provided, LLM generates working, production-quality code with unit tests
- For private API integrations, the ratio of prompt preparation effort to code generation value is unfavorable compared to public API integrations
- LLM is viable for private API integration but the cost-benefit analysis is less compelling than for well-documented public APIs

---

## 8. PoC Case 5 – New AI Feature in Existing App

### 8.1 Business Use Case & Requirements

- Existing Application with ability to import data from files
  - Files format is specific for each customer, country or location
  - Customers should be able to provide parsing configuration and structure from UI
  - Parsing module should use customer's configuration to import data
  - Parsing library is implemented and stored in private application owner Nuget
  - Parsing configuration UI is complex and huge component
- Implement new feature to automate parsing configuration and file structure using AI
  - User should upload example file and parsing configuration should be generate automatically
  - Data preview should be provided from the uploaded file using generated configuration
  - Improve users experience and ability to generate parsing configuration faster
  - Increase user engagement and the amount of user data uploaded

### 8.2 Architecture & Technology Stack

- ASP.NET for backend
- React for frontend
- Azure for cloud and infrastructure

### 8.3 LLM Involvement in Implementation

#### 8.3.1 What was delegated to the LLM

- Architecture Decision Records (ADR) and initial design
- Server side code generation and unit tests
- Integration with Semantic Kernel

#### 8.3.2 What required human input

- Integration with Azure OpenAI for Semantic Kernel
  - New resources creation and configuration
  - Environment variables configuration and improvements for options management in server side
- Existing parsing module description and documentation
- UI development and improvements
  - New components layouts and templates
  - Styles for new components
- Provide files for testing

#### 8.3.3 Prompt interaction flow

- Architecture Decision Records and initial design
  - 1 prompt iteration to generate ADR and initial design for server and client side changes
- Server side implementation
  - 1 prompt to implement new feature using ADR
  - Less than 5 iterations to provide more description and documentation about existing parsing module to improve quality
- Infrastructure changes
  - At least 10 iterations to generate and run scripts to create Azure OpenAI resources
  - Infrastructure resources were created manually after attempts using LLM
- Client side implementation
  - More than 10 iterations to update existing layout with new components and styles
  - After 10 iterations layout was updated manually without actions implementation
  - 3 iterations to generate new actions logic and integrate with API

#### 8.3.4 Integration effort

- Semantic Kernel integration generated by LLM, Azure OpenAI wiring done manually
- Server-side code integrated smoothly with minimal glue code
- Existing parsing module required manual documentation before LLM could generate compatible code
- UI integration was the main bottleneck — LLM struggled to work within existing layout and styles
- Component layouts and styles were written manually after multiple failed LLM attempts
- API integration logic for new components was successfully generated by LLM
- Environment and configuration setup handled entirely by human

### 8.4 Evaluation

#### 8.4.1 Business Use Cases

- ADR and initial design generation worked well, provided clear understanding of effort, feasibility, and scope for business stakeholders
- Enabled quick estimation and business-facing answers about possibility and effort to implement the feature
- Server-side parsing logic met functional requirements without significant developer effort
- UI feature was functional but required manual layout and styling fixes

#### 8.4.2 Reliability

- Server-side code generated correctly but LLM could not work with packages from private NuGet feed without comprehensive documentation
- UI code logic generated without issues; however, layouts and templates were consistently broken
- LLM provided scripts to create Azure OpenAI resources, but none of them worked
- LLM was not able to create infrastructure resources or wire them into Semantic Kernel integration
- All infrastructure and cloud provisioning required manual intervention

#### 8.4.3 Code Quality

- ADR and design artifacts were well-structured and usable as-is
- Server-side code was clean and followed existing patterns once proper documentation was provided
- UI code required significant rework on layout/template level; logic and API integration code was acceptable
- Infrastructure scripts were unusable due to incorrect commands, missing parameters, and wrong API versions

#### 8.4.4 Speed

- ADR and design: significant speedup, generated in a single prompt iteration
- Server-side: fast generation, slowed by the need to manually document private NuGet packages
- UI: net negative speedup on layout work (manual rewrite after 10+ failed iterations); logic/API integration was fast (3 iterations)
- Infrastructure: no speedup, all Azure OpenAI resource creation and configuration done manually after failed LLM attempts

### 8.5 Key Findings & Lessons Learned

- LLM excels at ADR generation and initial design, providing immediate value for feasibility assessment and effort estimation
- Server-side code generation works as expected when proper documentation about existing modules and domain context is provided
- LLM cannot work effectively with private NuGet packages; comprehensive documentation must be prepared upfront to compensate
- UI work is uncomfortable and time-consuming; explaining and fixing layouts and styles takes more iterations than writing them manually
- Infrastructure configuration and management experience is terrible and risky; LLM-generated scripts can potentially break existing resources and none of the generated scripts worked correctly
- LLM is most productive for backend logic, ADR, and API integration; least productive for UI layouts, infrastructure provisioning, and private package integration
- Providing ADR as context for subsequent implementation prompts significantly improved code generation quality
- Human involvement remains essential for cloud resource provisioning, environment configuration, and visual/layout work

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

