import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export async function readContentFiles(directory = 'content'): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(result, await readContentFiles(file));
    else if (entry.name.endsWith('.md')) result[file.replaceAll(path.sep, '/')] = await readFile(file, 'utf8');
  }
  return result;
}
