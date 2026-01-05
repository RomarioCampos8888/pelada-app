import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from '@/Pages/Home';
import './index.css';

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'));
container.id = 'root';
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
