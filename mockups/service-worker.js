/* =============================================================================
   MultiCompra — Service Worker
   ----------------------------------------------------------------------------
   Estrategia: network-first para HTML/JS/CSS (siempre buscar lo más nuevo,
   pero servir cache si la red falla), cache-first para assets estáticos
   (favicon, iconos, fuentes).

   Versionar el cache name al hacer un deploy importante para forzar
   refresh — ej: 'mc-v1' → 'mc-v2'.
   ============================================================================= */

const CACHE_VERSION = 'mc-v4'; // rebranding Multitech PY — bumped 2026-04-29
const CACHE_NAME = `multicompra-${CACHE_VERSION}`;

// Recursos estáticos que precacheamos en el install (app shell)
const APP_SHELL = [
  '/',
  '/login.html',
  '/manifest.json',
  '/favicon.svg',
  '/shared/styles.css',
  '/shared/api.js',
  '/shared/data.js',
  '/shared/supabase.js',
  '/shared/ui.js',
  '/shared/auth-guard.js',
  '/shared/sonido.js',
  '/shared/push.js',
  '/MultitechLogo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // No fallamos el install si alguna URL no está disponible
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW] no precaché', url, err.message)
          )
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('multicompra-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo manejamos GETs same-origin. POSTs (auth, supabase, API ERP) van
  // siempre a la red — el SW no debe interferir.
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Network-first para HTML (siempre buscar la versión más reciente)
  if (req.destination === 'document' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cachear copia para offline
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/login.html')))
    );
    return;
  }

  // Cache-first para CSS/JS/imagenes/etc
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Refresco de fondo (stale-while-revalidate)
        fetch(req).then((res) => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, res));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Si es una imagen y falla, devolvemos un transparent fallback
        if (req.destination === 'image') {
          return new Response('', { status: 204, statusText: 'offline' });
        }
        return new Response('Sin conexión', { status: 503, statusText: 'offline' });
      });
    })
  );
});

// Recibir mensaje del cliente para forzar update (útil después de un deploy)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
