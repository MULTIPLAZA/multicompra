/* =============================================================================
   PWA — registrar service worker + linkear manifest
   ----------------------------------------------------------------------------
   Importar este archivo desde cualquier pantalla con:
     <script src="/shared/pwa-register.js" defer></script>

   El SW vive en /service-worker.js y el manifest en /manifest.json. Esto
   inyecta el <link rel="manifest"> y los meta tags si todavía no existen,
   y registra el SW.
   ============================================================================= */
(function () {
  // Inyectar manifest si no está
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }

  // theme-color
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#0e9488';
    document.head.appendChild(meta);
  }

  // iOS PWA support
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const m1 = document.createElement('meta');
    m1.name = 'apple-mobile-web-app-capable';
    m1.content = 'yes';
    document.head.appendChild(m1);

    const m2 = document.createElement('meta');
    m2.name = 'apple-mobile-web-app-title';
    m2.content = 'MultiCompra';
    document.head.appendChild(m2);

    const m3 = document.createElement('link');
    m3.rel = 'apple-touch-icon';
    m3.href = '/icon-192.png';
    document.head.appendChild(m3);
  }

  // Registrar SW
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (reg) {
          console.log('[PWA] SW registrado, scope:', reg.scope);

          // Si hay update disponible, recargar para tomarlo
          reg.addEventListener('updatefound', function () {
            const newSW = reg.installing;
            if (!newSW) return;
            newSW.addEventListener('statechange', function () {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] Nueva versión disponible — refresh recomendado');
              }
            });
          });
        })
        .catch(function (err) {
          console.warn('[PWA] SW no registrado:', err);
        });
    });
  }
})();
