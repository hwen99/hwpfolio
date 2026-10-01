---
id: document-builder
title: "Document Builder: Developing a documentation publishing tool"
summary: Designing a publishing tool that coordinates 20 scripts, validates documentation, and generates previews and release files.
type: case-study
status: professional
audience:
  - Technical writing team members
tools:
  - Visual Studio Code
  - Codex
  - Python
  - Flask
  - JavaScript
  - HTML
  - CSS
---

AI-assisted software development · Docs-as-code 

---

## Overview

- **Deliverable:** A local browser application that validates Markdown sources and generates a publication ZIP and HTML/PDF previews. 
Docsite publishing and version control support are planned.
- **Audience:** Technical writing team members
- **Tools and technologies:** Visual Studio Code, Codex, Python, Flask, JavaScript, HTML, and CSS.
- **Timeline:** Sept 17-24, 2026
- **My role:** Requirements definition, workflow and architecture planning, and direction and verification of AI-assisted implementation.

## The challenge

As part of our transition from [MadCap Flare to Markdown](topic:madcap-flare-to-markdown-migration), we needed a way to validate source content and generate publication-ready outputs. 

Individual scripts provided parts of that workflow, but their execution order, inputs and release settings needed to be coordinated.

I designed Document Builder to bring those steps into one repeatable workflow, with individually adjustable components to accommodate different project requirements.

## My approach

I mapped the required inputs, outputs and user flow, then defined the build sequence and the information each script needed to exchange.

I adapted clean architecture principles to separate content rules and build workflows from the UI, file handling and tools, so individual processing steps could be changed independently. Mapping dependencies and user flows helped identify requirements and change impacts, while pre- and post-build checks assess publication readiness before previews become available.

![Handwritten Document Builder planning notes showing project setup, pre-build checks, output generation, and post-build checks, branching to preview and proposed publishing on success or file-specific errors on failure. A layered architecture diagram maps document rules, build workflows, adapters, and external tools, with arrows distinguishing dependencies from execution.](assets/planning-notes.png)

### Key design decisions

- **Validation before and after generation.** 
Valid source files do not guarantee valid outputs: generation can introduce broken links, unresolved variables or incorrect PDF bookmarks. Source checks catch problems early; output checks verify the generated package. Reporting affected file paths helps writers troubleshoot without inspecting the code.
- **Reliable connections between scripts.**
Previously separate scripts used different parameter names and path assumptions. A shared input contract ensures every step uses the same source, output location, version and build number—including meaningful leading zeros such as `0007`. This also keeps release information consistent across the Markdown ZIP and previews.
- **Editable build steps.** 
Writers can modify individual scripts to meet their project’s needs, and the team can improve existing scripts or add new checks over time. A shared input contract and explicit execution order help those changes work consistently within the build process.

This separation proved useful after I shared the application with colleagues. A coworker contributed an updated PDF-generation script, which I substituted for the existing script without changing the UI or disrupting the build workflow.

### File organization

```jsx
outputbuilder/
├── src/
│   └── document_builder/     Application code
│       ├── domain/           Document model and content rules
│       ├── application/      Build workflows and interfaces they require
│       ├── infrastructure/   File handling, rendering and script execution
│       ├── interfaces/       Browser request handlers, CLI and worker
│       ├── templates/        Browser UI HTML
│       └── static/           UI styles and JavaScript
│
├── functions/                Editable script bank
│   ├── pre-build_checks/     Validate source documents
│   ├── build/                Generate publication files and previews
│   └── post-build_checks/    Validate generated outputs
│
├── tests/                    Automated application and architecture tests
├── examples/                 Sample Markdown projects
├── dist/                     Generated builds and test outputs
├── artifacts/                Architecture diagrams and verification files
├── .venv/                    Local Python environment and dependencies
└── .git/                     Version history and repository settings
```

### Testing

Testing was designed at two levels: **publication checks** that run during every build, and **software tests** that verify the tool itself. 

I refined both the severity and scope of validation. Repeated terminology produces advisory warnings, while ID and doc-link requirements apply only to TOC-linked topics.

| Area | Tests included |
| --- | --- |
| Source checks | Valid frontmatter, resolvable variables, unique IDs and valid doc-links for TOC-linked topics, and signs of content corruption |
| Script coordination | Consistent inputs and paths, correct execution order, preservation of leading zeros, and stopping when a step fails |
| Output checks | No unresolved variables, valid local links and assets, ZIP contents matching prepared files, correct document order and PDF bookmark destinations |
| Application behavior | Source files remain unchanged, previous builds are preserved, failed builds cannot enable previews, and errors identify affected paths |
| Architecture | Core layers remain independent of UI and infrastructure, and workflow behavior can be tested without running external tools |

### Development and iteration

I directed AI-assisted implementation by defining build requirements, reviewing generated behavior and requiring tests for critical workflows. Iteration addressed inconsistent parameters, overly restrictive validation and PDF formatting defects, including lost line breaks in headings and callouts.

The project evolved from a command-line starter into a browser application with integrated generation, validation and previews. Automated tests covered script coordination, validation behavior, source preservation, and complete PDF and Markdown publication ZIP generation.

Initial corruption checks blocked legitimate repeated terminology and Markdown table separators. I changed repeated-text findings to advisory warnings and excluded formatting-only fragments, while retaining blocking checks for stronger corruption indicators.

## Results

The builder consolidates a workflow involving 20 scripts into one application, reducing manual execution and directory switching. Built-in sequencing and validation reduce reliance on writers remembering each publishing step.

I tested the builder on multiple real documentation projects and verified successful end-to-end generation of publication outputs. I also onboarded other writers, who have provided positive initial feedback and are adapting the scripts to their own project requirements. Broader adoption and time savings have not yet been measured.

![Completed build showing successful validation, available HTML/PDF previews, and the generated Markdown publication ZIP.](assets/document-builder-completed-build.png)

GitHub is already used for version control. API publishing and enhanced GitHub integration, including batch commits across multiple versions, remain planned.
