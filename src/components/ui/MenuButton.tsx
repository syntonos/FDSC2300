export function MenuButton({ cover = false, open, onOpen }: { cover?: boolean; open: boolean; onOpen: (button: HTMLButtonElement) => void }) {
  return <button className={`menu-toggle${cover ? ' cover-menu-toggle' : ''}`} aria-expanded={open} aria-controls="site-menu" aria-label="Open navigation" onClick={event => onOpen(event.currentTarget)}>
    <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
  </button>;
}
