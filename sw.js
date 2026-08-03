const CACHE_NAME = 'levantamiento-v1.0.1';

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './leaflet.css',
    './leaflet.js',
    './manifest.json',
    './novedades.json'
];

// Instalación: Guardar archivos base en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación: Limpiar cachés antiguas
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
        }).then(() => self.clients.claim())
    );
});

// Interceptar peticiones (Estrategia Cache First, fallback a Red)
self.addEventListener('fetch', event => {
    // Si la petición es para una imagen local o datos que no son del caché estático, déjala pasar libremente
    if (event.request.url.includes('data:image') || event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Si falla la red y no está en caché, evitamos que rompa la app
                    return caches.match('./index.html');
                });
            })
    );
});
