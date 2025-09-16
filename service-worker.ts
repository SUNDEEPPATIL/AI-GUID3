
/// <reference lib="webworker" />

// FIX: Cast `self` to `ServiceWorkerGlobalScope` and assign it to a new constant `sw`.
// This resolves a "Subsequent variable declarations must have the same type" error
// that occurs when TypeScript's DOM library (which also defines `self`) is included
// globally. This ensures `self` is correctly typed for this service worker file,
// making service worker-specific APIs like `skipWaiting()` and `clients` available.
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'gadget-guide-ai-v7';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.js',
  '/manifest.json',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);

  // For cross-origin requests (like from the CDN), use a stale-while-revalidate strategy.
  if (url.origin === 'https://aistudiocdn.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // For app shell and other local assets, use a Cache-First strategy.
  // This makes the app load instantly from cache and is great for offline performance.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Only cache valid, basic responses to avoid caching errors.
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      });
    })
  );
});