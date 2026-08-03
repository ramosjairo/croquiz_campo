const CACHE_NAME = 'levantamiento-v1.0.0';

// Archivos exactos que se guardarán para funcionar offline
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './leaflet.css',
    './leaflet.js',
    './manifest.json'
];

// Instalación del Service Worker (Guarda los archivos en Caché)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caché abierto. Guardando archivos...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar peticiones (Si no hay internet, busca en el Caché)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve el archivo del caché si existe, si no, lo pide a la red
                return response || fetch(event.request);
            })
    );
});

// Actualización del caché (Elimina versiones viejas al sacar una nueva)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Borrando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});