# LLM PoC Research Report

## 1. Executive Summary

- One-paragraph summary of the research.
- Key findings across all PoCs.
- High-level conclusion: can LLMs reliably accelerate PoC development?

## 2. Research Context & Goals

- **Business context:** Why this research was initiated.
- **Main goal:** Confirm if LLMs can implement end-to-end PoCs that are demonstrable to clients.
- **Scope of this research:**
  - E-Commerce product catalog web client
  - Financial tracker mobile app
  - Integration with existing public API
  - Integration with private customer API
  - New AI-powered feature in an existing app
  - SpecKit usage for E-Commerce catalog MVP
- **Out of scope / assumptions:**
  - (e.g., production-grade security, performance tuning, infra automation, etc.)

## 3. Methodology

- **LLM setup:**
  - Model(s) used:
  - Tools/IDE used (e.g., VS Code + Copilot):
  - Additional plugins / extensions:
- **Working style:**
  - How prompts were crafted and iterated.
  - Division of work between LLM and human (design, coding, refactoring, testing).
- **Measurement approach:**
  - How “speed” was estimated (time logs, rough estimation, comparison to baseline).
  - How “correctness” and “quality” were judged (manual review, test cases, etc.).

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

---

## 5. PoC Case 2 – Financial Tracker Mobile App

*(Repeat same structure as Section 4; adapt bullets to mobile context.)*

### 5.1 Business Use Case & Requirements

### 5.2 Architecture & Technology Stack

### 5.3 LLM Involvement in Implementation

#### 5.3.1 What was delegated to the LLM

#### 5.3.2 What required human input

#### 5.3.3 Prompt interaction flow

#### 5.3.4 Integration effort

### 5.4 Evaluation

### 5.5 Key Findings & Lessons Learned

---

## 6. PoC Case 3 – Integration with Existing Public API

*(Same structure, with emphasis on API integration)*

### 6.1 Business Use Case & Requirements

### 6.2 Architecture & Technology Stack

### 6.3 LLM Involvement in Implementation

#### 6.3.1 What was delegated to the LLM

#### 6.3.2 What required human input

#### 6.3.3 Prompt interaction flow

#### 6.3.4 Integration effort

### 6.4 Evaluation

### 6.5 Key Findings & Lessons Learned

---

## 7. PoC Case 4 – Integration with Private Customer API

*(Same structure, with notes on working only from specs / stubs / documentation.)*

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

- Across all PoCs, did LLM-generated solutions meet initial requirements?
- Where did LLM struggle to understand domain-specific details?
- Which domains (ecommerce, fintech, integrations, AI feature) were most “LLM-friendly”?

### 9.2 Reliability

- Typical categories of bugs:
  - Syntax / type errors
  - Logic errors
  - Missing edge cases
  - Integration issues (API contracts, auth, error codes)
- How often manual debugging was required.
- Situations where LLM solutions worked “almost out of the box”.

### 9.3 Code Quality

- General structure and patterns (layering, components, services).
- Common anti-patterns or smells repeatedly produced.
- How easy it was to refactor or extend LLM-generated code.
- Ability to work across different stacks (web frontend, mobile, API integrations).

### 9.4 Speed & Productivity

- Overall development time vs. estimated baseline across all PoCs.
- Stages where LLM provided biggest speedups:
  - Scaffolding, boilerplate, UI components, sample data, docs, etc.
- Stages where human input was essential:
  - Domain modeling, integration details, debugging, test design, acceptance criteria.

---

## 10. Prompting Strategy & Best Prompts

### 10.1 Prompt Design Process

- How prompts evolved from initial rough requests to precise instructions.
- Which types of instructions were most effective (step-by-step, constraints, examples, etc.).

### 10.2 Effective Prompt Patterns

For each pattern, include:
- **Name:** (e.g., “Refine existing component”, “Generate test data”, “Create integration adapter”)
- **Goal:** What problem it solved.
- **Example prompt:** (sanitized, reusable snippet).
- **Notes:** When to use / pitfalls.

### 10.3 Ineffective Approaches

- Prompt styles that consistently produced poor results.
- Misunderstandings or hallucinations that occurred.

---

## 11. Conclusions & Recommendations

- **Overall viability:** Is LLM-based PoC development feasible and reliable enough?
- **When to use LLMs:**
  - Best-suited domains and tasks.
- **When to be cautious / rely more on humans:**
  - Edge cases, complex domain rules, critical integration paths.
- **Recommendations for future PoCs:**
  - Team setup, process guidelines, tooling, and quality gates.

---

## 12. Appendix

- Links to PoC repositories or folders.
- List of tools and versions.
- Additional screenshots or demo notes.
- Any additional detailed logs of prompts and responses (if needed).
