import { Link } from 'react-router-dom';
import type { Dish } from '../../lib/content';
import { FoodImage } from '../ui/FoodImage';
import { SkillLine } from '../ui/SkillLine';

export function DishCard({ dish }: { dish: Dish }) {
  return <article className="dish-card" data-category={dish.category}>
    <Link className="dish-image-link" to={`/dishes/${dish.id}/`} aria-label={`Read ${dish.title}`}><FoodImage image={dish.image} alt={dish.imageAlt} inset={dish.imageInset} /><span className="image-arrow" aria-hidden="true">↗</span></Link>
    <div className="dish-card-meta"><span>{dish.category}</span><span>{dish.date.slice(0, 4)}</span></div>
    <h3><Link to={`/dishes/${dish.id}/`}>{dish.title}</Link></h3>
    <SkillLine skills={dish.skills} technique={dish.technique} />
  </article>;
}
