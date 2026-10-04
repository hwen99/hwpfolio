---
id: document-builder
title: "Document Builder: Developing a documentation publishing tool"
summary: Designing an extensible publishing tool that coordinates over 20 scripts, validates documentation, supports reusable snippets, and generates and publishes release files.
type: case-study
status: professional
tocDepth: 3
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
  - Git
---

AI-assisted software development · Docs-as-code 

---

## Overview

**I designed a publishing application that coordinates documentation scripts, validates source and generated content, and produces Markdown and PDF release artifacts through one workflow.**

### Project at a glance

- Over 20 coordinated processing and validation scripts
- Python, Flask, JavaScript, HTML/CSS, Markdown and Git
- Pre- and post-build validation
- Automated application and architecture tests
- Non-destructive source processing
- HTML/PDF previews, Markdown release ZIP generation and API publishing
- Used by the team to generate outputs now published on the documentation site

### Scope and ownership

- **Audience:** Technical writing team members
- **Timeline:** Sept 17-24, 2026
- **My role:**
  - **Architecture:** Defined the architecture, interface boundaries, shared input contract, build sequence and validation requirements.
  - **AI-assisted development:** Used AI to implement portions of the application, then reviewed the resulting behavior and debugged failures.
  - **Quality assurance:** Required automated tests for critical workflows.
  - **Project review and enhancements:** Reviewed the project after its initial implementation and added build-time snippet expansion.

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
- **Build-time content reuse.**
I recognized the need to reuse shared content without duplication and integrated snippet support into the build process. Writers can reference shared Markdown, for example with `{{_snippets/file_name.md}}`. During a build, the publishing process replaces the reference with the content of the file at that path before converting the Markdown to HTML. This applies the DITA principle of “write once, use everywhere.”

This separation proved useful after I shared the application with colleagues. A coworker contributed an updated PDF-generation script, which I substituted for the existing script without changing the UI or disrupting the build workflow. The modular structure also enabled another coworker to cleanly extend the application with API publishing support.

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

### Development and technical ownership

I used Codex to generate portions of the application from the architecture, interfaces and workflow requirements I defined. I reviewed the resulting behavior, tested it against real documentation projects and debugged failures. I also revised or rejected generated behavior when it did not meet the requirements.

After the initial implementation, I reviewed the project and added build-time snippet expansion for shared Markdown content. I also refined validation severity and scope and resolved coordination and PDF formatting defects, including inconsistent parameters and lost line breaks in headings and callouts.

I required automated tests for critical behavior, including script coordination, validation, source preservation, architecture boundaries, and complete PDF and Markdown publication ZIP generation. The project evolved from a command-line starter into a browser application with integrated generation, validation, previews and API publishing.

Initial corruption checks blocked legitimate repeated terminology and Markdown table separators. I changed repeated-text findings to advisory warnings and excluded formatting-only fragments, while retaining blocking checks for stronger corruption indicators.

## Results

- **One workflow instead of over 20 separate scripts.** The builder reduces manual execution and directory switching, while built-in sequencing and validation reduce reliance on writers remembering each publishing step.
- **Produced documentation that is now live.** My teammates and I successfully used the builder to generate publishable outputs that are now available on the documentation site.
- **Adopted, adapted and extended by other writers.** Colleagues provided positive initial feedback and began tailoring the scripts to their own project requirements. The modular structure enabled one coworker to cleanly extend the application with API publishing support.
- **Added reusable content support** I recognized that writers needed to reuse text across topics without copying it. I integrated a build step that replaces references such as `{{_snippets/file_name.md}}` with the referenced file’s content during HTML publishing. Writers can update shared text once and propagate the change to every reuse on the next build.

![Completed build showing successful validation, available HTML/PDF previews, and the generated Markdown publication ZIP.](assets/document-builder-completed-build.png)

GitHub is already used for version control. Enhanced GitHub integration, including batch commits across multiple versions, remains planned.
