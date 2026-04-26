# Case Report: Integration with Existing Public API

## 1. Business Use Case & Requirements

- Implement ability to create and manage Azure API Management subscriptions from ASP.NET server
- One of the products wants to use APIM subscriptions to protect their Azure Functions and provide these subscriptions to customers
- For each subscription, manage the list of products available through that subscription
- Implement subscription rotation every 90 days
- Provide subscriptions list on Admin panel with filtering, sorting, and pagination

## 2. Architecture & Technology Stack

- ASP.NET (C#)
- Azure API Management
- Microsoft Entra ID

## 3. LLM Involvement in Implementation

### 3.1 What was delegated to the LLM

- Architecture Decision Records (ADR) and feature design
- Server-side C# code generation for subscription management
- Unit tests generation with mock support
- Integration with existing ASP.NET API

### 3.2 What required human input

- Configuration of products list in Azure API Management
- Microsoft Entra ID token acquisition and configuration for APIM access
- Admin panel subscriptions listing with filtering, sorting, and pagination (initially missed by LLM)

### 3.3 Prompt interaction flow

- ADR and feature design generated in initial prompt iterations
- Core subscription management code generated in less than 5 iterations
- Code was production-quality with unit tests and mock support out of the box
- Extra prompts required to address missing admin panel listing requirement (filtering, sorting, pagination)
- LLM was not able to configure APIM products list or Entra ID token management regardless of iteration count

### 3.4 Integration effort

- C# code integrated smoothly into existing ASP.NET API with minimal effort
- Unit tests with mocks integrated without issues
- APIM product configuration required fully manual implementation
- Microsoft Entra ID setup for token management required fully manual implementation
- Admin panel listing feature required additional prompt iterations after LLM ignored the requirement

## 4. Evaluation

### 4.1 Business Use Cases

- Core subscription management feature met business requirements
- Subscription rotation logic implemented correctly
- Admin panel listing with filtering, sorting, and pagination was initially missed; implemented after extra prompts
- Products list configuration per subscription in APIM was not achievable through LLM

### 4.2 Reliability

- Core C# code was reliable and production-ready
- LLM failed on Azure-specific integration tasks: APIM product configuration and Entra ID token management
- LLM ignored one of the explicit requirements (admin panel listing), requiring additional iterations to address

### 4.3 Code Quality

- Generated C# code was production-quality and followed existing patterns
- Unit tests were well-structured with proper mock support
- Code was ready for integration without significant rework
- APIM configuration and Entra ID integration code was unusable

### 4.4 Speed

- ADR and feature design: significant speedup
- Core subscription management code: fast generation, less than 5 iterations
- Admin panel listing: moderate slowdown due to initially missed requirement and extra iterations
- APIM product configuration and Entra ID: no speedup, fully manual implementation required

## 5. Key Findings & Lessons Learned

- LLM generates high-quality, production-ready C# code for server-side features when integrating with well-documented public Azure APIs
- ADR and feature design generation continues to provide immediate value, consistent with findings from other cases
- LLM fails on Azure-specific resource configuration tasks (APIM product list management) that require knowledge of specific Azure service internals
- Microsoft Entra ID token acquisition and configuration remains outside LLM's reliable capabilities
- LLM can miss explicit requirements (admin panel listing was ignored), requiring careful review and additional prompts
- Server-side/API code generation is a strong use case for LLM; integration with existing Azure infrastructure and identity management is not
- Unit tests with mock support were generated alongside the code, improving overall code quality and testability
