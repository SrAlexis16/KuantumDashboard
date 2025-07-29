// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './custom-styles.css';
import App from './App.jsx';

import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- AQUÍ VA BrowserRouter, ENVOLVIENDO TODA LA APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
