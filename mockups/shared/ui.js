/* =============================================================================
   MultiCompra — helpers UI compartidos (mockups)
   ----------------------------------------------------------------------------
   initSidebarClickOutside() — Decisión 25
     En pantallas `page-dense`, cuando el sidebar está forzado a abierto
     (clase `sidebar-forced-open`), un click fuera del sidebar (y fuera del
     botón hamburguesa) lo colapsa. Persiste la preferencia en localStorage
     con la misma clave que usa el resto de los mockups.

   initAvatarMenu(opts) — Unifica perfil / toggle tema / cerrar sesión en un
     menú desplegable sobre el avatar. Reemplaza el botón suelto de tema y el
     botón Salir en todos los layouts.

     opts = {
       avatarBtnSelector: '#avatar-btn',   // botón que abre el menú
       menuSelector:      '#avatar-menu',  // el <div role="menu"> generado
       logoutHref:        '../logout.html',
       perfilHref:        null,            // null → ítem deshabilitado
       themeKey:          'multicompra:theme',
     }
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

/* =============================================================================
   initAvatarMenu — menú desplegable unificado sobre el avatar
   ============================================================================= */
export function initAvatarMenu(opts = {}) {
  const {
    avatarBtnSelector = '#avatar-btn',
    logoutHref = '../logout.html',
    perfilHref = null,
    themeKey = 'multicompra:theme',
    userName = null,
    userRole = null,
    userLocal = null,
  } = opts;

  const avatarBtn = document.querySelector(avatarBtnSelector);
  if (!avatarBtn) return;

  // ---- Construir el menú en el DOM ----
  const menu = document.createElement('div');
  menu.id = 'avatar-menu';
  menu.className = 'avatar-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Menú de usuario');
  menu.hidden = true;

  // Leer datos de usuario del localStorage si no vienen por opts
  let nombre = userName;
  let rol = userRole;
  let local = userLocal;
  if (!nombre || !rol) {
    try {
      const u = JSON.parse(localStorage.getItem('multicompra:user') || '{}');
      if (!nombre) nombre = u.nombre || u.name || 'Usuario';
      if (!rol)   rol    = u.rol   || u.role || '';
      if (!local) local  = u.localNombre || u.local || '';
    } catch (_) {}
  }

  const rolLabel = { cajera: 'Cajera', supervisor: 'Supervisora', admin: 'Admin' };
  const rolText  = rolLabel[rol] || rol || '';

  const themeLabel = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'Tema: oscuro' : 'Tema: claro';

  const iconSun = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
  const iconMoon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const iconUser = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>`;
  const iconLogout = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
  const iconBellOn  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
  const iconBellOff = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  menu.innerHTML = `
    <div class="avatar-menu-header" role="presentation">
      <div class="avatar-menu-name">${nombre}</div>
      <div class="avatar-menu-role">${rolText}${local ? ' &middot; ' + local : ''}</div>
    </div>
    <div class="avatar-menu-divider" role="separator"></div>
    ${perfilHref
      ? `<a class="avatar-menu-item" href="${perfilHref}" role="menuitem">
           ${iconUser}
           <span>Mi perfil</span>
         </a>`
      : `<button type="button" class="avatar-menu-item avatar-menu-item--disabled" disabled aria-disabled="true" title="Próximamente" role="menuitem">
           ${iconUser}
           <span>Mi perfil</span>
           <span class="avatar-menu-soon">Próximamente</span>
         </button>`
    }
    <button type="button" class="avatar-menu-item" id="avatar-menu-theme" role="menuitem">
      <span class="avatar-menu-theme-icon">${iconSun}${iconMoon}</span>
      <span id="avatar-menu-theme-label">${themeLabel()}</span>
    </button>
    <button type="button" class="avatar-menu-item" id="avatar-menu-sonido" role="menuitem">
      <span class="avatar-menu-sonido-icon">${iconBellOn}${iconBellOff}</span>
      <span id="avatar-menu-sonido-label">Sonido: cargando…</span>
    </button>
    <div class="avatar-menu-divider" role="separator"></div>
    <a class="avatar-menu-item avatar-menu-item--danger" href="${logoutHref}" role="menuitem">
      ${iconLogout}
      <span>Cerrar sesión</span>
    </a>
  `;

  // Insertar el menú inmediatamente después del botón avatar
  avatarBtn.style.position = 'relative';
  avatarBtn.insertAdjacentElement('afterend', menu);

  // También necesitamos que el padre sea position:relative para el menú absoluto
  // Si el padre no tiene position, lo forzamos
  const parent = avatarBtn.parentElement;
  if (parent) {
    const ps = window.getComputedStyle(parent).position;
    if (ps === 'static') parent.style.position = 'relative';
  }

  // ---- Toggle ----
  function openMenu() {
    menu.hidden = false;
    avatarBtn.setAttribute('aria-expanded', 'true');
    // Actualizar label de tema al abrir
    const lbl = document.getElementById('avatar-menu-theme-label');
    if (lbl) lbl.textContent = themeLabel();
    // Foco en el primer ítem interactivo
    const first = menu.querySelector('.avatar-menu-item:not([disabled])');
    if (first) setTimeout(() => first.focus(), 30);
  }

  function closeMenu() {
    menu.hidden = true;
    avatarBtn.setAttribute('aria-expanded', 'false');
    avatarBtn.focus();
  }

  function toggleMenu() {
    if (menu.hidden) openMenu(); else closeMenu();
  }

  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  avatarBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar al click fuera
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !avatarBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Esc cierra
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });

  // Navegación por teclado dentro del menú
  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll('.avatar-menu-item:not([disabled])')];
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < items.length - 1) items[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) items[idx - 1].focus();
    } else if (e.key === 'Escape') {
      closeMenu();
    } else if (e.key === 'Tab') {
      closeMenu();
    }
  });

  // Toggle de tema desde el menú
  const btnThemeMenu = document.getElementById('avatar-menu-theme');
  if (btnThemeMenu) {
    btnThemeMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const curr = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = curr === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(themeKey, next); } catch (_) {}
      // Actualizar label
      const lbl = document.getElementById('avatar-menu-theme-label');
      if (lbl) lbl.textContent = themeLabel();
      // Actualizar el btn-theme suelto si todavía existe en la página
      // (compatibilidad durante la transición)
    });
  }

  // Toggle de sonido (carga lazy del módulo para que la pantalla no falle
  // si shared/sonido.js todavía no está deployado en alguna versión)
  const btnSonidoMenu = document.getElementById('avatar-menu-sonido');
  if (btnSonidoMenu) {
    let sonidoMod = null;
    const lblSonido = document.getElementById('avatar-menu-sonido-label');
    const refrescarLbl = () => {
      if (!sonidoMod || !lblSonido) return;
      const rol = sonidoMod.rolUsuarioActual();
      const on = sonidoMod.getSonidoHabilitado(rol);
      lblSonido.textContent = on ? 'Sonido: activado' : 'Sonido: silenciado';
      btnSonidoMenu.setAttribute('aria-pressed', on ? 'true' : 'false');
      btnSonidoMenu.classList.toggle('avatar-menu-sonido-off', !on);
    };
    import('./sonido.js').then(mod => {
      sonidoMod = mod;
      refrescarLbl();
    }).catch(() => {
      if (lblSonido) lblSonido.textContent = 'Sonido: no disponible';
    });
    btnSonidoMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!sonidoMod) return;
      const rol = sonidoMod.rolUsuarioActual();
      sonidoMod.toggleSonido(rol);
      refrescarLbl();
    });
  }

  return { open: openMenu, close: closeMenu };
}

/* =============================================================================
   updateAltasBadge — actualiza el contador del nav-item "Altas pendientes"
   ----------------------------------------------------------------------------
   Combina las solicitudes mock con las que la cajera dejó en localStorage y
   las resoluciones del supervisor. Cuenta las que terminan en estado
   "pendiente" y rellena el badge `#nav-count-altas`. Si 0, lo oculta.

     opts.mockSolicitudes  array opcional (si no, se asume []).
     opts.badgeId          id del elemento contador (default 'nav-count-altas').
   ============================================================================= */
export function updateAltasBadge(opts = {}) {
  const {
    mockSolicitudes = [],
    badgeId = 'nav-count-altas',
    localKey = 'multicompra:solicitudes_alta_producto',
    resolKey = 'multicompra:solicitudes_resoluciones'
  } = opts;

  const badge = document.getElementById(badgeId);
  if (!badge) return;

  let locales = [];
  let resol = {};
  try { locales = JSON.parse(localStorage.getItem(localKey) || '[]'); } catch (_) {}
  try { resol = JSON.parse(localStorage.getItem(resolKey) || '{}'); } catch (_) {}

  const todas = [...mockSolicitudes, ...locales];
  let pendientes = 0;
  for (const s of todas) {
    const estado = (resol[s.id] && resol[s.id].estado) || s.estado;
    if (estado === 'pendiente') pendientes++;
  }

  if (pendientes > 0) {
    badge.textContent = String(pendientes);
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
  return pendientes;
}
