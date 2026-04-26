# Research Definition

The main idea is to investigate whether LLM's can be used to speed up the generation of the  proof of concept for various ideas.

## PoC definition

Proof of concept is a realization of a certain idea or method in order to demonstrate its feasibility and viability. **PoC** **has to be small** and may not be fully complete (some integration into existing infrastructure may be missing),  but it has to be fully demonstrable to the client (not necessarily use a real db etc)

PoC has to answer at the following question:

- Can this concept work in the practical world?

## PoC development plan

- Define customer pain points and prioritize them
- Define PoC scope:
  - Scope functional requirements are going to be implemented in PoC
  - Prioritize non-functional requirements (or plan how to meet them during later implementation phases)
  - Integration plan into the existing infrastructure
- Define measurable metrics to measure PoC success
- Implement PoC
  - Implement functional requirements
  - Test against success metrics and refine implementation
  - Check if non-functional requirements are met (or justify the plan how to meet them on later stages)
- Prepare PoC demo presentation
  - Implemented use-cases and functionality
  - Key success metrics achievements
  - Integration plan into existing infrastructure
  - Roadmap plan

## What to research

The **main goal of this research** is to **focus on the PoC Implementation** and test the ability of LLM to write the complete code which covers PoC requirements.

PoC initial requirements is attached. Feel free to refine/clarify any of the requirements or make any assumptions.

## Research results

Research results has to include answers for the following questions:

- **Business use cases**
  - Check if the initial requirements are met by the PoC implemented by LLM.
  - Can LLM generate meaningful sample data and realistic scenarios for testing?
  - Can LLM generate working PoCs for different domains (e.g., e-commerce, fintech, healthcare)?  
- **Reliability**
  - Can the generated PoC function correctly without major modifications?
  - How often do the generated code contain significant bugs or logical errors?
- **Code quality**
  - How well is the generated code structured, readable, and maintainable?
  - Does the generated code contain unnecessary complexity or anti-patterns?
  - How much manual involvement is required to refine the PoC requirements?
  - Can LLM generate PoC across different technology stacks (e.g., back-end, front-end, HTML/CSS markup)?
  - How well can LLM make technical assumptions and mock any layers (e.g., use in-memory app cache instead of having deployed standalone database, or, mock interaction with 3-rd party app)?
  - How effectively can LLM integrate existing frameworks and 3-rd party libraries?
- **Speed**
  - Assess how LLM helped to speed up the PoC development compared to traditional development methods.
  - What are the key bottlenecks where LLMs require human intervention?
- **GPT prompts**
  - Provide calibrated and refined prompts or other material for AI which worked the best.

## PoC requirements

Task description for PoC is located under "PoC task example" section of the report document.
