import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
const names = (await readdir('_site')).filter((name) => name.endsWith('.html'));
if (names.length !== 11) throw new Error('Expected 3 overview pages and 8 case study pages');
const pages = new Map(
  await Promise.all(names.map(async (name) => [name, await readFile(`_site/${name}`, 'utf8')])),
);
let count = 0;
for (const [name, html] of pages) {
  if (!html.includes('<dialog class="lightbox"') || !html.includes('site/lightbox.js'))
    throw new Error(`${name}: missing image lightbox`);
  if (name === 'index.html' && (html.match(/<details class="portfolio-card">/g) || []).length !== 2)
    throw new Error('Expected two expandable landing-page portfolio cards');
  if ((html.match(/<h1\b/g) || []).length !== 1)
    throw new Error(`${name}: expected one main heading`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`${name}: duplicate IDs`);
  for (const image of html.matchAll(/<img\b[^>]*>/g))
    if (!/alt="[^"]+"/.test(image[0])) throw new Error(`${name}: missing image description`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:)/.test(url)) continue;
    const [file, fragment] = url.split('#');
    const target = file || name;
    await access(path.join('_site', decodeURIComponent(target)));
    if (fragment && pages.has(target) && !pages.get(target).includes(`id="${fragment}"`))
      throw new Error(`${name}: broken section link ${url}`);
    count++;
  }
}
console.log(
  `Verified ${pages.size} pages and ${count} local links, stylesheets, images, and section targets.`,
);
