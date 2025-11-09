import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Suppress benign Chrome ResizeObserver loop errors caused by autosizing components
if (typeof window !== 'undefined') {
  const resizeObserverErrHandler = (e) => {
    if (e?.message && (
      e.message.includes('ResizeObserver loop completed') ||
      e.message.includes('ResizeObserver loop limit exceeded') ||
      e.message.includes('undelivered notifications')
    )) {
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener('error', resizeObserverErrHandler);
  
  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    if (e?.reason?.message && (
      e.reason.message.includes('ResizeObserver loop completed') ||
      e.reason.message.includes('ResizeObserver loop limit exceeded') ||
      e.reason.message.includes('undelivered notifications')
    )) {
      e.preventDefault();
    }
  });
  
  // Filter console.error noise for ResizeObserver warnings
  const origErr = console.error;
  console.error = (...args) => {
    if (args && args.length > 0) {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && (
        firstArg.includes('ResizeObserver loop completed') ||
        firstArg.includes('ResizeObserver loop limit exceeded') ||
        firstArg.includes('undelivered notifications')
      )) {
        return; // suppress
      }
    }
    origErr.apply(console, args);
  };
  
  // Filter console.warn for ResizeObserver warnings as well
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (args && args.length > 0) {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && (
        firstArg.includes('ResizeObserver loop completed') ||
        firstArg.includes('ResizeObserver loop limit exceeded') ||
        firstArg.includes('undelivered notifications')
      )) {
        return; // suppress
      }
    }
    origWarn.apply(console, args);
  };
}
root.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
