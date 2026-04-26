# Case Report: Integration with Private Customer API

## 1. Business Use Case & Requirements

- One of the companies implemented their own user authorization service
- The service handles authorization, stores user roles and grants for each company application
- Administrators can manage user access from a single panel across all company applications
- Investigate ability to integrate an existing application with this private authorization service

## 2. Architecture & Technology Stack

- ASP.NET (C#)
- Private company authorization service
- Private NuGet package for service integration

## 3. LLM Involvement in Implementation

### 3.1 What was delegated to the LLM

- Architecture Decision Records (ADR) and feature design
- Server-side C# code generation for authorization integration
- Unit tests generation with mock support

### 3.2 What required human input

- Investigation of private NuGet package API and documentation
- Explaining private package logic, contracts, and usage patterns to LLM
- Providing detailed descriptions of authorization service behavior and integration points

### 3.3 Prompt interaction flow

- Results are mostly the same as for Integration with Existing Public API, but with significantly more prompts and iterations
- About 25+ iterations to get a working solution
- Each iteration required explaining private NuGet package internals to LLM because the service is private and not in LLM's training data
- Writing detailed prompts about package behavior sometimes took more time than writing the code manually using IntelliSense
- After all explanations and additional prompts, the final solution was working and functional

### 3.4 Integration effort

- Same patterns as Public API case: core C# code integrated smoothly once LLM understood the contracts
- Significant upfront effort to document and explain private NuGet package before LLM could generate usable code
- Developer had to act as a bridge between private package documentation and LLM, translating API surface into prompts

## 4. Evaluation

### 4.1 Business Use Cases

- Final solution met business requirements for authorization integration
- Working integration achieved after extensive prompt iterations

### 4.2 Reliability

- Same as Public API case: core code was reliable once generated correctly
- LLM could not independently discover or understand private NuGet package API without detailed human guidance

### 4.3 Code Quality

- Generated C# code quality was good after sufficient context was provided
- Code followed existing patterns and was production-ready
- Unit tests with mock support were generated alongside the code

### 4.4 Speed

- ADR and feature design: speedup consistent with other cases
- Core integration code: significantly slower than Public API case due to 25+ iterations and extensive prompt writing
- Time spent writing prompts to explain private package logic sometimes exceeded time to write the code manually
- Net speedup is marginal or negative when factoring in prompt preparation overhead

## 5. Key Findings & Lessons Learned

- Results are consistent with Public API case but amplified by the private nature of the service
- LLM cannot work with private NuGet packages without comprehensive human-provided documentation and explanations
- Writing detailed prompts to explain private package internals can take more time than implementing the code manually using IntelliSense
- The developer becomes a bottleneck: translating private API documentation into LLM-friendly prompts adds overhead that may negate productivity gains
- After sufficient context is provided, LLM generates working, production-quality code with unit tests
- For private API integrations, the ratio of prompt preparation effort to code generation value is unfavorable compared to public API integrations
- LLM is viable for private API integration but the cost-benefit analysis is less compelling than for well-documented public APIs
