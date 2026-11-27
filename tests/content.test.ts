import test from 'node:test';
import assert from 'node:assert/strict';
import { createContent, dishSchema, filterDishes, parseMarkdown, routesFor, sortedDishes } from '../src/lib/contentSchema';
import { readContentFiles } from '../scripts/content-files';

const files = await readContentFiles();
const site = createContent(files);
const source = files['content/dishes/2026/citrus-tart.md'];
test('Markdown retains dish metadata and body notes', () => {
  const { data, body } = parseMarkdown(source, dishSchema, 'test.md');
  assert.equal(data.title, 'Citrus tart');
  assert.equal(data.date, '2026-04-16');
  assert.ok(data.skills.includes('Protein Coagulation'));
  assert.deepEqual(data.gallery, []);
  assert.match(body, /## Science/);
});
test('impossible dates fail with the source file name', () => {
  assert.throws(() => parseMarkdown(source.replace('2026-04-16', '2026-02-31'), dishSchema, 'bad-date.md'), /bad-date\.md.*valid YYYY-MM-DD/s);
});
test('student photos require a credit', () => {
  const data = parseMarkdown(source, dishSchema, 'dish.md').data;
  assert.equal(dishSchema.safeParse({ ...data, gallery: [{ image: data.image }] }).success, false);
  assert.equal(dishSchema.safeParse({ ...data, gallery: [{ image: data.image, student: 'Example team', caption: 'A finished plate' }] }).success, true);
});
test('archives separate statuses, order dates, and combine year/category filters', () => {
  const past = sortedDishes(site.dishes, 'past');
  assert.equal(past.length, 6);
  assert.equal(sortedDishes(site.dishes, 'upcoming').length, 2);
  assert.equal(past[0].id, '2026/citrus-tart');
  assert.equal(filterDishes(past, '2025').length, 2);
  assert.equal(filterDishes(past, '2025', 'Vegetables').length, 0);
});
test('new Markdown dishes are discovered and receive routes automatically', () => {
  const added = createContent({ ...files, 'content/dishes/2028/new-dish.md': source.replace('2026-04-16', '2028-04-16') });
  assert.equal(added.dishes.length, site.dishes.length + 1);
  assert.ok(routesFor(added).includes('/dishes/2028/new-dish/'));
});
test('notes are discovered independently and linked by their IDs', () => {
  assert.equal(site.notes.length, 3);
  assert.ok(routesFor(site).includes('/notes/kitchen-essentials/'));
});
