import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createContent, routesFor } from '../src/lib/contentSchema';
import { readContentFiles } from './content-files';

const routes = routesFor(createContent(await readContentFiles()));
const html = await readFile('dist/index.html', 'utf8');
for (const route of routes.filter(route => route !== '/')) {
  const directory = path.join('dist', route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
await writeFile('dist/404.html', html);
console.log(`Prepared ${routes.length} direct-entry React routes and 404.html.`);
