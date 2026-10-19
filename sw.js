// Siempre pide la versión más reciente al servidor (revalida con ETag), para que
// las actualizaciones lleguen al celular sin esperar el caché de 10 minutos.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request, { cache: 'no-cache' }).catch(() => caches.match(request)));
});
