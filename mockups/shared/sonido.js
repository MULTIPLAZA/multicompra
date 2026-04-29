/* =============================================================================
   MultiCompra — notificaciones por VOZ (Web Speech API)
   ----------------------------------------------------------------------------
   Usa speechSynthesis del browser (la voz nativa de Windows/macOS) para
   anunciar eventos en español. No requiere archivos de audio ni librerías
   externas.

   Preferencia por rol persistida en localStorage:
     multicompra:sonido:cajera     → 'on' | 'off' (default 'on')
     multicompra:sonido:supervisor → 'on' | 'off' (default 'on')

   API:
     setSonidoHabilitado(rol, activo)
     getSonidoHabilitado(rol)        → boolean
     toggleSonido(rol)
     playNotifSupervisor({ local, cantidad })       → "Pedido nuevo de KIWI SHOP"
     playNotifAprobada({ numero })                  → "Depósito aprobó tu pedido"
     playNotifDevuelta({ numero, nota })            → "Depósito devolvió tu pedido. Revisá la observación para corregir."
     playClick()                                    → tono cortito de feedback
     decir(texto, opciones?)                        → bajo nivel: hablar lo que sea
     rolUsuarioActual()                             → 'cajera' | 'supervisor'

   Nota: el primer speak() puede no sonar si el browser bloqueó el audio
   por user-activation policy. Lo retomamos al primer click del user.
   ============================================================================= */

const KEY_PREFIX = 'multicompra:sonido:';
const synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;

let _vocesEs = [];
let _vozPreferida = null;

function cargarVoces() {
  if (!synth) return;
  const voices = synth.getVoices() || [];
  // Filtrar voces en español, priorizando es-PY/es-AR/es-MX por sonido latino
  _vocesEs = voices.filter(v => (v.lang || '').toLowerCase().startsWith('es'));
  if (_vocesEs.length) {
    // Buscar voz preferida con orden de prioridad
    const pref = ['es-py', 'es-ar', 'es-cl', 'es-uy', 'es-mx', 'es-co', 'es-pe', 'es-ec', 'es-bo', 'es-ve', 'es-cr', 'es-pa', 'es-do', 'es-pr', 'es-us', 'es-419', 'es-es', 'es'];
    for (const p of pref) {
      const v = _vocesEs.find(v => (v.lang || '').toLowerCase() === p);
      if (v) { _vozPreferida = v; break; }
    }
    if (!_vozPreferida) _vozPreferida = _vocesEs[0];
  }
}

if (synth) {
  cargarVoces();
  // En Chrome/Edge las voces cargan async — escuchar el evento
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', cargarVoces);
  } else if ('onvoiceschanged' in synth) {
    synth.onvoiceschanged = cargarVoces;
  }
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
  if (nuevo) {
    // Decir un "ok" para confirmar que el audio funciona
    decir('Sonido activado', { tasa: 1.1 });
  }
  return nuevo;
}

/* =============================================================================
   decir(texto) — habla lo que sea con la voz preferida
   ============================================================================= */
export function decir(texto, opciones = {}) {
  if (!synth || !texto) return;
  // Si está hablando algo, cancelarlo primero (no encolamos)
  try { synth.cancel(); } catch (_) {}

  const u = new SpeechSynthesisUtterance(String(texto));
  u.lang = opciones.lang || (_vozPreferida && _vozPreferida.lang) || 'es-ES';
  u.rate = opciones.tasa || 1.0;       // velocidad (0.1 - 10, default 1)
  u.pitch = opciones.tono || 1.0;      // tono (0 - 2, default 1)
  u.volume = opciones.volumen != null ? opciones.volumen : 1.0;
  if (_vozPreferida) u.voice = _vozPreferida;

  try { synth.speak(u); } catch (_) {}
}

/* =============================================================================
   Sonidos de notificación (con texto contextual)
   ============================================================================= */
function limpiarParaTTS(s) {
  // Sacar guiones largos / abreviaciones que la voz lee raro
  return String(s || '')
    .replace(/^op-loc-/i, '')        // "OP-LOC-XYZ" → "XYZ"
    .replace(/^op-/i, '')             // "OP-1043" → "1043"
    .replace(/[_\-]+/g, ' ')          // guiones por espacios
    .trim();
}

export function playNotifSupervisor({ local, cantidad } = {}) {
  if (!getSonidoHabilitado('supervisor')) return;
  let texto;
  if (cantidad && cantidad > 1) {
    texto = `${cantidad} pedidos nuevos`;
  } else if (local) {
    texto = `Pedido nuevo de ${local}`;
  } else {
    texto = 'Pedido nuevo';
  }
  decir(texto);
}

export function playNotifAprobada({ numero } = {}) {
  if (!getSonidoHabilitado('cajera')) return;
  // Mantenemos corto y claro
  decir('Depósito aprobó tu pedido');
}

export function playNotifDevuelta({ numero, nota } = {}) {
  if (!getSonidoHabilitado('cajera')) return;
  decir('Depósito devolvió tu pedido. Por favor revisá la observación para corregir los errores.');
}

export function playClick() {
  // Click ya no toca tono — lo dejamos vacío para no interrumpir.
  // Si querés un click visual, hay feedback en la UI (toast).
}

/* =============================================================================
   Helper para usar en el menú avatar
   ============================================================================= */
export function rolUsuarioActual() {
  try {
    const u = JSON.parse(localStorage.getItem('multicompra:user') || '{}');
    const r = u.rol || 'cajera';
    return (r === 'supervisor' || r === 'admin') ? 'supervisor' : 'cajera';
  } catch (_) { return 'cajera'; }
}
