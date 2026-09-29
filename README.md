# Hannah Wen — Technical Writing & Documentation Systems

This repository contains the source for my portfolio of product documentation, customer communications, and tools that improve documentation workflows.

**[Visit my portfolio →](https://hwen99.github.io/hwpfolio/)**

## Explore my work

- **[Writing Portfolio](https://hwen99.github.io/hwpfolio/writing.html)** — Concept guides, onboarding workflows, and feature documentation for networking and security products, alongside customer communications and product copy.
- **[Systems Portfolio](https://hwen99.github.io/hwpfolio/systems.html)** — Document Builder, a Flare-to-Markdown migration, and an exploratory evaluation of documentation for AI retrieval.

The case studies explain the problem, my contribution, the decisions behind the work, and the results, with documentation samples and planning artifacts.

## The workflow behind this portfolio

The portfolio itself uses a docs-as-code workflow: content is authored in Markdown, versioned in Git, and published through GitHub Actions to GitHub Pages. A shared template keeps presentation separate from content, and automated checks verify local links, section targets, and image alt text before deployment.

To explore the source, start with the [writing case studies](writing.md), [systems case studies](systems.md), or [publishing workflow](.github/workflows/pages.yml).

## Editing and formatting

- Run `npm run dev` and open `http://127.0.0.1:4173` for a local preview. It builds the pages once and serves `site/styles.css` directly: save CSS changes and refresh your browser to see them, with no rebuild or file watcher. Stop the preview with Ctrl+C.
- After Markdown or page-template changes, run `npm run build` in another terminal and refresh, or restart the preview.
- `_site/site/styles.css` is a generated publishing copy; always edit `site/styles.css` instead.
- Edit `site/styles.css` for colors, fonts, spacing, and responsive layouts. Section comments identify the main areas.
- Edit `scripts/build.mjs` for page structure and navigation.
- Edit the Markdown files for page content and `site/study-*.json` for study titles and summaries.
- Run `npm run format` to apply consistent spacing and indentation to the CSS, JavaScript, JSON, and publishing configuration.
- Run `npm run build` and `npm run check` to regenerate and verify the website. Generated files in `_site/` are overwritten by the build.
- Run `npm run format:check` to check formatting without changing files.

## Contact

[Email](mailto:wenhannahh@gmail.com) · [LinkedIn](https://www.linkedin.com/in/wenhannah/)
