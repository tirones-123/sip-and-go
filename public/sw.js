// Service Worker for SIP&GO! PWA
const CACHE_NAME = 'sipandgo-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/assets/logo-jauneclair.png',
  '/logo-jauneclair.png',
  '/static/logo-jauneclair.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => {
          return fetch(url).then(response => {
            if (!response.ok) {
              console.warn(`Failed to cache ${url}`);
              return new Response(''); // Return empty response for failed fetches
            }
            return cache.put(url, response);
          }).catch(err => {
            console.warn(`Failed to fetch ${url}:`, err);
          });
        }));
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  // For images and assets, try cache first
  if (event.request.url.includes('/assets/') || 
      event.request.url.includes('.png') || 
      event.request.url.includes('.jpg') ||
      event.request.url.includes('manifest.json')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Return a fallback for images
          if (event.request.url.includes('.png')) {
            return new Response('', { headers: { 'Content-Type': 'image/png' } });
          }
          return new Response('Offline');
        })
    );
  } else {
    // For other requests, try network first
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
}); 