import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { Marked } from 'marked';

const collectionsConfig = [
  {
    kind: 'systems',
    label: 'Documentation Systems',
    description: 'Workflows and tools that support documentation.',
    source: 'systems.md',
    output: 'systems.html',
  },
  {
    kind: 'writing',
    label: 'Technical Writing',
    description: 'Guides, customer communications, and product copy, optimized for clarity.',
    source: 'writing.md',
    output: 'writing.html',
  },
];
const pages = [
  { source: 'landing-page.md', output: 'index.html', title: 'Hannah Wen', kind: 'home' },
  ...collectionsConfig.map((collection) => ({
    ...collection,
    title: `${collection.label} Portfolio`,
  })),
];
const portfolioTitle = collectionsConfig.map((collection) => collection.label).join(' & ');
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
const collections = new Map();
const studySummaries = JSON.parse(await readFile('site/study-summaries.json', 'utf8'));
// Stable identifiers keep existing URLs and cross-study links intact when titles change.
const studyTitles = JSON.parse(await readFile('site/study-titles.json', 'utf8'));
for (const page of pages.filter((page) => page.kind !== 'home')) {
  const source = (await readFile(page.source, 'utf8'))
    .replace('{{collectionTitle}}', page.label)
    .replace(/<!--[\s\S]*?-->/g, '');
  const sections = [...source.matchAll(/^(#{1,2}) (.+)$/gm)];
  const studies = [];
  let group = page.label;
  const intro = source.slice(0, sections[1]?.index ?? source.length).trim();
  let overview = `<div class="overview-intro">\n\n${intro}\n\n</div>\n\n`;
  for (let index = 1; index < sections.length; index++) {
    const section = sections[index];
    const end = sections[index + 1]?.index ?? source.length;
    if (section[1] === '#') {
      group = section[2];
      overview += source.slice(section.index, end).replace(/^# /, '## ');
      continue;
    }
    const title = section[2].replaceAll('**', '');
    const id = Object.entries(studyTitles).find(([, name]) => name === title)?.[0] ?? slug(title);
    const body = source.slice(section.index, end).trim();
    const study = {
      title,
      id,
      group,
      output: `${page.kind}-${id}.html`,
      kind: 'study',
      parent: page,
      source: page.source,
      markdown: body.replace(/^(#{2,6}) /gm, (hashes) => hashes.slice(1)),
    };
    study.description = studySummaries[id];
    if (!study.description) throw new Error(`Missing study summary: ${id}`);
    studies.push(study);
    overview += `<a class="study-link" id="${id}" href="${study.output}">
<h6>${escape(title)}</h6>
<small>${escape(study.description)}</small>
</a>\n\n`;
  }
  page.markdown = overview;
  collections.set(page.kind, studies);
}
pages.push(...[...collections.values()].flat());
const studyList = (studies, showCaptions = true) =>
  [...new Set(studies.map((study) => study.group))]
    .map(
      (group) =>
        `<section class="study-group">
<h4>${escape(group)}</h4>
<ul>${studies
          .filter((study) => study.group === group)
          .map(
            (study) =>
              `<li>
<a href="${study.output}">
<span class="study-title">${escape(study.title)}<span aria-hidden="true"> →</span>
</span>${showCaptions ? `<small class="study-caption">${escape(study.description)}</small>` : ''}</a>
</li>`,
          )
          .join('')}</ul>
</section>`,
    )
    .join('');
await mkdir('_site', { recursive: true });
await cp('assets', '_site/assets', { recursive: true });
await cp('site', '_site/site', { recursive: true });
await writeFile('_site/.nojekyll', '');
for (const page of pages) {
  const ids = new Map();
  const toc = [];
  const markdown = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const base = slug(text);
        const count = ids.get(base) || 0;
        ids.set(base, count + 1);
        const id = count ? `${base}-${count}` : base;
        if (depth === 2) toc.push(`<a class="toc-root" href="#${id}">${text}</a>`);
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const related = collections
          .get(page.parent?.kind || page.kind)
          ?.find((study) => href === `#${study.id}`);
        if (related) href = related.output;
        for (const linkedPage of pages) {
          if (href === linkedPage.source || href.startsWith(`${linkedPage.source}#`))
            href = href.replace(linkedPage.source, linkedPage.output);
        }
        return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  let source = page.markdown ?? (await readFile(page.source, 'utf8'));
  if (page.kind === 'home') {
    source = source.replace(
      '{{portfolioCollections}}',
      `<div class="portfolio-grid">\n${collectionsConfig
        .map((collection) => {
          const studies = collections.get(collection.kind);
          return `<details class="portfolio-card">
<summary>
<h3>${escape(collection.label)}</h3>
<p>${markdown.parseInline(collection.description)}</p>
<span class="card-link">
<span>${studies.length} case studies</span>
<span class="expand-icon" aria-hidden="true">+</span>
</span>
</summary>
<div class="card-studies">${studyList(studies, false)}<a class="collection-link" href="${escape(collection.output)}">View ${escape(collection.label)} overview →</a>
</div>
</details>`;
        })
        .join('\n')}\n</div>\n`,
    );
    source = source.replace(/^# My work/m, '## My work').replace(/^# About me/m, '## About me');
  } else {
    source = source.replace(/^# (Product Documentation|Product Messaging)$/gm, '## $1');
  }
  if (page.kind === 'study') source = source.replace(/\r?\n---[ \t]*\r?\n/, '\n');
  const breadcrumb = page.parent
    ? `<nav class="breadcrumb" aria-label="Breadcrumb">
<a href="index.html">Home</a>
<span aria-hidden="true"> / </span>
<a href="${page.parent.output}">${page.parent.label}</a>
</nav>`
    : '';
  const content =
    breadcrumb +
    markdown.parse(source) +
    (page.parent
      ? `<nav class="related-studies" aria-label="More case studies">
<h2>More in ${page.parent.label}</h2>${studyList(collections.get(page.parent.kind).filter((study) => study !== page))}</nav>`
      : '');
  const nav = [
    ['index.html', 'Home'],
    ...collectionsConfig.map((collection) => [collection.output, collection.label]),
  ]
    .map(
      ([href, label]) =>
        `<a href="${href}"${href === page.output ? ' aria-current="page"' : ''}>${label}</a>`,
    )
    .join('');
  const outline =
    page.kind === 'home' || !toc.length
      ? ''
      : `<aside class="outline">
<details open>
<summary>On this page</summary>
<nav aria-label="On this page">${toc.join('')}</nav>
</details>
</aside>`;
  await writeFile(
    `_site/${page.output}`,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${page.title} — ${escape(portfolioTitle)}</title>
<meta name="description" content="Hannah Wen’s portfolio of technical writing, product documentation, and documentation systems.">
<link rel="stylesheet" href="site/styles.css">
<script src="site/lightbox.js" defer></script>
</head>
<body class="${page.kind}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<nav aria-label="Main navigation">${nav}</nav>
</header>
<div class="page-shell">${outline}<main id="main">${content}</main>
</div>
<dialog class="lightbox" aria-label="Expanded image">
<button class="lightbox-close" type="button" aria-label="Close expanded image">×</button>
<img src="" alt="Expanded image">
<p class="lightbox-caption"></p>
</dialog>
<footer>
<span>2026 Hannah Wen</span>
<div>
<a href="mailto:wenhannahh@gmail.com">Email</a>
<a href="https://www.linkedin.com/in/wenhannah/">LinkedIn</a>
<a href="#main">Back to top ↑</a>
</div>
</footer>
</body>
</html>`,
  );
}
console.log(`Built ${pages.length} portfolio pages in _site.`);
