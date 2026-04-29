/* =============================================================================
   MultiCompra — notificaciones push nativas del browser (Web Notifications API)
   ----------------------------------------------------------------------------
   Complementa a shared/sonido.js: cuando la pestaña está VISIBLE, sonido + toast
   son suficientes. Cuando está OCULTA, el browser limita speechSynthesis, por lo
   que push.js envía una Notification nativa que llega aunque el user esté en otra
   pestaña.

   NO usa service worker — es un MVP que funciona con la Notifications API base.
   Limitación conocida: iOS Safari solo soporta notificaciones cuando la PWA está
   instalada en pantalla de inicio. Si `window.Notification` no existe, todas las
   funciones fallan silenciosamente.

   Preferencia por rol persistida en localStorage:
     multicompra:push:cajera     → 'on' | 'off' (default 'on')
     multicompra:push:supervisor → 'on' | 'off' (default 'on')

   API pública:
     getPermisoNotificaciones()            → 'granted' | 'denied' | 'default' | 'unsupported'
     pedirPermisoNotificaciones()          → Promise<'granted' | 'denied' | 'default'>
     getPushHabilitado(rol)                → boolean
     setPushHabilitado(rol, bool)
     togglePush(rol)                       → boolean (nuevo estado)
     notificar(titulo, opciones?)          → void (silencioso si no hay permiso o pestaña visible)
       opciones: { body, icon, tag, requireInteraction, onClick }
   ============================================================================= */

const KEY_PREFIX       = 'multicompra:push:';
const KEY_BANNER       = 'multicompra:push:banner-cerrado';
const ICON_DEFAULT     = '/favicon.svg';
const NOTIF_SUPPORTED  = (typeof window !== 'undefined') && ('Notification' in window);

/* =============================================================================
   Estado del permiso
   ============================================================================= */

/**
 * Devuelve el estado actual del permiso de notificaciones.
 * 'unsupported' si el browser / dispositivo no soporta la API.
 */
export function getPermisoNotificaciones() {
  if (!NOTIF_SUPPORTED) return 'unsupported';
  try { return Notification.permission; }
  catch (_) { return 'unsupported'; }
}

/**
 * Solicita permiso al usuario. Devuelve una promesa con el resultado.
 * Si ya fue otorgado/denegado, resuelve inmediatamente sin mostrar diálogo.
 */
export async function pedirPermisoNotificaciones() {
  if (!NOTIF_SUPPORTED) return 'unsupported';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (_) {
    return getPermisoNotificaciones();
  }
}

/* =============================================================================
   Preferencias persistidas
   ============================================================================= */

export function getPushHabilitado(rol = 'cajera') {
  try {
    const v = localStorage.getItem(KEY_PREFIX + rol);
    return v === null ? true : v === 'on';
  } catch (_) { return true; }
}

export function setPushHabilitado(rol, activo) {
  try { localStorage.setItem(KEY_PREFIX + rol, activo ? 'on' : 'off'); }
  catch (_) {}
}

/**
 * Alterna el estado del push para el rol indicado.
 * Devuelve el nuevo estado (true = habilitado).
 */
export function togglePush(rol = 'cajera') {
  const nuevo = !getPushHabilitado(rol);
  setPushHabilitado(rol, nuevo);
  return nuevo;
}

/* =============================================================================
   notificar — crea una Notification nativa si aplica
   ============================================================================= */

/**
 * Envía una notificación nativa del browser.
 *
 * Condiciones para que se cree la notificación:
 *   1. Browser soporta la API.
 *   2. Permiso está en 'granted'.
 *   3. La pestaña está OCULTA (document.hidden === true).
 *      Si está visible, sonido + toast ya son suficientes.
 *
 * Si alguna condición falla → silencio total, sin error.
 *
 * @param {string} titulo
 * @param {{ body?: string, icon?: string, tag?: string, requireInteraction?: boolean, onClick?: () => void }} opciones
 */
export function notificar(titulo, opciones = {}) {
  if (!NOTIF_SUPPORTED) return;
  if (getPermisoNotificaciones() !== 'granted') return;

  // Si la pestaña está visible, voz + toast son suficientes
  if (typeof document !== 'undefined' && !document.hidden) return;

  const {
    body,
    icon  = ICON_DEFAULT,
    tag,
    requireInteraction = false,
    onClick
  } = opciones;

  // Resolver icon a URL absoluta para que funcione en subdirectorios
  let iconUrl = icon;
  try {
    iconUrl = new URL(icon, window.location.origin).href;
  } catch (_) {
    iconUrl = icon;
  }

  try {
    const notifOpts = {
      body,
      icon: iconUrl,
      requireInteraction,
      // badge y vibrate son opcionales y se ignoran donde no hay soporte
    };
    if (tag) notifOpts.tag = tag;

    const n = new Notification(titulo, notifOpts);

    n.onclick = () => {
      // Traer la pestaña al frente
      try { window.focus(); } catch (_) {}
      // Cerrar la notificación
      try { n.close(); } catch (_) {}
      // Callback personalizado
      if (typeof onClick === 'function') {
        try { onClick(); } catch (_) {}
      }
    };

    n.onerror = () => {}; // silencioso
  } catch (_) {
    // Silencioso — puede fallar en contextos de seguridad específicos
  }
}

/* =============================================================================
   Banner de solicitud de permiso
   ----------------------------------------------------------------------------
   Muestra un banner discreto arriba del contenido invitando al user a activar
   las notificaciones. Solo se muestra:
     - Si el permiso es 'default' (nunca pidió).
     - Si el push está habilitado en la preferencia del rol.
     - Si el user nunca cerró el banner antes (flag en localStorage).

   Llama al callback `onActivar` cuando el usuario hace click en "Activar".
   El banner se cierra y persiste el flag al cerrar.
   ============================================================================= */

/**
 * Inserta el banner de solicitud de permiso en el DOM si corresponde.
 *
 * @param {object} opts
 * @param {string} opts.rol              - 'cajera' | 'supervisor'
 * @param {function} [opts.onActivar]    - callback después de que el user activa
 * @param {string}   [opts.containerId]  - id del contenedor donde insertar (default: body)
 */
export function mostrarBannerPermisoSiCorresponde({ rol, onActivar, containerId } = {}) {
  if (!NOTIF_SUPPORTED) return;
  if (getPermisoNotificaciones() !== 'default') return;
  if (!getPushHabilitado(rol)) return;

  // Si ya lo cerró antes, no mostrar
  try {
    if (localStorage.getItem(KEY_BANNER) === '1') return;
  } catch (_) {}

  const banner = document.createElement('div');
  banner.id = 'push-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Solicitud de permisos de notificación');
  banner.style.cssText = [
    'display:flex',
    'align-items:center',
    'gap:12px',
    'padding:10px 16px',
    'background:var(--info-soft, #eff6ff)',
    'border-bottom:1px solid var(--info, #3b82f6)',
    'color:var(--info-text, #1d4ed8)',
    'font-size:14px',
    'line-height:1.4',
    'z-index:200',
    'flex-wrap:wrap'
  ].join(';');

  const iconBell = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/></svg>`;

  banner.innerHTML = `
    ${iconBell}
    <span style="flex:1;min-width:0;">
      Activá las notificaciones para recibir avisos cuando llegue un pedido nuevo aunque tengas otra pestaña abierta.
    </span>
    <button type="button" id="push-banner-activar"
      style="padding:5px 14px;background:var(--info,#3b82f6);color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;"
      aria-label="Activar notificaciones del browser">
      Activar
    </button>
    <button type="button" id="push-banner-cerrar"
      style="padding:5px 8px;background:transparent;border:none;color:inherit;cursor:pointer;flex-shrink:0;opacity:0.6;"
      aria-label="Cerrar este aviso">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  function cerrarBanner() {
    try { banner.remove(); } catch (_) {}
    try { localStorage.setItem(KEY_BANNER, '1'); } catch (_) {}
  }

  banner.querySelector('#push-banner-activar').addEventListener('click', async () => {
    cerrarBanner();
    const permiso = await pedirPermisoNotificaciones();
    if (typeof onActivar === 'function') {
      try { onActivar(permiso); } catch (_) {}
    }
  });

  banner.querySelector('#push-banner-cerrar').addEventListener('click', cerrarBanner);

  // Insertar al inicio del contenedor
  const container = containerId
    ? (document.getElementById(containerId) || document.body)
    : document.body;

  container.insertAdjacentElement('afterbegin', banner);
}
