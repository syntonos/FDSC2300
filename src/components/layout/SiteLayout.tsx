import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { content } from '../../lib/siteContent';
import { assetUrl } from '../../lib/assets';
import { MenuButton } from '../ui/MenuButton';
import { useScrollEffects } from '../../hooks/useScrollEffects';

const MenuContext = createContext<{ open: boolean; openMenu: (button: HTMLButtonElement) => void }>({ open: false, openMenu: () => {} });
export const useMenu = () => useContext(MenuContext);

const links = [
  { title: 'mise en place', href: '/mise-en-place/' },
  { title: 'past dishes', href: '/past-dishes/' },
  { title: 'menu', href: '/menu/' },
  { title: 'submit', href: content.pages.submit.externalUrl || 'https://docs.google.com/forms/' },
  { title: 'instagram', href: content.pages.instagram.externalUrl || 'https://www.instagram.com/' },
];
function NavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  return href.startsWith('https://') ? <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>{children}</a> : <Link to={href} onClick={onClick}>{children}</Link>;
}

export function SiteLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(!isHome);
  const header = useRef<HTMLElement>(null);
  const main = useRef<HTMLElement>(null);
  const footer = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const settings = content.settings;
  const openMenu = useCallback((button: HTMLButtonElement) => { trigger.current = button; setOpen(true); }, []);
  const closeMenu = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setHeaderVisible(!isHome);
  }, [location.pathname, isHome]);
  useScrollEffects(location.pathname);

  useEffect(() => {
    if (!isHome) { setHeaderVisible(true); return; }
    const cover = document.querySelector('.hero-cover');
    if (!cover) return;
    const observer = new IntersectionObserver(([entry]) => setHeaderVisible(!entry.isIntersecting));
    observer.observe(cover);
    return () => observer.disconnect();
  }, [isHome]);

  useLayoutEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (header.current) header.current.inert = open || (isHome && !headerVisible);
    if (main.current) main.current.inert = open;
    if (footer.current) footer.current.inert = open;
    if (panel.current) panel.current.inert = !open;
    if (open) {
      panel.current?.getBoundingClientRect();
      closeButton.current?.focus({ preventScroll: true });
    } else if (trigger.current?.isConnected && !trigger.current.closest('[inert]')) {
      trigger.current.focus({ preventScroll: true });
    }
    return () => document.body.classList.remove('menu-open');
  }, [open, isHome, headerVisible]);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
      if (event.key === 'Tab') {
        const elements = [...panel.current!.querySelectorAll<HTMLElement>('a, button')];
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [open, closeMenu]);

  return <MenuContext.Provider value={{ open, openMenu }}>
    <a href="#main" className="skip-link" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header ref={header} className={`site-header${isHome ? ' cover-header' : ''}${headerVisible ? ' is-visible' : ''}`}>
      <MenuButton open={open} onOpen={openMenu} />
      <Link className="wordmark" to="/" aria-label="FDSC 2300 home">FDSC <span>2300</span><small>CULINARY SCIENCE</small></Link>
      <svg className="header-logo-filter" width="0" height="0" aria-hidden="true">
        <filter id="cals-ink" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 1 0" result="lettering" />
          <feFlood floodColor="currentColor" />
          <feComposite in2="lettering" operator="in" />
        </filter>
      </svg>
      <Link className="header-cals" to="/" aria-label="Cornell CALS home"><img src="https://cals.cornell.edu/sites/default/files/2019-08/horizontal-wordmark_color-web.png" alt="Cornell CALS" /></Link>
    </header>
    <div className="menu-backdrop" aria-hidden="true" onClick={closeMenu} />
    <aside ref={panel} id="site-menu" className="site-menu" aria-label="Main navigation">
      <div className="menu-top"><button ref={closeButton} className="menu-close" aria-label="Close navigation" onClick={closeMenu}>✕</button><Link to="/" onClick={closeMenu}>{settings.course}</Link></div>
      <nav>{links.map((link, index) => <NavLink key={link.title} href={link.href} onClick={closeMenu}><small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small><span>{link.title}</span></NavLink>)}</nav>
      <div className="menu-bottom"><div className="menu-university"><a className="cornell-logo" href="https://www.cornell.edu/" target="_blank" rel="noopener noreferrer"><img src={assetUrl('/images/brand/cornell-university-white.svg')} alt={settings.institution} width={245} height={62} /></a><p>{settings.address.map(line => <span key={line}>{line}<br /></span>)}</p></div><p className="menu-contacts">contact<br />{settings.contacts.map(contact => <span key={contact.email}><a href={`mailto:${contact.email}`}>{contact.email}</a><br /></span>)}</p></div>
    </aside>
    <main ref={main} id="main" tabIndex={-1}><Outlet /></main>
    <footer ref={footer} className="site-footer"><div className="footer-bottom"><Link className="footer-brand" to="/">{settings.course}<small>{settings.institution.toUpperCase()}</small></Link><nav aria-label="Footer navigation">{links.map(link => <NavLink key={link.title} href={link.href}>{link.title}</NavLink>)}</nav></div></footer>
  </MenuContext.Provider>;
}
