// Google Identity Services helper
// Frontend uses only the Client ID. Do NOT expose client secret in the browser.

const SCRIPT_ID = 'google-identity-services';

export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) return resolve();

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Get an OAuth access token (scopes: openid email profile) using GIS token client
export const getGoogleAccessToken = async (clientId, scope = 'openid email profile') => {
  await loadGoogleScript();
  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (resp) => {
          if (resp && resp.access_token) {
            resolve(resp.access_token);
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
        error_callback: (err) => reject(err),
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchGoogleUser = async (accessToken) => {
  const resp = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error('Failed to fetch Google userinfo');
  return resp.json();
};
