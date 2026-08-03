const CACHE_NAME = 'levantamiento-v1.0.2';

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
    const requestUrl = event.request.url;
    
    // Ignorar peticiones que no sean GET (como POST) o esquemas como blob: y data:
    if (event.request.method !== 'GET' || requestUrl.startsWith('blob:') || requestUrl.startsWith('data:')) {
        return; // Deja que el navegador lo maneje por defecto sin pasar por el Service Worker
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolver respuesta desde caché si existe
                if (response) {
                    return response;
                }
                
                // Si no está en caché, intentar obtenerlo de la red
                return fetch(event.request).catch(() => {
                    // Fallback visual en caso de estar offline y no encontrar la URL solicitada
                    // Especialmente útil si se recarga la página
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});