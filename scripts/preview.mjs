import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

await import('./build.mjs');

const host = '127.0.0.1';
const port = Number.parseInt(process.env.PORT || '4173', 10);
const outputRoot = path.resolve('_site');
const sourceSiteRoot = path.resolve('site');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const resolveRequest = (pathname) => {
  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const servesSourceSite = requestPath.startsWith('/site/');
  const root = servesSourceSite ? sourceSiteRoot : outputRoot;
  const relativePath = servesSourceSite ? requestPath.slice('/site/'.length) : requestPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) return null;
  return filePath;
};

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    const filePath = resolveRequest(pathname);
    if (!filePath || !(await stat(filePath)).isFile())
      throw Object.assign(new Error(), { code: 'ENOENT' });

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type':
        contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
});

server.listen(port, host, () => {
  console.log(`Preview available at http://${host}:${port}`);
  console.log('Rebuild Markdown changes with npm run build, then refresh the browser.');
});
