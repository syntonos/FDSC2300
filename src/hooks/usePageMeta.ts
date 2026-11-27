import { useEffect } from 'react';
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — FDSC 2300`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
