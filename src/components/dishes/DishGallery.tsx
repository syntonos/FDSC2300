import { useId, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import type { StudentPhoto } from '../../lib/content';
import { assetUrl } from '../../lib/assets';

export function DishGallery({ title, gallery }: { title: string; gallery: StudentPhoto[] }) {
  const id = useId();
  const [current, setCurrent] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const count = Math.max(1, gallery.length);
  const active = gallery[current];
  function show(next: number) {
    const index = (next + count) % count;
    setCurrent(index);
    setAnnouncement(`${index + 1} of ${count}: Student work${gallery[index]?.student ? `, ${gallery[index].student}` : ''}`);
  }
  function keydown(event: KeyboardEvent<HTMLDivElement>) {
    const next = event.key === 'ArrowLeft' ? current - 1 : event.key === 'ArrowRight' ? current + 1 : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : null;
    if (next !== null) { event.preventDefault(); show(next); }
  }
  function down(event: PointerEvent<HTMLDivElement>) {
    if (count < 2 || !event.isPrimary || event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    if (start?.id !== event.pointerId) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    if (Math.abs(x) > 15 && Math.abs(x) > Math.abs(y) * 1.2) {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    if (start?.id !== event.pointerId) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y) * 1.2) show(current + (x < 0 ? 1 : -1));
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return <section className="dish-gallery" data-gallery role="region" aria-roledescription="carousel" aria-label={`${title} photos`}>
    <div id={`${id}-slides`} className="gallery-viewport" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { pointer.current = null; }} onLostPointerCapture={event => { if (event.target === event.currentTarget && pointer.current?.id === event.pointerId) pointer.current = null; }}>
      {gallery.length ? gallery.map((photo, index) => <figure key={`${photo.image}-${index}`} className="gallery-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} hidden={index !== current} aria-hidden={index !== current}><img src={assetUrl(photo.image)} alt={photo.alt || `${title} by ${photo.student}`} width={1800} height={1200} loading="lazy" draggable={false} /><figcaption className="gallery-sr-only">Student work — {photo.student}{photo.caption && `. ${photo.caption}`}</figcaption></figure>) : <figure className="gallery-slide" role="group" aria-label="Student photos coming soon"><div className="gallery-placeholder"><svg viewBox="0 0 80 64" fill="none" aria-hidden="true"><rect x="5" y="5" width="70" height="54" rx="1" /><circle cx="55" cy="22" r="6" /><path d="m7 49 21-20 17 16 10-10 18 17" /></svg><p>Photos coming soon.</p></div></figure>}
    </div>
    <div className="gallery-bottom"><div className="gallery-copy"><p className="gallery-label">Student work</p>{active && <p className="gallery-student">{active.student}</p>}{active?.caption && <p className="gallery-description">{active.caption}</p>}</div>{count > 1 && <div className="gallery-controls" onKeyDown={keydown}><span className="gallery-count" aria-hidden="true">{current + 1} / {count}</span><button type="button" aria-label="Previous photo" aria-controls={`${id}-slides`} onClick={() => show(current - 1)}>←</button><button type="button" aria-label="Next photo" aria-controls={`${id}-slides`} onClick={() => show(current + 1)}>→</button></div>}</div>
    <p className="gallery-sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}
