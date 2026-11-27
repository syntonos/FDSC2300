import { Link, useParams } from 'react-router-dom';
import { content } from '../lib/siteContent';
import { sortedDishes } from '../lib/content';
import { usePageMeta } from '../hooks/usePageMeta';
import { Markdown } from '../components/ui/Markdown';
import { DishArchive } from '../components/dishes/DishArchive';
import { NotFoundPage } from './NotFoundPage';

export function ContentPage() {
  const { page: id = '' } = useParams();
  const page = content.pages[id];
  if (!page || ['home', 'submit', 'instagram', '404'].includes(id)) return <NotFoundPage />;
  return <ResolvedPage id={id} />;
}
function ResolvedPage({ id }: { id: string }) {
  const page = content.pages[id];
  const archive = id === 'past-dishes' || id === 'menu';
  const upcoming = id === 'menu';
  usePageMeta(page.title, page.description);
  return <div className={`inner-page${archive ? '' : ' resource-page'}`}>
    <header className="page-heading"><Link className="breadcrumb" to="/">← Home</Link><h1>{page.title}<span className="heading-period">.</span></h1>{!archive && <p className="page-description">{page.description}</p>}</header>
    {archive ? <DishArchive key={id} dishes={sortedDishes(content.dishes, upcoming ? 'upcoming' : 'past')} upcoming={upcoming} /> : <div className="resource-layout"><div className="resource-content"><Markdown>{page.body}</Markdown></div></div>}
  </div>;
}
