// @ts-nocheck
/* eslint-disable no-restricted-globals, no-undef */

const CACHE_NAME = 'serenidad-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});