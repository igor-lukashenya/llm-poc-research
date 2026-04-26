# Case Report: [Case Name]

## 1. Business Use Case & Requirements

- **Business scenario:** Short description.
- **Initial PoC requirements summary:**
  - Functional requirements implemented.
  - Non-functional requirements considered (e.g., performance, UX, simplicity).
- **Assumptions or refinements made to requirements:**

## 2. Architecture & Technology Stack

- **Tech stack:** (e.g., React/Vite/TypeScript, simple in-memory data store).
- **Mocking strategy:** (e.g., mock data vs external services).

## 3. LLM Involvement in Implementation

### 3.1 What was delegated to the LLM

- Artifacts generated (project scaffolding, components, data models, styles, test data, config files, etc.).
- Whether generation was done in one shot or iteratively with refinements.
- Approximate share of the final codebase that came from LLM output.

### 3.2 What required human input

- Requirements clarification or refinement before prompting.
- Manual corrections after generation (bug fixes, logic adjustments).
- Parts written or substantially rewritten by hand.
- Design decisions the LLM couldn't make on its own (architecture, library selection, data modeling).

### 3.3 Prompt interaction flow

- Number of prompt iterations needed to reach a working result.
- Key moments where prompts had to be restructured or made more specific.
- Whether context files (specs, existing code, examples) were provided and how that affected output quality.

### 3.4 Integration effort

- How well the LLM wired together libraries, frameworks, and APIs.
- Whether generated code required glue code or adapters written manually.
- Mocking/stubbing decisions — handled by LLM or guided by human.

## 4. Evaluation

### 4.1 Business Use Cases

- Did the PoC meet the initial functional requirements?
- Did the generated sample data and scenarios look realistic and meaningful?

### 4.2 Reliability

- Did the PoC run end-to-end without major fixes?
- Number/type of issues found (runtime errors, logic flaws, missing edge cases).
- How much debugging was necessary?

### 4.3 Code Quality

- Structure and modularity (components, hooks, separation of concerns).
- Readability and maintainability.
- Any noticeable anti-patterns or unnecessary complexity.
- How effectively the LLM integrated libraries/frameworks.

### 4.4 Speed

- Estimated time to complete with LLM support.
- Estimated time for a traditional/manual implementation (baseline).
- Observed speedup and where human intervention was still a bottleneck.

## 5. Key Findings & Lessons Learned

- What worked especially well.
- Main pain points.
- Recommendations for using LLM on similar PoCs.
