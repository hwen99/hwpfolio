---
id: madcap-flare-to-markdown-migration
title: "Flare-to-Markdown migration: Standardizing the publishing workflow"
summary: Moving documentation to Markdown under a fixed deadline and standardizing the workflow with automated quality checks.
type: case-study
status: professional
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

- **Deliverable:** Documentation migration and standardized publishing workflow
- **Audience:** Technical writing team members
- **Tools:** MadCap Flare, Markdown, Python, Git/GitHub
- **Timeline:** June 1, 2026 –June 28, 2026

This project demonstrates how I approach documentation systems: identify recurring friction, turn informal conventions into repeatable workflows, and automate quality checks where manual review does not scale.

## The challenge

At the beginning of June, I learned that my MadCap Flare subscription would expire at the end of the month. Because I had previously proposed migrating the documentation to Markdown, I was asked to complete the migration before the subscription ended.

**The project had two key constraints:**

- **Fixed deadline:** The migration needed to be completed before the Flare subscription expired.
- **Concurrent release work:** I was also writing new documentation for a major product release scheduled for early July.

**What I inherited:**

- My manager had completed an initial Flare-to-Markdown conversion and created a basic folder structure and migration workflow.
- Another writing team had experimented with PDF generation and established an initial process for combining Markdown files into a single PDF source.

These efforts provided a useful starting point, but the workflow still relied heavily on manual conventions and was not yet reliable enough for ongoing use.

**Key issues included:**

- **Cumbersome content ordering:** PDF order was controlled through numeric filename prefixes, so moving a topic often required renaming multiple files.
- **Broken links and assets:** Links to files and images were frequently broken during migration.
- **Encoding issues:** Mojibake characters appeared in migrated content.
- **Inconsistent table formatting:** Tables did not always convert or render correctly.
- **Broken links in PDF output:** PDF generation combined all Markdown files into a single file before export, but links to content in subfolders were not updated to account for the new file structure.

## My approach

I enacted the following:

- **Standardized file organization and naming.** Defined conventions for Markdown files and project folders. Filenames were standardized to lowercase to avoid case inconsistencies between Git and Windows, with exceptions where required by tooling, such as the `Templates` directory used by the Templater plugin.
- **Improved document assembly.** Modified the Markdown-combination script to determine document order from a dedicated `toc.md` file instead of numeric filename prefixes. Topics could then be moved, added, or removed by editing the TOC rather than renaming files.
- **Added automated validation.** Built Python checks for broken links, duplicate or missing page IDs, mojibake and encoding issues, and improperly converted variables. Added these checks to the publishing workflow.
- **Standardized the workflow.** Defined a consistent process for editing, validation, and output generation. Created internal documentation and a shared GitHub repository containing the tools, configuration, and instructions for other writers.

## Results

A subsequent migration of similar scope took approximately one week instead of three.

The processing and validation scripts also reduced the time required for recurring documentation checks by an estimated **75–90%** and caught migration issues before publication. This project demonstrates how I approach documentation systems: identify recurring friction, turn informal conventions into repeatable workflows, and automate quality checks where manual review does not scale.

The result was a more reliable process that was easier to use for subsequent migrations and ongoing documentation work.
