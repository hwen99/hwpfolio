# Portfolio source files

Source files for Hannah Wen’s technical writing and content systems portfolio, built as a GitHub Pages website. Start with [the landing page](landing-page.md).

Portfolio pages are written in Markdown, with screenshots and diagrams stored in the `assets/` folder.

## Editing the portfolio

- `landing-page.md`: introduction, portfolio descriptions, and contact information.
- `writing.md`: writing case studies.
- `systems.md`: content systems case studies.
- `assets/`: screenshots and diagrams. Use descriptive alt text and paths such as `assets/planning-notes.png`.
- `site/styles.css`: shared layout, colors, typography, and mobile styles.
- `scripts/build.mjs`: page template and conversion from Markdown to HTML.

The website presents the landing page’s two portfolio entries as borderless cards. The Markdown table remains readable when browsing the source on GitHub. Navigation, section links, and image paths work under the repository’s `/hwpfolio/` address.

## Build locally

Install Node.js 22 or newer, then run:

```sh
npm ci
npm run build
npm run check
```

Open `_site/index.html` in a browser to preview the result. Generated files are ignored by Git; edit the Markdown and source files instead.

## Publish on GitHub Pages

1. Commit and push the project files to the `main` branch of `hwen99/hwpfolio`.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
3. In **Actions**, run **Publish portfolio** if it has not already run successfully.

The workflow builds the site, checks local links and image descriptions, and publishes only the generated `_site` folder. Later pushes to `main` publish updates automatically. Pull requests build and check without publishing.

Once deployment succeeds, the website address will be https://hwen99.github.io/hwpfolio/.
