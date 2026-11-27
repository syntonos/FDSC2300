/// <reference types="vite/client" />

declare module 'virtual:class-content' {
  const content: import('./lib/content').SiteContent;
  export default content;
}

interface Window {
  __OFFLINE_PREVIEW__?: boolean;
  __PREVIEW_ASSETS__?: Record<string, string>;
}
