import { Link, useParams } from 'react-router-dom';
import { content } from '../lib/siteContent';
import { formatDate, type Dish } from '../lib/content';
import { usePageMeta } from '../hooks/usePageMeta';
import { Markdown } from '../components/ui/Markdown';
import { FoodImage } from '../components/ui/FoodImage';
import { SkillLine } from '../components/ui/SkillLine';
import { DishCard } from '../components/dishes/DishCard';
import { DishGallery } from '../components/dishes/DishGallery';
import { NotFoundPage } from './NotFoundPage';

export function DishPage() {
  const { '*': id = '' } = useParams();
  const dish = content.dishes.find(entry => entry.id === id.replace(/\/$/, ''));
  return dish ? <ResolvedDish key={dish.id} dish={dish} /> : <NotFoundPage />;
}
function ResolvedDish({ dish }: { dish: Dish }) {
  usePageMeta(dish.title, dish.description);
  const back = dish.status === 'past' ? '/past-dishes/' : '/menu/';
  const related = content.dishes.filter(other => other.id !== dish.id && other.status === dish.status).slice(0, 3);
  return <>
    <article className="dish-detail"><div className="dish-detail-heading"><Link className="breadcrumb" to={back}>← {dish.status === 'past' ? 'Past dishes' : 'Menu'}</Link><p className="eyebrow">{dish.category} <span> / </span> {formatDate(dish.date)}</p><h1>{dish.title}</h1><p>{dish.description}</p><SkillLine skills={dish.skills} technique={dish.technique} /></div>
      <div className="detail-image dish-food-hero"><FoodImage image={dish.image} alt={dish.imageAlt} inset={dish.imageInset} loading="eager" priority /></div>
      <div className="dish-story"><aside><dl><dt>Technique</dt><dd>{dish.technique}</dd><dt>Time</dt><dd>{dish.duration}</dd></dl></aside><Markdown>{dish.body}</Markdown></div>
    </article>
    {related.length > 0 && <section className="related-section section-pad"><div className="section-heading"><h2>More dishes.</h2><Link className="text-link" to={back}>View all ↗</Link></div><div className="dish-grid">{related.map(other => <DishCard key={other.id} dish={other} />)}</div></section>}
    <section className="student-work-section"><h2>Student work.</h2><DishGallery key={dish.id} title={dish.title} gallery={dish.gallery} /></section>
  </>;
}
