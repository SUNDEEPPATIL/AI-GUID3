/* Basic service worker with safe fetch handler and robust fallbacks */

self.addEventListener('install', (event: any) => {
  // Skip waiting to activate new SW quickly (optional)
  event.waitUntil((self as any).skipWaiting());
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil((self as any).clients.claim());
});

self.addEventListener('fetch', (event: any) => {
  // Ensure event.respondWith always receives a Promise<Response>
  try {
    event.respondWith((async () => {
      try {
        // Network-first strategy with graceful fallbacks
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.ok) return networkResponse;

        // If network responded but with an error status, return a simple fallback
        return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
      } catch (err) {
        // When offline or fetch fails, return an Offline response (could be enhanced to return cached assets)
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  } catch (err) {
    // As a last resort, ensure respondWith is called with a resolved Response
    try {
      event.respondWith(Promise.resolve(new Response('Service Worker Error', { status: 500 })));
    } catch (e) {
      // no-op: in very rare cases this may still throw, but nothing more we can do here
    }
  }
});