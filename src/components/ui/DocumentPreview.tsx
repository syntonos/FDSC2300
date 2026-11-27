import { useId, useState, type ReactNode } from 'react';
import { assetUrl } from '../../lib/assets';

export function documentPreviewSource(href: string) {
  const url = URL.parse(href, window.location.href);
  if (!url || !['http:', 'https:', 'file:'].includes(url.protocol)) return;

  if (url.origin === 'https://docs.google.com') {
    const presentation = url.pathname.match(/^\/presentation\/(?:u\/\d+\/)?(d\/(?:e\/)?[\w-]+)(?:\/|$)/)?.[1];
    if (presentation) return `https://docs.google.com/presentation/${presentation}/embed`;
  }

  if (/\.pdf$/i.test(url.pathname)) return assetUrl(href);
  if (/\.pptx?$/i.test(url.pathname)) {
    const file = new URL(assetUrl(href), window.location.href);
    if (file.protocol === 'https:') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.href)}`;
    }
  }
}

export function DocumentPreview({ href, source, children }: { href: string; source: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const viewerId = useId();

  return <span className="document-preview">
    <a href={assetUrl(href)} target="_blank" rel="noopener noreferrer">{children}</a>
    <button type="button" aria-expanded={open} aria-controls={viewerId} onClick={() => setOpen(!open)}>
      {open ? 'Hide preview' : 'Preview here'}
    </button>
    <span id={viewerId} hidden={!open}>
      {open && <iframe src={source} title="Course document preview" allowFullScreen referrerPolicy="no-referrer" />}
    </span>
  </span>;
}
