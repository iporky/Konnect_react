import React from 'react';

// Utility to suppress ResizeObserver errors
export const suppressResizeObserverErrors = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Create a more robust error handler
  const handleResizeObserverError = (event) => {
    if (event.message && (
      event.message.includes('ResizeObserver loop completed') ||
      event.message.includes('ResizeObserver loop limit exceeded') ||
      event.message.includes('undelivered notifications')
    )) {
      // Prevent the error from propagating
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    }
    return false;
  };

  // Override the global error handler
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && (
      message.includes('ResizeObserver loop completed') ||
      message.includes('ResizeObserver loop limit exceeded') ||
      message.includes('undelivered notifications')
    )) {
      return true; // Prevent default error handling
    }
    
    // Call the original error handler if it exists
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Also handle unhandled promise rejections
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    if (event.reason && event.reason.message && (
      event.reason.message.includes('ResizeObserver loop completed') ||
      event.reason.message.includes('ResizeObserver loop limit exceeded') ||
      event.reason.message.includes('undelivered notifications')
    )) {
      event.preventDefault();
      return;
    }
    
    // Call the original handler if it exists
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };
};

// Debounce function to prevent rapid state changes
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// React component wrapper to catch ResizeObserver errors
export const withResizeObserverErrorSuppression = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    React.useEffect(() => {
      suppressResizeObserverErrors();
    }, []);

    return <WrappedComponent {...props} ref={ref} />;
  });
};