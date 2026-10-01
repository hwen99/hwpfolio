# Hannah Wen — Technical Writing & Documentation Systems

This repository contains the source for my portfolio of product documentation, customer communications, and tools that improve documentation workflows.

**[Visit my portfolio →](https://hwen99.github.io/hwpfolio/)**

## Explore my work

- **[Systems Portfolio](https://hwen99.github.io/hwpfolio/systems.html)** — Document Builder, a Flare-to-Markdown migration, and an exploratory evaluation of documentation for AI retrieval.
- **[Technical Writing Portfolio](https://hwen99.github.io/hwpfolio/writing.html)** — Concept guides, onboarding workflows, and feature documentation for networking and security products, alongside customer communications and product copy.

The case studies explain the problem, my contribution, the decisions behind the work, and the results, with documentation samples and planning artifacts.

## The workflow behind this portfolio

The portfolio itself uses a docs-as-code workflow: content is authored in Markdown, versioned in Git, and published through GitHub Actions to GitHub Pages. A shared template keeps presentation separate from content, and automated checks verify local links, section targets, and image alt text before deployment.

To explore the source, start with the [content map](content/navigation.json), the [technical writing topics](content/technical-writing), the [documentation systems topics](content/documentation-systems), or the [publishing workflow](.github/workflows/pages.yml).

The content architecture draws on DITA's topic-based authoring principles. Each case study is an independent Markdown topic with typed, schema-validated metadata; the content map defines collection order and hierarchy; and stable `topic:` references decouple cross-links from file paths and headings.

## Editing and formatting

- Run `npm run dev` and open `http://127.0.0.1:4173` for a local preview. It builds the pages once and serves `site/styles.css` directly: save CSS changes and refresh your browser to see them, with no rebuild or file watcher. Stop the preview with Ctrl+C.
- After Markdown or page-template changes, run `npm run build` in another terminal and refresh, or restart the preview.
- `_site/site/styles.css` is a generated publishing copy; always edit `site/styles.css` instead.
- Edit `site/styles.css` for colors, fonts, spacing, and responsive layouts. Section comments identify the main areas.
- Edit `scripts/build.mjs` for page structure and navigation.
- Edit `content/index.md` for the homepage, collection `index.md` files for overview introductions, and individual topic files for case studies.
- Edit `content/navigation.json` to reorder topics or change the collection hierarchy. Topic titles, summaries, IDs, audiences, tools, and project types belong in each topic’s YAML frontmatter and are validated against `content/topic.schema.json` during every build.
- Run `npm run format` to apply consistent spacing and indentation to the CSS, JavaScript, JSON, and publishing configuration.
- Run `npm run build` and `npm run check` to regenerate and verify the website. Generated files in `_site/` are overwritten by the build.
- Run `npm run format:check` to check formatting without changing files.

## Contact

[Email](mailto:wenhannahh@gmail.com) · [LinkedIn](https://www.linkedin.com/in/wenhannah/)
