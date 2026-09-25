import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { Marked } from 'marked';

const pages = [
  { source: 'landing-page.md', output: 'index.html', title: 'Hannah Wen', kind: 'home' },
  { source: 'writing.md', output: 'writing.html', title: 'Writing Portfolio', kind: 'writing' },
  { source: 'systems.md', output: 'systems.html', title: 'Systems Portfolio', kind: 'systems' },
];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const slug = value => value.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
await mkdir('_site', { recursive: true });
await cp('assets', '_site/assets', { recursive: true });
await cp('site', '_site/site', { recursive: true });
await writeFile('_site/.nojekyll', '');
for (const page of pages) {
  const ids = new Map();
  const toc = [];
  const markdown = new Marked({ renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const base = slug(text);
      const count = ids.get(base) || 0;
      ids.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      if (depth === 2) {
        const tocClass = page.kind === 'writing' && !['Product Documentation', 'Product Messaging'].includes(text) ? 'toc-child' : 'toc-root';
        toc.push(`<a class="${tocClass}" href="#${id}">${text}</a>`);
      }
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      href = href.replace(/^landing-page\.md(?=#|$)/, 'index.html').replace(/^(writing|systems)\.md(?=#|$)/, '$1.html');
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
    },
  }});
  let source = await readFile(page.source, 'utf8');
  if (page.kind === 'home') {
    source = source.replace(/\| \[Writing\][\s\S]*?(?=\n# About me)/, table => {
      const rows = table.trim().split(/\r?\n/);
      const headings = [...rows[0].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      const descriptions = rows[2].split('|').slice(1, -1).map(cell => cell.trim());
      if (headings.length !== 2 || descriptions.length !== 2) throw new Error('Expected two portfolio columns on the landing page.');
      return `<div class="portfolio-grid">\n${headings.map((heading, index) => `<a class="portfolio-card" href="${escape(heading[2].replace('.md', '.html'))}"><h3>${escape(heading[1])}</h3><p>${markdown.parseInline(descriptions[index])}</p><span class="card-link">${index === 0 ? 'Writing' : 'Systems'} Portfolio <span aria-hidden="true">↗</span></span></a>`).join('\n')}\n</div>\n`;
    });
    source = source.replace(/^# My work/m, '## My work').replace(/^# About me/m, '## About me');
  } else {
    source = source.replace(/^# (Product Documentation|Product Messaging)$/gm, '## $1');
  }
  const content = markdown.parse(source);
  const nav = [['index.html', 'Home'], ['writing.html', 'Writing'], ['systems.html', 'Content Systems']].map(([href, label]) => `<a href="${href}"${href === page.output ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const outline = page.kind === 'home' ? '' : `<aside class="outline"><details open><summary>On this page</summary><nav aria-label="Case studies">${toc.join('')}</nav></details></aside>`;
  await writeFile(`_site/${page.output}`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${page.title} — Technical Writing &amp; Content Systems</title>
<meta name="description" content="Hannah Wen’s portfolio of technical writing, product documentation, and content systems.">
<link rel="stylesheet" href="site/styles.css"></head>
<body class="${page.kind}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><nav aria-label="Main navigation">${nav}</nav></header>
<div class="page-shell">${outline}<main id="main">${content}</main></div>
<footer><span>Hannah Wen</span><div><a href="mailto:wenhannahh@gmail.com">Email</a><a href="https://www.linkedin.com/in/wenhannah/">LinkedIn</a><a href="#main">Back to top ↑</a></div></footer></body></html>`);
}
console.log('Built 3 portfolio pages in _site.');
