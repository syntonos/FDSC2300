import { useState } from 'react';
import { filterDishes, type Dish } from '../../lib/content';
import { CategorySelect } from '../ui/CategorySelect';
import { DishCard } from './DishCard';

export function DishArchive({ dishes, upcoming = false }: { dishes: Dish[]; upcoming?: boolean }) {
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');
  const years = [...new Set(dishes.map(dish => dish.date.slice(0, 4)))].sort((a, b) => upcoming ? a.localeCompare(b) : b.localeCompare(a));
  const categories = [...new Set(dishes.map(dish => dish.category))].sort();
  const visible = filterDishes(dishes, year, category);
  return <div className="archive" data-archive>
    <div className="archive-filters"><div className="year-filters" role="group" aria-label="Filter dishes by year"><button className={year === 'all' ? 'active' : ''} aria-pressed={year === 'all'} onClick={() => setYear('all')}>All years</button>{years.map(value => <button key={value} className={year === value ? 'active' : ''} aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>)}</div><div className="category-filter"><CategorySelect categories={categories} value={category} onChange={setCategory} /></div></div>
    <p className="archive-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'dish' : 'dishes'}</p>
    {years.map(value => {
      const entries = visible.filter(dish => dish.date.startsWith(value));
      return entries.length ? <section className="year-section" key={value}><div className="year-heading"><h2>{value}</h2></div><div className="dish-grid">{entries.map(dish => <DishCard key={dish.id} dish={dish} />)}</div></section> : null;
    })}
    {!visible.length && <div className="archive-empty"><p>No dishes found.</p><button className="text-link" onClick={() => { setYear('all'); setCategory('all'); }}>Reset filters ↗</button></div>}
  </div>;
}
