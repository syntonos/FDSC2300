import { parse } from 'yaml';
import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, 'Use a valid YYYY-MM-DD date');
const image = z.string().startsWith('/images/');

export const pageSchema = z.object({
  title: z.string().min(1), description: z.string(),
  heroFirst: z.string().optional(), heroSecond: z.string().optional(),
  heroEyebrow: z.string().optional(), heroImage: image.optional(),
  aboutImage: image.optional(), aboutImageAlt: z.string().optional(),
  introTitle: z.string().optional(), featuredTitle: z.string().optional(),
  nextTitle: z.string().optional(), scrollLabel: z.string().optional(),
  dividerWords: z.array(z.string()).optional(), externalUrl: z.string().url().optional(),
});
export const studentPhotoSchema = z.object({
  image, student: z.string().min(1), caption: z.string().optional(), alt: z.string().optional(),
});
export const dishSchema = z.object({
  title: z.string().min(1), date, status: z.enum(['past', 'upcoming']),
  category: z.string().min(1), image, imageAlt: z.string().min(1),
  imageInset: z.number().min(0).max(20).default(0), description: z.string(),
  technique: z.string(), skills: z.array(z.string().min(1)).default([]),
  gallery: z.array(studentPhotoSchema).default([]), duration: z.string(), team: z.string(),
  ingredients: z.array(z.string().min(1)).default([]),
});
export const noteSchema = z.object({
  title: z.string().min(1), description: z.string(), category: z.string().min(1),
  order: z.number().default(0), updated: date.optional(),
});
export const settingsSchema = z.object({
  institution: z.string(), course: z.string(), subtitle: z.string(),
  address: z.array(z.string()),
  contacts: z.array(z.object({ name: z.string(), email: z.string().email() })).default([]),
});
export type Entry<T> = T & { id: string; body: string };
export type Page = Entry<z.infer<typeof pageSchema>>;
export type Dish = Entry<z.infer<typeof dishSchema>>;
export type Note = Entry<z.infer<typeof noteSchema>>;
export type StudentPhoto = z.infer<typeof studentPhotoSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;
export interface SiteContent { pages: Record<string, Page>; dishes: Dish[]; notes: Note[]; settings: SiteSettings; }

export function parseMarkdown<T extends z.ZodTypeAny>(raw: string, schema: T, source: string): { data: z.infer<T>; body: string } {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`${source}: Markdown must begin with YAML frontmatter`);
  try { return { data: schema.parse(parse(match[1])), body: match[2].trim() }; }
  catch (error) { throw new Error(`${source}: ${error instanceof Error ? error.message : String(error)}`); }
}

export function collectEntries<T extends z.ZodTypeAny>(files: Record<string, string>, schema: T, collection: string): Entry<z.infer<T>>[] {
  const seen = new Set<string>();
  return Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([file, raw]) => {
    const id = file.replaceAll('\\', '/').split(`content/${collection}/`).pop()!.replace(/\.md$/, '');
    if (seen.has(id)) throw new Error(`Duplicate ${collection} ID: ${id}`);
    seen.add(id);
    const { data, body } = parseMarkdown(raw, schema, file);
    return { ...data, id, body };
  });
}

export function createContent(files: Record<string, string>): SiteContent {
  const group = (name: string) => Object.fromEntries(Object.entries(files).filter(([file]) => file.replaceAll('\\', '/').includes(`content/${name}/`)));
  const pages = Object.fromEntries(collectEntries(group('pages'), pageSchema, 'pages').map(page => [page.id, page]));
  for (const required of ['home', 'mise-en-place', 'menu', 'past-dishes', 'notes', '404', 'submit', 'instagram']) {
    if (!pages[required]) throw new Error(`Missing content/pages/${required}.md`);
  }
  const settingsFile = Object.entries(group('settings')).find(([file]) => file.endsWith('/site.md'));
  if (!settingsFile) throw new Error('Missing content/settings/site.md');
  return {
    pages,
    dishes: collectEntries(group('dishes'), dishSchema, 'dishes'),
    notes: collectEntries(group('notes'), noteSchema, 'notes').sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    settings: parseMarkdown(settingsFile[1], settingsSchema, settingsFile[0]).data,
  };
}


export { sortedDishes, filterDishes, formatDate, routesFor } from './content';
