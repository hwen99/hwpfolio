import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import { Marked } from 'marked';
import YAML from 'yaml';

const ajv = new Ajv2020({ allErrors: true });
const navigation = JSON.parse(await readFile('content/navigation.json', 'utf8'));
const navigationSchema = JSON.parse(await readFile('content/navigation.schema.json', 'utf8'));
const validateNavigation = ajv.compile(navigationSchema);
if (!validateNavigation(navigation)) {
  const errors = validateNavigation.errors
    .map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ');
  throw new Error(`Invalid content map: ${errors}`);
}
const { collections: collectionsConfig } = navigation;
const pages = [
  { source: 'content/index.md', output: 'index.html', title: 'Hannah Wen', kind: 'home' },
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
const topicSchema = JSON.parse(await readFile('content/topic.schema.json', 'utf8'));
const validateTopicMetadata = ajv.compile(topicSchema);
const requiredSections = {
  'case-study': ['Overview', 'The challenge', 'My approach'],
  'writing-sample': ['Overview'],
};
const readTopic = async (source) => {
  const raw = await readFile(source, 'utf8');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) throw new Error(`${source}: missing YAML frontmatter`);
  const metadata = YAML.parse(frontmatter[1]);
  if (!validateTopicMetadata(metadata)) {
    const errors = validateTopicMetadata.errors
      .map((error) => `${error.instancePath || '/'} ${error.message}`)
      .join('; ');
    throw new Error(`${source}: invalid topic metadata: ${errors}`);
  }
  const body = raw.slice(frontmatter[0].length).trim();
  if (/^# /m.test(body)) throw new Error(`${source}: title must come from frontmatter`);
  const sections = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  for (const section of requiredSections[metadata.type]) {
    if (!sections.includes(section))
      throw new Error(`${source}: missing required section “${section}”`);
  }
  return { metadata, body };
};
const collections = new Map();
const topicsById = new Map();
const topicSources = new Set();
for (const page of pages.filter((page) => page.kind !== 'home')) {
  const intro = (await readFile(page.source, 'utf8')).replace('{{collectionTitle}}', page.label);
  const studies = [];
  let overview = `<div class="overview-intro">\n\n${intro.trim()}\n\n</div>\n\n`;
  for (const group of page.groups) {
    if (page.groups.length > 1) overview += `## ${group.label}\n\n`;
    for (const topicSource of group.topics) {
      if (topicSources.has(topicSource)) throw new Error(`Duplicate topic source: ${topicSource}`);
      topicSources.add(topicSource);
      const { metadata, body } = await readTopic(topicSource);
      if (topicsById.has(metadata.id)) throw new Error(`Duplicate topic ID: ${metadata.id}`);
      const study = {
        title: metadata.title,
        id: metadata.id,
        group: group.label,
        description: metadata.summary,
        metadata,
        output: `${page.kind}-${metadata.id}.html`,
        kind: 'study',
        parent: page,
        source: topicSource,
        markdown: `# ${metadata.title}\n\n${body}`,
      };
      studies.push(study);
      topicsById.set(study.id, study);
      overview += `<a class="study-link" id="${study.id}" href="${study.output}">
<h6>${escape(study.title)}</h6>
<small>${escape(study.description)}</small>
</a>\n\n`;
    }
  }
  page.markdown = overview;
  collections.set(page.kind, studies);
}
const mappedMarkdown = new Set([
  'content/index.md',
  ...collectionsConfig.map((collection) => collection.source),
  ...topicSources,
]);
const contentMarkdown = (await readdir('content', { recursive: true }))
  .filter((file) => file.endsWith('.md'))
  .map((file) => `content/${file}`);
for (const source of contentMarkdown) {
  if (!mappedMarkdown.has(source))
    throw new Error(`Markdown source is not in the content map: ${source}`);
}
pages.push(...[...collections.values()].flat());
const studyList = (studies, showCaptions = true) => {
  const groups = [...new Set(studies.map((study) => study.group))];
  return groups
    .map(
      (group) =>
        `<section class="study-group">
${groups.length > 1 ? `<h4>${escape(group)}</h4>` : ''}
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
};
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
        const tocDepth = page.metadata?.tocDepth ?? 2;
        if (depth >= 2 && depth <= tocDepth) {
          const tocClass = depth === 2 ? 'toc-root' : 'toc-child';
          toc.push(`<a class="${tocClass}" href="#${id}">${text}</a>`);
        }
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        if (href.startsWith('topic:')) {
          const topic = topicsById.get(href.slice('topic:'.length));
          if (!topic) throw new Error(`${page.source}: unknown topic reference ${href}`);
          href = topic.output;
        }
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
  const nav = `<a href="index.html"${page.kind === 'home' ? ' aria-current="page"' : ''}>Home</a>${collectionsConfig
    .map((collection) => {
      const studies = collections.get(collection.kind);
      const current = page.output === collection.output || page.parent?.kind === collection.kind;
      return `<details class="nav-collection"${current ? ' data-current="true"' : ''}>
<summary data-overview="${escape(collection.output)}" title="Click to show case studies; double-click to view the overview">${escape(collection.label)}<span class="nav-chevron" aria-hidden="true"></span></summary>
<div class="nav-dropdown">
${collection.groups
  .map(
    (
      group,
    ) => `${collection.groups.length > 1 ? `<p class="nav-group-label">${escape(group.label)}</p>` : ''}
<ul>${studies
      .filter((study) => study.group === group.label)
      .map(
        (study) =>
          `<li><a href="${escape(study.output)}"${page.output === study.output ? ' aria-current="page"' : ''}>${escape(study.title)}</a></li>`,
      )
      .join('')}</ul>`,
  )
  .join('')}
<a class="nav-overview" href="${escape(collection.output)}"${page.output === collection.output ? ' aria-current="page"' : ''}>View ${escape(collection.label)} overview →</a>
</div>
</details>`;
    })
    .join('')}`;
  const outline =
    page.kind !== 'study' || !toc.length
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
<script>
try {
  const savedTheme = localStorage.getItem('theme');
  document.documentElement.dataset.theme =
    savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme =
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
</script>
<link rel="stylesheet" href="site/styles.css">
<script src="site/theme.js" defer></script>
<script src="site/lightbox.js" defer></script>
<script src="site/navigation.js" defer></script>
</head>
<body class="${page.kind}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
<nav aria-label="Main navigation">${nav}<button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle color theme"><span aria-hidden="true">◐</span></button></nav>
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
<div class="footer-links">
<a href="mailto:wenhannahh@gmail.com">
<span class="link-icon icon-email" aria-hidden="true"></span>
<span>Email</span>
</a>
<a href="https://www.linkedin.com/in/wenhannah/">
<span class="link-icon icon-linkedin" aria-hidden="true"></span>
<span>LinkedIn</span>
</a>
<a href="https://github.com/hwen99/hwpfolio">
<span class="link-icon icon-github" aria-hidden="true"></span>
<span>GitHub</span>
</a>
<a href="#main">
<span class="link-icon icon-arrow-up" aria-hidden="true"></span>
<span>Back to top</span>
</a>
</div>
</footer>
</body>
</html>`,
  );
}
console.log(`Built ${pages.length} portfolio pages in _site.`);
