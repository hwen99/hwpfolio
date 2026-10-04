---
id: madcap-flare-to-markdown-migration
title: "Flare-to-Markdown migration: Standardizing the publishing workflow"
summary: Moving documentation to Markdown under a fixed deadline and standardizing the workflow with automated quality checks.
type: case-study
status: professional
tocDepth: 3
audience:
  - Technical writing team members
tools:
  - MadCap Flare
  - Markdown
  - Python
  - Git
  - GitHub
---

Process Improvement · Documentation tooling 

---

## Overview

**I standardized a Flare-to-Markdown migration workflow under a four-week deadline, replacing manual ordering conventions and recurring checks with TOC-driven assembly and Python validation.**

### Project at a glance

- Migration work alongside a major product release
- Document assembly controlled by `toc.md`
- Automated checks for links, page IDs, encoding and variables
- Shared tools, configuration and instructions in GitHub

### Scope and ownership

- **Audience:** Technical writing team members
- **Tools:** MadCap Flare, Markdown, Python, Git/GitHub
- **Timeline:** June 1–22, 2026 (~3 weeks)
- **Starting point:** My manager had completed the initial conversion and folder structure; another writing team had established an early Markdown-to-PDF assembly process.
- **My contribution:**
  - **File conventions:** Standardized file naming and organization.
  - **Document assembly:** Modified the script to use TOC-based ordering.
  - **Validation:** Built Python checks and integrated them into publishing.
  - **Team enablement:** Documented the workflow and shared its tools in GitHub.

## The challenge

At the beginning of June, I learned that my MadCap Flare subscription would expire at the end of the month. Because I had previously proposed migrating the documentation to Markdown, I was asked to complete the migration before the subscription ended.

**The project had two key constraints:**

- **Fixed deadline:** The migration needed to be completed before the Flare subscription expired.
- **Concurrent release work:** I was also writing new documentation for a major product release scheduled for early July.

The initial conversion and PDF work provided a starting point, but the workflow still relied heavily on manual conventions and was not yet reliable enough for ongoing use.

**Key issues included:**

- **Cumbersome content ordering:** PDF order was controlled through numeric filename prefixes, so moving a topic often required renaming multiple files.
- **Broken links and assets:** Links to files and images were frequently broken during migration.
- **Encoding issues:** Mojibake characters appeared in migrated content.
- **Inconsistent table formatting:** Tables did not always convert or render correctly.
- **Broken links in PDF output:** PDF generation combined all Markdown files into a single file before export, but links to content in subfolders were not updated to account for the new file structure.

## My approach

The priority was to make the workflow predictable enough for both the immediate migration and future documentation work.

### Key decisions

- **Separate document order from filenames.** I modified the Markdown-combination script to read a dedicated `toc.md` file. Writers could move, add or remove topics by editing the TOC, without renaming multiple files.
- **Make file conventions consistent across environments.** Lowercase filenames reduced case mismatches when working with Git and Windows. Tool-specific exceptions remained explicit, including the `Templates` directory required by the Templater plugin.
- **Make validation part of publishing.** Python checks identified broken links, missing or duplicate page IDs, encoding problems and improperly converted variables. Integrating them into the workflow made recurring checks repeatable.
- **Package the process for other writers.** A shared GitHub repository brought together scripts, configuration and internal instructions for editing, validation and output generation.

### Validation coverage

The automated checks targeted defects in migrated Markdown. They provided a repeatable way to detect issues; detection alone did not establish that every formatting or PDF-output problem had been corrected.

| Check | Defect identified |
| --- | --- |
| Links | Broken references in migrated content |
| Page IDs | Missing or duplicate identifiers |
| Encoding | Mojibake and other encoding issues |
| Variables | References that had not converted correctly |

## Results

- **A subsequent migration took approximately one week instead of three.** This comparison involved a migration of similar scope.
- **Recurring documentation checks took an estimated 75–90% less time.** Processing and validation scripts reduced manual checking and caught migration issues before publication.
- **Other writers had a repeatable process to follow.** The shared repository and internal instructions made the tools and workflow available for subsequent migrations and ongoing documentation work.

The time figures are approximate workflow observations, not controlled benchmarks.

The migration established scripts and conventions for Markdown publishing. [Document Builder](topic:document-builder) addresses the next stage: coordinating those kinds of processing and validation steps in one application.
