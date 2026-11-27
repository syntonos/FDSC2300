import { Link, useParams } from 'react-router-dom';
import { content } from '../lib/siteContent';
import type { Note } from '../lib/content';
import { usePageMeta } from '../hooks/usePageMeta';
import { Markdown } from '../components/ui/Markdown';
import { NotFoundPage } from './NotFoundPage';

export function NotesPage() {
  const page = content.pages.notes;
  usePageMeta(page.title, page.description);
  const categories = [...new Set(content.notes.map(note => note.category))];
  return <div className="inner-page notes-page"><header className="page-heading"><Link className="breadcrumb" to="/mise-en-place/">← Mise en place</Link><h1>{page.title}<span className="heading-period">.</span></h1>{page.body && <Markdown>{page.body}</Markdown>}</header><div className="notes-index">{categories.map(category => <section key={category}><h2>{category}</h2>{content.notes.filter(note => note.category === category).map(note => <Link className="note-link" to={`/notes/${note.id}/`} key={note.id}><div><h3>{note.title}</h3><p>{note.description}</p></div><span aria-hidden="true">↗</span></Link>)}</section>)}</div></div>;
}
export function NotePage() {
  const { '*': id = '' } = useParams();
  const note = content.notes.find(entry => entry.id === id.replace(/\/$/, ''));
  return note ? <ResolvedNote note={note} /> : <NotFoundPage />;
}
function ResolvedNote({ note }: { note: Note }) {
  usePageMeta(note.title, note.description);
  return <div className="inner-page resource-page"><header className="page-heading"><Link className="breadcrumb" to="/notes/">← Class notes</Link><p className="eyebrow">{note.category}</p><h1>{note.title}<span className="heading-period">.</span></h1><p className="page-description">{note.description}</p></header><div className="resource-layout"><div className="resource-content"><Markdown>{note.body}</Markdown></div></div></div>;
}
