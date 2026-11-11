import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './components/I18nProvider';
import { ThemeProvider } from './components/ThemeProvider';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
