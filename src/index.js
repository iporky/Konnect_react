import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Suppress benign Chrome ResizeObserver loop errors caused by autosizing components
if (typeof window !== 'undefined') {
  const resizeObserverErrHandler = (e) => {
    if (e?.message && e.message.indexOf('ResizeObserver loop completed') > -1) {
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener('error', resizeObserverErrHandler);
  // Filter console.error noise for ResizeObserver warnings
  const origErr = console.error;
  console.error = (...args) => {
    if (args && args[0] && typeof args[0] === 'string' && (
      args[0].includes('ResizeObserver loop completed') ||
      args[0].includes('ResizeObserver loop limit exceeded')
    )) {
      return; // suppress
    }
    origErr.apply(console, args);
  };
}
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
