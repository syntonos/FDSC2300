import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles/global.css';
import './styles/components.css';
import './styles/cardstock.css';

const offline = window.__OFFLINE_PREVIEW__ || location.protocol === 'file:';
createRoot(document.getElementById('root')!).render(<StrictMode>{offline
  ? <HashRouter><App /></HashRouter>
  : <BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter>
}</StrictMode>);
