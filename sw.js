// Versión de cache. Actualiza este valor cuando se modifiquen los archivos.
const CACHE_NAME = 'pwa-hola-mundo-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Archivos en caché');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches antiguas
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Limpiando cache antigua:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Intercepción de peticiones para servir contenido cacheado
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(response => {
        return response || fetch(evt.request);
      })
  );
});
