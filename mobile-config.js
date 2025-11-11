// Allow Mapbox domains + blobs/data
App.accessRule('https://api.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://*.tiles.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://events.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://api.tiles.mapbox.com/*', { type: 'navigation' });
App.accessRule('https://*.mapbox.com/*', { type: 'navigation' });
App.accessRule('data:*');
App.accessRule('blob:*');

// (Optional) If you load any local http urls on Android dev
App.accessRule('http://*/*');
App.accessRule('ws://*/*');