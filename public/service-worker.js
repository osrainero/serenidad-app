// service-worker.js
const CACHE_NAME = 'serenidad-cache-v3';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico'
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => { 
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Interceptar y bloquear notificaciones relacionadas con URL
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DENY_URL_COPY') {
    // Confirmar que se recibió el mensaje
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({success: true});
    }
  }
});

// Prevenir eventos de notificación del sistema
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Interceptar y modificar requests que podrían triggear la notificación
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Si la request contiene parámetros que podrían triggear la notificación
  if (url.searchParams.has('source') || url.searchParams.has('utm_source')) {
    url.searchParams.delete('source');
    url.searchParams.delete('utm_source');
    
    const modifiedRequest = new Request(url.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: event.request.mode,
      credentials: event.request.credentials,
      cache: event.request.cache,
      redirect: event.request.redirect,
      referrer: event.request.referrer
    });
    
    event.respondWith(
      caches.match(modifiedRequest)
        .then((response) => response || fetch(modifiedRequest))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});