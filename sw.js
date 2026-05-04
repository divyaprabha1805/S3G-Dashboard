const CACHE_NAME = 'opc-reports-v2';
const ASSETS = [
  '/S3G-Dashboard/',
  '/S3G-Dashboard/index.html',
  '/S3G-Dashboard/manifest.json',
  '/S3G-Dashboard/icon-192.png',
  '/S3G-Dashboard/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
