import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { HomePage } from './pages/HomePage';
import { ContentPage } from './pages/ContentPage';
import { DishPage } from './pages/DishPage';
import { NotePage, NotesPage } from './pages/NotesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return <Routes><Route element={<SiteLayout />}>
    <Route index element={<HomePage />} />
    <Route path="dishes/*" element={<DishPage />} />
    <Route path="notes" element={<NotesPage />} />
    <Route path="notes/*" element={<NotePage />} />
    <Route path=":page" element={<ContentPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>;
}
