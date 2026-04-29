/* =============================================================================
   MultiCompra — sonidos de notificación (Web Audio API)
   ----------------------------------------------------------------------------
   Genera tonos cortos sin necesidad de archivos externos. Cada usuario tiene
   su preferencia (activado/silenciado) en localStorage por rol:

     multicompra:sonido:cajera     → 'on' | 'off' (default 'on')
     multicompra:sonido:supervisor → 'on' | 'off' (default 'on')

   API:
     setSonidoHabilitado(rol, activo)
     getSonidoHabilitado(rol)        → boolean
     toggleSonido(rol)
     playNotifSupervisor()           → "ding-ding" alegre, 2 tonos ascendentes
     playNotifAprobada()             → tres tonos ascendentes (celebración)
     playNotifDevuelta()             → dos tonos descendentes (atención)
     playClick()                     → click corto (ack)

   El primer play() puede fallar si el browser bloqueó el AudioContext por
   "user activation policy". Lo retomamos al primer click del user.
   ============================================================================= */

const KEY_PREFIX = 'multicompra:sonido:';

let _ctx = null;
let _resumeRequested = false;

function ctx() {
  if (_ctx) return _ctx;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (_) { return null; }
  return _ctx;
}

// Si el contexto está suspendido (chrome bloquea autoplay), lo resumimos en
// el primer gesto del usuario. Solo enganchamos el listener una vez.
function asegurarResume() {
  const c = ctx();
  if (!c || c.state !== 'suspended' || _resumeRequested) return;
  _resumeRequested = true;
  const handler = () => {
    c.resume().catch(() => {});
    document.removeEventListener('click', handler);
    document.removeEventListener('keydown', handler);
  };
  document.addEventListener('click', handler);
  document.addEventListener('keydown', handler);
}

asegurarResume();

/* =============================================================================
   Helper: tocar UN tono
   ============================================================================= */
function tono(frec, dur = 0.18, type = 'sine', volume = 0.06, delay = 0) {
  const c = ctx();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = frec;
  // Envelope suave (attack 10ms + decay exponencial)
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/* =============================================================================
   Preferencias persistidas
   ============================================================================= */
export function getSonidoHabilitado(rol = 'cajera') {
  try {
    const v = localStorage.getItem(KEY_PREFIX + rol);
    return v === null ? true : v === 'on';
  } catch (_) { return true; }
}

export function setSonidoHabilitado(rol, activo) {
  try { localStorage.setItem(KEY_PREFIX + rol, activo ? 'on' : 'off'); }
  catch (_) {}
}

export function toggleSonido(rol = 'cajera') {
  const nuevo = !getSonidoHabilitado(rol);
  setSonidoHabilitado(rol, nuevo);
  // Tocar un click chico de feedback solo si se está activando
  if (nuevo) playClick();
  return nuevo;
}

/* =============================================================================
   Sonidos de notificación (chequean preferencia antes de tocar)
   ============================================================================= */
export function playNotifSupervisor() {
  if (!getSonidoHabilitado('supervisor')) return;
  // Dos tonos ascendentes — alegre, llama atención sin ser molesto
  tono(880, 0.14, 'sine', 0.07, 0);     // A5
  tono(1320, 0.18, 'sine', 0.07, 0.13); // E6
}

export function playNotifAprobada() {
  if (!getSonidoHabilitado('cajera')) return;
  // Tres tonos ascendentes — celebración
  tono(523.25, 0.10, 'sine', 0.06, 0);     // C5
  tono(659.25, 0.10, 'sine', 0.06, 0.10);  // E5
  tono(783.99, 0.22, 'sine', 0.06, 0.20);  // G5
}

export function playNotifDevuelta() {
  if (!getSonidoHabilitado('cajera')) return;
  // Dos tonos descendentes — atención (más serio que aprobada, pero no agresivo)
  tono(587.33, 0.16, 'sine', 0.07, 0);     // D5
  tono(440, 0.20, 'sine', 0.07, 0.18);     // A4
}

export function playClick() {
  // Sin chequeo de preferencia: lo usamos como ack del propio toggle
  tono(1000, 0.06, 'sine', 0.04, 0);
}

/* =============================================================================
   Helper para usar en el menú avatar — devuelve el rol del usuario logueado
   ============================================================================= */
export function rolUsuarioActual() {
  try {
    const u = JSON.parse(localStorage.getItem('multicompra:user') || '{}');
    const r = u.rol || 'cajera';
    // Solo distinguimos cajera vs supervisor para sonidos
    return (r === 'supervisor' || r === 'admin') ? 'supervisor' : 'cajera';
  } catch (_) { return 'cajera'; }
}
