/// <reference lib="webworker" />

// FIX: Cast `self` to `ServiceWorkerGlobalScope` and assign it to a new constant `sw`.
// This resolves a "Subsequent variable declarations must have the same type" error
// that occurs when TypeScript's DOM library (which also defines `self`) is included
// globally. This ensures `self` is correctly typed for this service worker file,
// making service worker-specific APIs like `skipWaiting()` and `clients` available.
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'gadget-guide-ai-v12';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/screenshots/screenshot2.svg',
];

// Install: Cache the app shell
sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => sw.skipWaiting())
  );
});

// Activate: Clean up old caches
sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => sw.clients.claim())
  );
});

// Fetch: Serve from cache, fallback to network, and update cache
sw.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore requests that are not GET or POST, and ignore chrome-extension URLs
  if (!['GET', 'POST'].includes(request.method) || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // API requests to Google GenAI: use a stale-while-revalidate strategy.
  // This serves content from cache immediately for speed and offline access,
  // then updates the cache in the background with a fresh network request.
  if (url.hostname.includes('googleapis.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Navigation requests: use a network-first strategy.
  // This ensures users get the latest HTML.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        // If the network fails, serve the cached root page as a fallback.
        const cachedResponse = await caches.match('/');
        // FIX: Use a non-null assertion here. Since '/' is part of the cached app shell,
        // we can be certain it exists, resolving the `Response | undefined` type issue.
        return cachedResponse!;
      })
    );
    return;
  }
  
  // For all other GET requests (assets like JS, CSS, images), use a Cache-First strategy.
  // This is efficient as assets are typically versioned by the build process.
  if (request.method === 'GET') {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              // Only cache valid responses to avoid caching errors.
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, responseToCache);
              }
            });
            
            return networkResponse;
          });
        })
      );
  }
});