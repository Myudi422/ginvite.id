// public/sw.js - Simple service worker to handle chunk loading errors
const CACHE_NAME = 'papunda-v1';

self.addEventListener('fetch', (event) => {
  // Handle chunk loading failures
  if (event.request.url.includes('_next/static/chunks/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('Chunk fetch failed, clearing cache and retrying');
          // Clear cache and try again
          return caches.delete(CACHE_NAME).then(() => {
            return fetch(event.request);
          });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});