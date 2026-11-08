const CACHE_NAME = 'vb-escorting-v1.0';

const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './style.css?v=1.0',
    './app.js',
    './app.js?v=1.0',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-192.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon.png',
    './icons/favicon-32.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
    'https://npmcdn.com/flatpickr/dist/themes/dark.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/flatpickr'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                STATIC_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`[PWA SW] Failed to cache: ${url}`, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log(`[PWA SW] Removing old cache: ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Smart routing strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // 1. Google Apps Script API calls: Always bypass cache, network-only with friendly offline error
    if (url.hostname.includes('script.google.com')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({
                        status: 'error',
                        message: 'Offline: Internet connection required to sync with Google Sheets.'
                    }),
                    {
                        status: 503,
                        statusText: 'Service Unavailable (Offline)',
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );
        return;
    }

    // 2. Third-party CDN libraries & Google Fonts: Cache-First
    if (
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('npmcdn.com') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 3. App Shell (HTML, CSS, JS, Images): Network-First with Cache Fallback
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    // If navigation request fails and nothing in cache, return cached index.html
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

