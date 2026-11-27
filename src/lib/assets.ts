export function assetUrl(path: string) {
  const embedded = window.__PREVIEW_ASSETS__?.[path];
  if (embedded) return embedded;
  return path.startsWith('/') && !path.startsWith('//')
    ? `${import.meta.env.BASE_URL}${path.slice(1)}`
    : path;
}
