// A single React app with offline hash routing and embedded local assets.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const mime = { '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2' };
const assets = {};
const basePath = (process.env.SITE_BASE_PATH || '/').replace(/\/?$/, '/');
const distFile = url => path.join('dist', url.startsWith(basePath) ? url.slice(basePath.length) : url.replace(/^\//, ''));
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes:true })) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (mime[path.extname(file)]) assets['/'+path.relative('dist',file).split(path.sep).join('/')] = `data:${mime[path.extname(file)]};base64,${(await readFile(file)).toString('base64')}`;
  }
}
await collect('dist');
let html = await readFile('dist/index.html','utf8');
for (const match of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]) {
  let css = await readFile(distFile(match[1]),'utf8');
  for (const [url,data] of Object.entries(assets)) if (url.startsWith('/fonts/')) css=css.split(`${basePath}${url.slice(1)}`).join(data);
  html=html.replace(match[0],()=>`<style>${css}</style>`);
}
const runtimeAssets=Object.fromEntries(Object.entries(assets).filter(([url])=>!url.startsWith('/fonts/')));
const bootstrap=`window.__OFFLINE_PREVIEW__=true;window.__PREVIEW_ASSETS__=${JSON.stringify(runtimeAssets).replace(/</g,'\\u003c')};`;
html=html.replace('<body>',()=>`<body><script>${bootstrap}</script>`);
for (const match of [...html.matchAll(/<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/g)]) {
  const js=await readFile(distFile(match[2]),'utf8');
  html=html.replace(match[0],()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
}
html=html.replace(`href="${basePath}favicon.svg"`,`href="${assets['/favicon.svg']}"`);
const output=process.argv[2]||'preview.html';
await writeFile(output,html);
console.log(`Created ${output}: React, Markdown content, fonts, images, and offline routes.`);
