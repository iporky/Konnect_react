# Google Analytics Integration

This project includes Google Analytics (GA4) integration that reads the tracking ID from environment variables.

## Setup

1. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Set `REACT_APP_GA_TRACKING_ID` to your Google Analytics tracking ID (format: `G-XXXXXXXXXX`)

2. **Example .env Configuration**
   ```
   REACT_APP_GA_TRACKING_ID=G-GPXE07VR83
   ```

## How It Works

- **GoogleAnalytics Component**: Located in `src/components/GoogleAnalytics.js`, this component automatically loads and initializes Google Analytics when the app starts
- **Environment Variable**: The tracking ID is read from `REACT_APP_GA_TRACKING_ID` environment variable
- **Dynamic Loading**: The GA script is loaded dynamically only if a valid tracking ID is provided
- **Global Access**: The `gtag` function is made globally available for tracking events

## Usage

### Basic Page Tracking
Page views are automatically tracked when users navigate between routes.

### Custom Event Tracking
Use the utility functions in `src/lib/analytics.js`:

```javascript
import { trackEvent, trackSearch, trackPageView } from '../lib/analytics';

// Track a custom event
trackEvent('button_click', 'navigation', 'header_logo');

// Track a search
trackSearch('user search query');

// Track a page view manually
trackPageView('Page Title', window.location.href);
```

### Available Utility Functions

- `trackPageView(page_title, page_location)` - Track page views
- `trackEvent(action, category, label, value)` - Track custom events
- `trackSearch(search_term)` - Track search events
- `trackEngagement(engagement_time_msec)` - Track user engagement
- `setUserProperties(properties)` - Set user properties
- `isGAReady()` - Check if Google Analytics is loaded

## Benefits

- **Environment-based Configuration**: Easy to manage different tracking IDs for different environments
- **Conditional Loading**: GA only loads if a tracking ID is provided
- **Type-safe**: Includes proper error handling and checks
- **Reusable**: Utility functions for consistent tracking across the app
- **Performance**: Script is loaded asynchronously without blocking the app

## Development vs Production

- **Development**: GA will use the tracking ID from your local `.env` file
- **Production**: Set the `REACT_APP_GA_TRACKING_ID` environment variable in your deployment platform

## Security Note

The `.env` file containing your actual tracking ID should not be committed to version control. The `.env.example` file provides a template for required environment variables.