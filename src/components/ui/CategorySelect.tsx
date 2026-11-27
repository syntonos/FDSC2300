import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type CSSProperties } from 'react';

export function CategorySelect({ categories, value, onChange }: { categories: string[]; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const choices = [{ value: 'all', label: 'All categories' }, ...categories.map(category => ({ value: category, label: category }))];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({ above: false, room: 280 });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const search = useRef('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const label = choices.find(choice => choice.value === value)?.label || 'All categories';

  function close(focus = false) { setOpen(false); if (focus) trigger.current?.focus({ preventScroll: true }); }
  function show(index = choices.findIndex(choice => choice.value === value)) { setActive(Math.max(0, index)); setOpen(true); }
  function choose(next: string) { onChange(next); close(true); }
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current!.getBoundingClientRect();
      const below = innerHeight - rect.bottom - 24, above = rect.top - 24;
      const up = below < 150 && above > below;
      setPlacement({ above: up, room: Math.max(80, Math.min(280, up ? above : below)) });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    const option = options.current[active];
    option?.focus({ preventScroll: true });
    if (option && list.current) {
      if (option.offsetTop < list.current.scrollTop) list.current.scrollTop = option.offsetTop;
      if (option.offsetTop + option.offsetHeight > list.current.scrollTop + list.current.clientHeight) list.current.scrollTop = option.offsetTop + option.offsetHeight - list.current.clientHeight;
    }
  }, [open, active]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => () => clearTimeout(searchTimer.current), []);
  function optionKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setActive(event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : Math.max(0, Math.min(choices.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key === 'Escape') { event.preventDefault(); close(true); }
    else if (event.key === 'Tab') requestAnimationFrame(() => setOpen(false));
    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); search.current += event.key.toLowerCase();
      clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => { search.current = ''; }, 600);
      const match = choices.findIndex(choice => choice.label.toLowerCase().startsWith(search.current));
      if (match >= 0) setActive(match);
    }
  }
  return <div ref={root} className="category-picker" data-category-picker data-placement={placement.above ? 'above' : 'below'} style={{ '--category-room': `${placement.room}px` } as CSSProperties}>
    <button ref={trigger} type="button" className="category-trigger" aria-label="Filter dishes by category" aria-describedby={`${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={id} onClick={() => open ? close() : show()} onKeyDown={event => {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); show(event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : undefined); }
      if (event.key === 'Escape') close(true);
    }}><span id={`${id}-value`}>{label}</span><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></button>
    <div ref={list} id={id} className="category-options" role="listbox" aria-label="Dish categories" hidden={!open}>
      {choices.map((choice, index) => <button key={choice.value} ref={element => { options.current[index] = element; }} type="button" className="category-option" role="option" tabIndex={-1} aria-selected={choice.value === value} onClick={() => choose(choice.value)} onKeyDown={event => optionKey(event, index)}><span>{choice.label}</span><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8 3 3 6-6" /></svg></button>)}
    </div>
  </div>;
}
