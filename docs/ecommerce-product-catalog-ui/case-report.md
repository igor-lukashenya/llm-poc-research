# Case Report: E-Commerce Product Catalog Web Client

## 1. Business Use Case & Requirements

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

## 2. Architecture & Technology Stack

- React
- Typescript
- Vite

## 3. LLM Involvement in Implementation

### 3.1 What was delegated to the LLM

- Project setup and scaffolding (React + Vite + TypeScript)
- Packages installation and dependency management
- ESLint configuration
- Prettier configuration
- Best practices setup (project structure, coding conventions)
- Code generation (components, data models, styles, routing, filtering/sorting logic)
- Tests generation

### 3.2 What required human input

- Templates and layouts management
- Styles adjustments and fixes
- Result validation and visual review

### 3.3 Prompt interaction flow

- Project setup and configuration completed in less than 5 iterations
- Packages installed after 1 iteration, but required additional work to fix issues
  - Some packages used outdated versions
  - Some packages were installed for unsupported Node version
- LLM was not able to identify existing Node version
  - Tried to use latest version of Node instead of the one available in the environment

### 3.4 Integration effort

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

## 4. Evaluation

### 4.1 Business Use Cases

- PoC did not meet the initial requirements; the final result was unusable in terms of UI/UX
- New requirements and changes were applied, but the resulting UI/UX was broken after each iteration
- Some business requirements were missed entirely (e.g., "Sale" and "Popular" sidebar sections were ignored)
- Generated sample data was realistic in structure but image placeholder services did not work correctly

### 4.2 Reliability

- PoC could not run end-to-end without significant fixes; each iteration required manual corrections
- Frequent issues with package dependencies: LLM used non-installed packages, outdated versions, and wrong imports
- After each failed iteration, manual debugging and code fixes were necessary before the app could run again

### 4.3 Code Quality

- Overall code quality is poor
- LLM tends to keep all components in the same file instead of splitting into separate modules
- No component decomposition; generates huge monolithic files
- Does not follow DRY (Don't Repeat Yourself) principle; duplicates code across components
- No separation between logic and visualization layers
- No performance optimization (e.g., missing React hooks like useMemo, useCallback, React.memo)

### 4.4 Speed

- Project setup and initial configuration is significantly faster with LLM compared to manual approach
- UI code generation and debugging is too slow; LLM cannot see the final visual result, which leads to many blind iterations
- LLM generates large monolithic components that are difficult to modify, making incremental changes painful
- Manual UI development would be faster overall due to the constant need for visual validation, layout fixes, and style corrections

## 5. Key Findings & Lessons Learned

- LLM can set up and configure a project effectively because scaffolding and tooling are well-documented (Vite, ESLint, Prettier, TypeScript)
- LLM cannot use newer NPM packages correctly because it lacks up-to-date information about them; falls back to outdated versions or wrong APIs
- LLM cannot see the final visual result, which makes UI development a blind process requiring constant manual validation and fixes
- Code quality is poor: monolithic files, no component decomposition, no DRY, no logic/view separation, no performance optimization
- LLM ignores or drops business requirements between iterations (e.g., "Sale" and "Popular" sections were never implemented)
- LLM adds unrequested features on its own (popups, zoom buttons) while missing explicitly requested ones
- Router package confusion (react-router-dom vs react-router) persisted across multiple iterations despite explicit corrections
- For frontend UI PoCs, it would be faster to implement manually than to iterate with LLM and fix broken layouts after each cycle
- LLM is useful for initial project scaffolding and generating sample data structure, but not for visual/layout-heavy work
