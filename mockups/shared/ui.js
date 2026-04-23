/* =============================================================================
   MultiCompra — helpers UI compartidos (mockups)
   ----------------------------------------------------------------------------
   initSidebarClickOutside() — Decisión 25
     En pantallas `page-dense`, cuando el sidebar está forzado a abierto
     (clase `sidebar-forced-open`), un click fuera del sidebar (y fuera del
     botón hamburguesa) lo colapsa. Persiste la preferencia en localStorage
     con la misma clave que usa el resto de los mockups.
   ============================================================================= */

export function initSidebarClickOutside(opts = {}) {
  const {
    appSelector = '.app',
    sidebarSelector = '.app-sidebar',
    toggleSelector = '#btn-toggle-sidebar',
    storageKey = 'multicompra.sidebar.forceOpen'
  } = opts;

  const app = document.querySelector(appSelector);
  if (!app) return;

  document.addEventListener('click', (e) => {
    // Solo aplica en pantallas densas con sidebar forzado a abierto
    if (!app.classList.contains('page-dense')) return;
    if (!app.classList.contains('sidebar-forced-open')) return;

    const sidebar = app.querySelector(sidebarSelector);
    const toggle = document.querySelector(toggleSelector);
    if (!sidebar) return;

    // Si el click fue dentro del sidebar o sobre el botón hamburguesa, ignorar
    if (sidebar.contains(e.target)) return;
    if (toggle && toggle.contains(e.target)) return;

    // Colapsar y persistir preferencia
    app.classList.remove('sidebar-forced-open');
    try { localStorage.setItem(storageKey, 'false'); } catch (_) {}
  });
}
