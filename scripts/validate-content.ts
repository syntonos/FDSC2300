import { access } from 'node:fs/promises';
import path from 'node:path';
import { createContent, routesFor } from '../src/lib/contentSchema';
import { readContentFiles } from './content-files';

const files = await readContentFiles();
const site = createContent(files);
const images = new Set<string>();
for (const page of Object.values(site.pages)) {
  if (page.heroImage) images.add(page.heroImage);
  if (page.aboutImage) images.add(page.aboutImage);
}
for (const dish of site.dishes) {
  images.add(dish.image);
  dish.gallery.forEach(photo => images.add(photo.image));
}
for (const raw of Object.values(files)) {
  for (const match of raw.matchAll(/!\[[^\]]*\]\((\/images\/[^\s)]+)(?:\s+[^)]*)?\)/g)) images.add(match[1]);
}
for (const image of images) {
  const relative = image.slice(1);
  if (relative.split('/').includes('..')) throw new Error(`Image path must stay in public/: ${image}`);
  try { await access(path.join('public', relative)); }
  catch { throw new Error(`Missing image: public/${relative}`); }
}
const routes = routesFor(site);
if (new Set(routes).size !== routes.length) throw new Error('Content creates conflicting routes');
console.log(`Validated ${Object.keys(site.pages).length} pages, ${site.dishes.length} dishes, ${site.notes.length} notes, and ${images.size} image references.`);
