# Case Report: Financial Tracker Mobile App

## 1. Business Use Case & Requirements

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

## 2. Architecture & Technology Stack

- React Native
- Expo Go (for loading and testing on physical devices)
- TypeScript

## 3. LLM Involvement in Implementation

### 3.1 What was delegated to the LLM

- Project setup and scaffolding (React Native + Expo)
- Screen and component generation
- Navigation setup
- Mock data and API communication layer
- State management

### 3.2 What required human input

- Manual coding and layout adjustments after each iteration
- Debugging and loading the app to physical device using Expo Go
- Visual validation on different Android devices (phone and tablet)
- Styles and layout fixes for device-specific rendering issues

### 3.3 Prompt interaction flow

- More than 200 iterations to get even one view (account list management) working on Android Samsung phone
- The same view did not work as expected on Samsung tablet
- Each iteration required manual debugging, code fixes, and reloading via Expo Go
- Similar issues to E-Commerce case: broken layouts, style problems, blind iteration without visual feedback

### 3.4 Integration effort

- Same problems as E-Commerce case with package versions and imports
- LLM could not account for device-specific rendering differences (phone vs tablet)
- Mock API layer was generated but required manual adjustments for proper integration with screens

## 4. Evaluation

### 4.1 Business Use Cases

- MVP requirements were not met; even a single screen (account list) required 200+ iterations and was still not fully functional
- Cross-device compatibility was not achieved; layout worked differently on Samsung phone vs Samsung tablet

### 4.2 Reliability

- Extremely unreliable; each iteration broke the app and required manual debugging
- Constant issues with package compatibility, navigation setup, and device-specific rendering

### 4.3 Code Quality

- Same issues as E-Commerce case: monolithic components, no separation of concerns, no DRY
- Mobile-specific best practices were not followed (e.g., responsive layouts, platform-specific styling)

### 4.4 Speed

- Significantly slower than manual development due to the extreme number of iterations (200+)
- Manual debugging and physical device testing added overhead that LLM could not reduce
- Net negative speedup compared to a developer building the screen manually

## 5. Key Findings & Lessons Learned

- Results are mostly the same as E-Commerce case, but amplified by mobile-specific challenges
- LLM cannot handle device-specific differences; what works on one device may break on another
- Mobile development adds an extra layer of complexity (Expo Go loading, physical device testing) that LLM cannot accelerate
- 200+ iterations for a single list view screen demonstrates that LLM-driven mobile UI development is not viable in its current state
- Manual mobile development would be significantly faster and more reliable
