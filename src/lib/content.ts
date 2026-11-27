import type { Dish, SiteContent } from './contentSchema';
export type { Page, Dish, Note, StudentPhoto, SiteSettings, SiteContent } from './contentSchema';

export function sortedDishes(dishes: Dish[], status: Dish['status']) {
  return dishes.filter(dish => dish.status === status).sort((a, b) => status === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
}
export function filterDishes(dishes: Dish[], year = 'all', category = 'all') {
  return dishes.filter(dish => (year === 'all' || dish.date.slice(0, 4) === year) && (category === 'all' || dish.category === category));
}
export function formatDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
export function routesFor(content: SiteContent) {
  return ['/', ...Object.keys(content.pages).filter(id => !['home', '404', 'submit', 'instagram', 'notes'].includes(id)).map(id => `/${id}/`), '/notes/', ...content.notes.map(note => `/notes/${note.id}/`), ...content.dishes.map(dish => `/dishes/${dish.id}/`)];
}
