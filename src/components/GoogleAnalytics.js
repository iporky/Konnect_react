import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const trackingId = process.env.REACT_APP_GA_TRACKING_ID;
    
    if (!trackingId) {
      console.warn('Google Analytics tracking ID not found in environment variables');
      return;
    }

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', trackingId);

    // Make gtag globally available
    window.gtag = gtag;

    console.log('Google Analytics initialized with tracking ID:', trackingId);

    // Cleanup function
    return () => {
      // Remove the script if component unmounts (though this rarely happens for GA)
      const existingScript = document.querySelector(`script[src*="${trackingId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;