import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from '@/Pages/Home';
import './index.css';

// Service worker registration (PWA) - dynamic import to avoid top-level await
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {
      // plugin not available in this environment — ignore
    });
}

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'));
container.id = 'root';
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
