import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { createContent } from './src/lib/contentSchema';
import { readContentFiles } from './scripts/content-files';

// Compile Markdown metadata in Node, not in the visitor's browser.
function markdownContent(): Plugin {
  const name = 'virtual:class-content';
  const resolved = `\0${name}`;
  return {
    name: 'class-markdown-content',
    resolveId(id) { if (id === name) return resolved; },
    async load(id) {
      if (id !== resolved) return;
      const files = await readContentFiles();
      Object.keys(files).forEach(file => this.addWatchFile(path.resolve(file)));
      return `export default ${JSON.stringify(createContent(files))};`;
    },
    configureServer(server) {
      const directory = path.resolve('content');
      server.watcher.add(directory);
      let timer: ReturnType<typeof setTimeout>;
      const changed = (file: string) => {
        const relative = path.relative(directory, file);
        if (relative.startsWith('..') || path.isAbsolute(relative) || !file.endsWith('.md')) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          const module = server.moduleGraph.getModuleById(resolved);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }, 60);
      };
      for (const event of ['add', 'change', 'unlink'] as const) server.watcher.on(event, changed);
      server.httpServer?.once('close', () => {
        clearTimeout(timer);
        for (const event of ['add', 'change', 'unlink'] as const) server.watcher.off(event, changed);
      });
    },
  };
}

export default defineConfig({
  base: process.env.SITE_BASE_PATH || '/',
  plugins: [markdownContent(), react()],
  optimizeDeps: { entries: ['index.html'] },
  build: { rollupOptions: { output: { inlineDynamicImports: true } } },
});
