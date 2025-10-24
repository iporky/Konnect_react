// Google Analytics utility functions

/**
 * Track a page view
 * @param {string} page_title - The title of the page
 * @param {string} page_location - The URL of the page
 */
export const trackPageView = (page_title, page_location) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_title,
      page_location,
    });
  }
};

/**
 * Track a custom event
 * @param {string} action - The action that triggered the event
 * @param {string} category - The category of the event
 * @param {string} label - Optional label for the event
 * @param {number} value - Optional value for the event
 */
export const trackEvent = (action, category, label = '', value = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track a search event
 * @param {string} search_term - The search term used
 */
export const trackSearch = (search_term) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: search_term,
    });
  }
};

/**
 * Track user engagement
 * @param {string} engagement_time_msec - Time spent on page in milliseconds
 */
export const trackEngagement = (engagement_time_msec) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_time_msec: engagement_time_msec,
    });
  }
};

/**
 * Set user properties
 * @param {object} properties - User properties to set
 */
export const setUserProperties = (properties) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      custom_map: properties,
    });
  }
};

/**
 * Check if Google Analytics is loaded and ready
 * @returns {boolean} - True if GA is ready, false otherwise
 */
export const isGAReady = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};