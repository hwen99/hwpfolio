import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { Marked } from 'marked';

const pages = [
  { source: 'landing-page.md', output: 'index.html', title: 'Hannah Wen', kind: 'home' },
  { source: 'writing.md', output: 'writing.html', title: 'Writing Portfolio', kind: 'writing' },
  { source: 'systems.md', output: 'systems.html', title: 'Systems Portfolio', kind: 'systems' },
];
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
  const source = (await readFile(page.source, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
  const sections = [...source.matchAll(/^(#{1,2}) (.+)$/gm)];
  const studies = [];
  let group = page.kind === 'writing' ? 'Writing' : 'Documentation Systems';
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
        if (depth === 2) {
          const tocClass =
            page.kind === 'writing' &&
            !['Product Documentation', 'Product Messaging'].includes(text)
              ? 'toc-child'
              : 'toc-root';
          toc.push(`<a class="${tocClass}" href="#${id}">${text}</a>`);
        }
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const related = collections
          .get(page.parent?.kind || page.kind)
          ?.find((study) => href === `#${study.id}`);
        if (related) href = related.output;
        href = href
          .replace(/^landing-page\.md(?=#|$)/, 'index.html')
          .replace(/^(writing|systems)\.md(?=#|$)/, '$1.html');
        return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  let source = page.markdown ?? (await readFile(page.source, 'utf8'));
  if (page.kind === 'home') {
    source = source.replace(/\| \[Writing\][\s\S]*?(?=\n# About me)/, (table) => {
      const rows = table.trim().split(/\r?\n/);
      const headings = [...rows[0].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      const descriptions = rows[2]
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (headings.length !== 2 || descriptions.length !== 2)
        throw new Error('Expected two portfolio columns on the landing page.');
      return `<div class="portfolio-grid">\n${headings
        .map((heading, index) => {
          const studies = collections.get(index === 0 ? 'writing' : 'systems');
          return `<details class="portfolio-card">
<summary>
<h3>${escape(heading[1])}</h3>
<p>${markdown.parseInline(descriptions[index])}</p>
<span class="card-link">
<span>${studies.length} case studies</span>
<span class="expand-icon" aria-hidden="true">+</span>
</span>
</summary>
<div class="card-studies">${studyList(studies, false)}<a class="collection-link" href="${escape(heading[2].replace('.md', '.html'))}">View ${escape(heading[1])} overview →</a>
</div>
</details>`;
        })
        .join('\n')}\n</div>\n`;
    });
    source = source.replace(/^# My work/m, '## My work').replace(/^# About me/m, '## About me');
  } else {
    source = source.replace(/^# (Product Documentation|Product Messaging)$/gm, '## $1');
  }
  if (page.kind === 'study') source = source.replace(/\r?\n---[ \t]*\r?\n/, '\n');
  const breadcrumb = page.parent
    ? `<nav class="breadcrumb" aria-label="Breadcrumb">
<a href="index.html">Home</a>
<span aria-hidden="true"> / </span>
<a href="${page.parent.output}">${page.parent.kind === 'writing' ? 'Writing' : 'Documentation Systems'}</a>
</nav>`
    : '';
  const content =
    breadcrumb +
    markdown.parse(source) +
    (page.parent
      ? `<nav class="related-studies" aria-label="More case studies">
<h2>More in ${page.parent.kind === 'writing' ? 'Writing' : 'Documentation Systems'}</h2>${studyList(collections.get(page.parent.kind).filter((study) => study !== page))}</nav>`
      : '');
  const nav = [
    ['index.html', 'Home'],
    ['writing.html', 'Writing'],
    ['systems.html', 'Documentation Systems'],
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
<title>${page.title} — Technical Writing &amp; Documentation Systems</title>
<meta name="description" content="Hannah Wen’s portfolio of technical writing, product documentation, and documentation systems.">
<link rel="stylesheet" href="site/styles.css">
</head>
<body class="${page.kind}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<nav aria-label="Main navigation">${nav}</nav>
</header>
<div class="page-shell">${outline}<main id="main">${content}</main>
</div>
<footer>
<span>Hannah Wen</span>
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
