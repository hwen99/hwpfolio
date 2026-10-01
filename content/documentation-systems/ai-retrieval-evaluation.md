---
id: evaluating-documentation-for-ai-retrieval
title: "AI answer evaluation: Content structure and retrieval"
summary: Evaluating AI answers to distinguish documentation gaps from retrieval issues and inform content recommendations.
type: case-study
status: professional
audience:
  - Technical writers
  - AI assistant development team
tools:
  - Markdown
  - FortiAppSec Cloud AI Assistant
  - ChatGPT
---

Knowledge architecture · AI retrieval evaluation

---

## Overview

- **Deliverable:** Content recommendations, structured metadata, and an exploratory evaluation
- **Audience:** Technical writers and the AI assistant development team
- **Tools:** Markdown, FortiAppSec Cloud AI Assistant, ChatGPT
- **Timeline:** June 15–August 30, 2026
- **My contribution:** Researched content practices, implemented metadata, designed test questions, and analyzed responses

## The challenge

FortiAppSec Cloud launched a beta AI assistant that uses product documentation among its knowledge sources to answer user questions. This gave our content two audiences: people reading it directly and AI systems retrieving information to answer questions.

I wanted to understand whether changes to content structure and metadata could improve AI answers while preserving the documentation’s usefulness to readers. That also required distinguishing problems in the source content from problems in how the assistant retrieved or used it.

## My approach

I consulted developers to understand how the assistant processed documentation and researched practices that could support retrieval.

I translated the findings into recommendations for technical writers:

- **Preserve context within sections.** Keep explanations meaningful when retrieved separately from the full page.
- **Make topics easier to identify.** Use descriptive headings, consistent terminology, natural search language, and structured metadata.
- **Keep essential information accessible and consistent.** Describe informative visuals with meaningful alt text and use shared snippets for repeated content.

I presented the recommendations to writers across the organization. During the [**Flare-to-Markdown migration**](topic:madcap-flare-to-markdown-migration), I also added structured metadata, creating an opportunity to evaluate responses before and after the changes.

### Evaluation design

I compared the assistant’s answers before and after the migration and metadata integration, using questions across several scenarios:

- Basic factual lookup
- Cross-referencing information across topics
- Multi-step procedures
- Terminology disambiguation
- Negative and edge cases
- Complex configuration questions

**The source documentation was not rewritten to answer the test questions.** This helped keep the evaluation focused on the existing content and how the assistant used it.

> 
> 
> 
> *Illustrative example showing my evaluation approach. The scenario and answer summaries are fictional; no internal assistant responses or test results are reproduced.*
> 
> **Question:** “How do I connect an application to a monitoring service?”
> 
> | Evaluation element | Example |
> | --- | --- |
> | Expected information | Prerequisites, configuration steps, and a final verification step |
> | Answer A | Identifies the correct feature but leaves out prerequisites and verification |
> | Answer B | Provides a clearer sequence but still omits verification |
> | Assessment | Better organization does not necessarily mean a complete answer |
> | Next investigation | Check whether the verification guidance exists in the source, whether it reached the model, and whether the answer used it |

## Findings and implications

**Responses improved for 44%** of the questions tested. I treated this as an exploratory finding because some prompts differed between runs, responses could vary, and the migration and metadata changes occurred together. The evaluation did not establish which changes caused the improvement.

The findings informed practical content recommendations and identified areas for further investigation:

- **Retrieval quality:** How indexing and metadata affect which content is retrieved.
- **Multi-step retrieval:** Whether the assistant can find and combine information across topics.
- **Implementation tradeoffs:** How potential improvements balance accuracy, response time, token cost, development effort, and product requirements.

Reviewing the answers also revealed omissions of information explicitly stated in the documentation. This highlighted an important distinction for AI content strategy: **an incomplete AI answer does not necessarily indicate missing documentation.** These cases warranted investigation of retrieval and answer generation before deciding whether new content was needed.
