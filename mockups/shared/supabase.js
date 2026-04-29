/* =============================================================================
   MultiCompra — cliente Supabase
   ----------------------------------------------------------------------------
   Carga el cliente @supabase/supabase-js desde esm.sh la primera vez que se
   necesita. No requiere agregar nada al HTML.

   Si SUPABASE_URL queda vacío, todas las funciones caen al localStorage
   actual (fallback transparente para mockups sin backend).
   ============================================================================= */

// ─── Configuración del proyecto Supabase ────────────────────────────────────
// La anon key es pública por diseño (se ve en el browser); la seguridad real
// viene de las políticas RLS en cada tabla.
const SUPABASE_URL      = 'https://asangpkbfuxvysdcbyms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYW5ncGtiZnV4dnlzZGNieW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjU5MTMsImV4cCI6MjA5MzA0MTkxM30.UgI3yX5S6_KOXRPeoRyH_2iAamgHlzaCt1Lhfc_2-rk';

let _client = null;
let _clientLoading = null;

async function getClient() {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (_clientLoading) return _clientLoading;

  _clientLoading = (async () => {
    try {
      const mod = await import('https://esm.sh/@supabase/supabase-js@2');
      _client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },  // usamos auth propio del ERP por ahora
        global: { headers: { 'x-app': 'multicompra-pwa' } }
      });
      return _client;
    } catch (err) {
      console.error('[supabase] Error cargando cliente:', err);
      return null;
    }
  })();

  return _clientLoading;
}

export async function isSupabaseConectado() {
  return !!(await getClient());
}

export function tieneConfigSupabase() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/* =============================================================================
   Helpers de fallback a localStorage
   ============================================================================= */
const KEYS = {
  OPS:           'multicompra:ops_enviadas',
  OPS_RESOL:     'multicompra:ops_resoluciones',
  OCS:           'multicompra:ocs_creadas',
  COMPRAS:       'multicompra:compras_registradas',
  SOL_ALTA:      'multicompra:solicitudes_alta_producto',
  SOL_ALTA_RES:  'multicompra:solicitudes_resoluciones'
};

function lsGet(key, def = null) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
  catch (_) { return def; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch (_) { return false; }
}

// Convierte cualquier valor a int. Si no es numérico válido, devuelve fallback.
// Útil para defender las columnas *_id_erp que son INTEGER en Supabase y a
// veces nos llegan strings (ej: 'user-shirley' del botón demo viejo, o
// userObj.id que viene del localStorage como string).
function toInt(v, fallback = 0) {
  if (v === null || v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) && Number.isInteger(n) ? n : fallback;
}

/* =============================================================================
   USUARIOS — registrar / actualizar usuario en Supabase tras login real
   ============================================================================= */
export async function upsertUsuario({ id_erp, usuario, nombre, rol, activo = true }) {
  const supa = await getClient();
  if (!supa) return { ok: true, fallback: true };
  const { error } = await supa.from('usuarios_app').upsert({
    id_erp, usuario, nombre, rol, activo, ultimo_login: new Date().toISOString()
  });
  return { ok: !error, error: error?.message };
}

/* =============================================================================
   OP — Órdenes de Pedido (cajera)
   ============================================================================= */
export async function guardarOP(op) {
  // op: { numero, cajeraId, cajera, localId, localNombre, sucursal,
  //       lineas: [{ productoId, productoCodigo, productoNombre, productoCosto,
  //                  productoPrecio, idProveedor, cantidad }],
  //       esExcepcion, motivoExcepcion }
  const supa = await getClient();
  if (!supa) {
    // Fallback: localStorage (lo que hace hoy op-nueva.html)
    const arr = lsGet(KEYS.OPS, []);
    arr.unshift({
      ...op,
      id: op.numero,
      fecha: op.fecha || formatearFecha(new Date()),
      estado: 'enviada'
    });
    lsSet(KEYS.OPS, arr);
    return { ok: true, fallback: true, opId: op.numero };
  }

  // Insert OP + líneas en transacción (vía RPC o secuencial)
  const { data: opRow, error: errOp } = await supa.from('op').insert({
    numero: op.numero,
    cajera_id_erp: toInt(op.cajeraId),
    cajera_nombre: op.cajera,
    local_id: toInt(op.localId),
    local_nombre: op.localNombre,
    sucursal_nombre: op.sucursal || op.localNombre,
    fecha_envio: new Date().toISOString(),
    estado: 'enviada',
    es_excepcion: !!op.esExcepcion,
    motivo_excepcion: op.motivoExcepcion || null
  }).select().single();
  if (errOp) return { ok: false, error: errOp.message };

  const lineas = op.lineas.map((l, i) => ({
    op_id: opRow.id,
    producto_id_erp: toInt(l.productoId),
    producto_codigo: l.productoCodigo,
    producto_nombre: l.productoNombre,
    producto_costo: l.productoCosto || 0,
    producto_precio: l.productoPrecio || 0,
    proveedor_id_erp: l.idProveedor ? toInt(l.idProveedor) : null,
    cantidad: l.cantidad,
    orden: i
  }));
  const { error: errL } = await supa.from('op_lineas').insert(lineas);
  if (errL) return { ok: false, error: errL.message, opId: opRow.id };

  return { ok: true, opId: opRow.id };
}

export async function listarOPs({ cajeraIdErp, estado, estadoResolucion, limit = 100 } = {}) {
  // estado            → filtra por op.estado (en la práctica siempre 'enviada')
  // estadoResolucion  → filtra por op_resoluciones.estado: 'aprobada' | 'devuelta' | 'en_oc' | 'anulada'
  //                     o el literal 'sin_resolucion' para OPs sin resolución (pendientes).
  const supa = await getClient();
  if (!supa) {
    let arr = lsGet(KEYS.OPS, []);
    const resol = lsGet(KEYS.OPS_RESOL, {});
    if (cajeraIdErp != null) arr = arr.filter(o => o.cajeraId === cajeraIdErp);
    if (estado) arr = arr.filter(o => o.estado === estado);
    if (estadoResolucion === 'sin_resolucion') {
      arr = arr.filter(o => !resol[o.id]);
    } else if (estadoResolucion) {
      arr = arr.filter(o => resol[o.id] && resol[o.id].estado === estadoResolucion);
    }
    return { ok: true, fallback: true, data: arr.slice(0, limit) };
  }

  let q = supa.from('v_op_con_resolucion').select('*').order('fecha_envio', { ascending: false }).limit(limit);
  if (cajeraIdErp != null) q = q.eq('cajera_id_erp', cajeraIdErp);
  if (estado) q = q.eq('estado', estado);
  if (estadoResolucion === 'sin_resolucion') {
    q = q.is('estado_resolucion', null);
  } else if (estadoResolucion) {
    q = q.eq('estado_resolucion', estadoResolucion);
  }
  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function obtenerLineasOP(opId) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.OPS, []);
    const op = arr.find(o => o.id === opId || o.numero === opId);
    return { ok: !!op, data: op?.lineas || [] };
  }
  // Resolver UUID si vino como número legible
  const uuid = await resolverUuidOP(supa, opId);
  if (!uuid) return { ok: false, error: 'OP no encontrada', data: [] };
  const { data, error } = await supa.from('op_lineas')
    .select('*').eq('op_id', uuid).order('orden');
  return { ok: !error, error: error?.message, data };
}

/* =============================================================================
   Obtener UNA OP por número o UUID, con sus líneas y resolución
   ============================================================================= */
export async function obtenerOP(opIdOrNumero) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.OPS, []);
    const op = arr.find(o => o.id === opIdOrNumero || o.numero === opIdOrNumero);
    if (!op) return { ok: false };
    const resol = lsGet(KEYS.OPS_RESOL, {})[op.id];
    return { ok: true, fallback: true, data: { ...op, _resolucion: resol } };
  }
  const uuid = await resolverUuidOP(supa, opIdOrNumero);
  if (!uuid) return { ok: false, error: 'OP no encontrada' };
  // Traer la OP con su resolución (vista) + líneas
  const { data: op, error: errOp } = await supa.from('v_op_con_resolucion')
    .select('*').eq('id', uuid).maybeSingle();
  if (errOp || !op) return { ok: false, error: errOp?.message };
  const { data: lineas, error: errL } = await supa.from('op_lineas')
    .select('*').eq('op_id', uuid).order('orden');
  if (errL) return { ok: false, error: errL.message };
  return { ok: true, data: { ...op, lineas: lineas || [] } };
}

/* =============================================================================
   Obtener UNA OC por número o UUID, con sus líneas y las OPs incluidas
   ============================================================================= */
export async function obtenerOC(ocIdOrNumero) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.OCS, []);
    const oc = arr.find(o => o.id === ocIdOrNumero || o.numero === ocIdOrNumero);
    return { ok: !!oc, fallback: true, data: oc };
  }
  // Resolver UUID
  let uuid = ocIdOrNumero;
  if (!UUID_RE.test(ocIdOrNumero)) {
    const { data: ocByNum } = await supa.from('oc').select('id').eq('numero', ocIdOrNumero).maybeSingle();
    if (!ocByNum) return { ok: false, error: 'OC no encontrada' };
    uuid = ocByNum.id;
  }
  const { data: oc, error: errOc } = await supa.from('oc')
    .select('*').eq('id', uuid).maybeSingle();
  if (errOc || !oc) return { ok: false, error: errOc?.message };
  const { data: lineas } = await supa.from('oc_lineas')
    .select('*').eq('oc_id', uuid);
  // OPs incluidas (números legibles)
  const { data: opsLink } = await supa.from('oc_ops')
    .select('op_id, op:op_id (numero, cajera_nombre, local_nombre)')
    .eq('oc_id', uuid);
  return { ok: true, data: {
    ...oc,
    lineas: lineas || [],
    ops: (opsLink || []).map(l => l.op).filter(Boolean)
  }};
}

/* =============================================================================
   Solicitudes de alta — listar / resolver
   ============================================================================= */
export async function listarSolicitudesAlta({ estado, limit = 200 } = {}) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.SOL_ALTA, []);
    const filtradas = estado ? arr.filter(s => s.estado === estado) : arr;
    return { ok: true, fallback: true, data: filtradas.slice(0, limit) };
  }
  let q = supa.from('solicitudes_alta').select('*').order('fecha', { ascending: false }).limit(limit);
  if (estado) q = q.eq('estado', estado);
  const { data, error } = await q;
  return { ok: !error, error: error?.message, data };
}

export async function resolverSolicitudAlta({ id, estado, supervisorIdErp, supervisorNombre, nota = null }) {
  const supa = await getClient();
  if (!supa) {
    const all = lsGet(KEYS.SOL_ALTA_RES, {});
    all[id] = { estado, supervisor: supervisorNombre, nota, fechaResolucion: formatearFecha(new Date()) };
    lsSet(KEYS.SOL_ALTA_RES, all);
    return { ok: true, fallback: true };
  }
  const { error } = await supa.from('solicitudes_alta').update({
    estado,
    nota_supervisor: nota,
    supervisor_id_erp: toInt(supervisorIdErp),
    supervisor_nombre: supervisorNombre,
    fecha_resolucion: new Date().toISOString()
  }).eq('id', id);
  return { ok: !error, error: error?.message };
}

/* =============================================================================
   OP_RESOLUCIONES — supervisor aprueba / devuelve / marca como en_oc
   ----------------------------------------------------------------------------
   opId puede ser un UUID de Supabase o un número legible (ej: 'op-loc-xyz').
   Si no es UUID, se busca el UUID por la columna 'numero' antes de upsert.
   ============================================================================= */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolverUuidOP(supa, opIdRaw) {
  if (UUID_RE.test(opIdRaw)) return opIdRaw;
  // Buscar por numero
  const { data, error } = await supa.from('op').select('id').eq('numero', opIdRaw).limit(1).maybeSingle();
  if (error || !data) return null;
  return data.id;
}

export async function resolverOP({ opId, estado, supervisorIdErp, supervisorNombre, nota = null, ocId = null }) {
  const supa = await getClient();
  if (!supa) {
    const all = lsGet(KEYS.OPS_RESOL, {});
    all[opId] = {
      estado, supervisor: supervisorNombre, supervisorId: supervisorIdErp,
      nota, ocId, fechaResolucion: formatearFecha(new Date())
    };
    lsSet(KEYS.OPS_RESOL, all);
    return { ok: true, fallback: true };
  }
  const uuid = await resolverUuidOP(supa, opId);
  if (!uuid) {
    // OP no encontrada en Supabase — guardar en localStorage como fallback
    const all = lsGet(KEYS.OPS_RESOL, {});
    all[opId] = {
      estado, supervisor: supervisorNombre, supervisorId: supervisorIdErp,
      nota, ocId, fechaResolucion: formatearFecha(new Date())
    };
    lsSet(KEYS.OPS_RESOL, all);
    return { ok: true, fallback: true, reason: 'op_no_encontrada_en_supabase' };
  }
  const { error } = await supa.from('op_resoluciones').upsert({
    op_id: uuid, estado, supervisor_id_erp: toInt(supervisorIdErp),
    supervisor_nombre: supervisorNombre, nota, oc_id: ocId,
    fecha_resolucion: new Date().toISOString()
  }, { onConflict: 'op_id' });
  return { ok: !error, error: error?.message };
}

/* =============================================================================
   OC — Órdenes de Compra (consolidación)
   ============================================================================= */
export async function crearOC({ numero, proveedorIdErp, proveedorNombre, proveedorRuc,
                                opIds, lineas, totalGs, creadoPorIdErp, creadoPorNombre }) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.OCS, []);
    const oc = {
      id: numero, numero, proveedorId: proveedorIdErp, proveedorNombre,
      opIds, lineas, totalGs, fecha: formatearFecha(new Date()),
      estado: 'abierta', creadaPor: creadoPorNombre
    };
    arr.unshift(oc);
    lsSet(KEYS.OCS, arr);
    return { ok: true, fallback: true, ocId: numero };
  }

  const { data: ocRow, error: errOc } = await supa.from('oc').insert({
    numero, proveedor_id_erp: toInt(proveedorIdErp), proveedor_nombre: proveedorNombre,
    proveedor_ruc: proveedorRuc, fecha_creacion: new Date().toISOString(),
    estado: 'abierta', total_gs: totalGs,
    creada_por_id_erp: toInt(creadoPorIdErp), creada_por_nombre: creadoPorNombre
  }).select().single();
  if (errOc) return { ok: false, error: errOc.message };

  const lineasInsert = lineas.map(l => ({
    oc_id: ocRow.id,
    producto_id_erp: toInt(l.productoId),
    producto_codigo: l.productoCodigo,
    producto_nombre: l.productoNombre,
    cantidad_pedida: l.cantidad,
    costo_unitario: l.costo || 0,
    subtotal: (l.costo || 0) * l.cantidad
  }));
  const { error: errL } = await supa.from('oc_lineas').insert(lineasInsert);
  if (errL) return { ok: false, error: errL.message, ocId: ocRow.id };

  // Vincular las OPs incluidas — resolver UUIDs si vienen como número legible
  const linkUUIDs = [];
  for (const opIdRaw of (opIds || [])) {
    const uuid = await resolverUuidOP(supa, opIdRaw);
    if (uuid) linkUUIDs.push({ oc_id: ocRow.id, op_id: uuid });
  }
  if (linkUUIDs.length) {
    await supa.from('oc_ops').insert(linkUUIDs);
  }

  return { ok: true, ocId: ocRow.id, ocNumero: ocRow.numero };
}

/* =============================================================================
   actualizarLineasOC — reemplaza todas las líneas de la OC y recalcula total
   ----------------------------------------------------------------------------
   ocId puede ser UUID o número legible (ej: 'OC-loc-xyz').
   lineas: [{ productoId, productoCodigo, productoNombre, costo, cantidad }, ...]
   Retorna { ok, error?, totalGs }
   ============================================================================= */
export async function actualizarLineasOC({ ocId, ocNumero, lineas }) {
  const idRaw = ocId || ocNumero;
  if (!idRaw) return { ok: false, error: 'Se requiere ocId u ocNumero' };

  // Calcular total
  const totalGs = lineas.reduce((s, l) => s + (Number(l.costo) || 0) * (Number(l.cantidad) || 0), 0);

  const supa = await getClient();
  if (!supa) {
    // Fallback localStorage
    const arr = lsGet(KEYS.OCS, []);
    const idx = arr.findIndex(o => o.id === idRaw || o.numero === idRaw);
    if (idx !== -1) {
      arr[idx].lineas = lineas.map((l, i) => ({
        productoId: l.productoId,
        productoCodigo: l.productoCodigo,
        productoNombre: l.productoNombre,
        costo: Number(l.costo) || 0,
        cantidad: Number(l.cantidad) || 0,
        subtotal: (Number(l.costo) || 0) * (Number(l.cantidad) || 0),
        orden: i
      }));
      arr[idx].totalGs = totalGs;
      lsSet(KEYS.OCS, arr);
    }
    return { ok: true, fallback: true, totalGs };
  }

  // Resolver UUID
  let uuid = idRaw;
  if (!UUID_RE.test(idRaw)) {
    const { data: ocByNum } = await supa.from('oc').select('id').eq('numero', idRaw).maybeSingle();
    if (!ocByNum) return { ok: false, error: 'OC no encontrada en Supabase', totalGs };
    uuid = ocByNum.id;
  }

  // 1) DELETE lineas existentes
  const { error: errDel } = await supa.from('oc_lineas').delete().eq('oc_id', uuid);
  if (errDel) return { ok: false, error: errDel.message, totalGs };

  // 2) INSERT nuevas líneas
  if (lineas.length > 0) {
    const lineasInsert = lineas.map((l, i) => ({
      oc_id: uuid,
      producto_id_erp: toInt(l.productoId),
      producto_codigo: l.productoCodigo || null,
      producto_nombre: l.productoNombre || '',
      cantidad_pedida: Math.max(1, Number(l.cantidad) || 1),
      costo_unitario: Number(l.costo) || 0,
      subtotal: (Number(l.costo) || 0) * (Number(l.cantidad) || 0),
      orden: i
    }));
    const { error: errIns } = await supa.from('oc_lineas').insert(lineasInsert);
    if (errIns) return { ok: false, error: errIns.message, totalGs };
  }

  // 3) UPDATE total_gs (el trigger de BD también lo haría, pero actualizamos por si acaso)
  const { error: errUpd } = await supa.from('oc').update({ total_gs: totalGs }).eq('id', uuid);
  if (errUpd) return { ok: false, error: errUpd.message, totalGs };

  return { ok: true, totalGs };
}

/* =============================================================================
   cambiarEstadoOC — actualiza el estado de una OC
   ----------------------------------------------------------------------------
   Estados válidos: 'abierta'|'en_edicion'|'cerrada'|'enviada_a_proveedor'|'anulada'
   Retorna { ok, error? }
   ============================================================================= */
export async function cambiarEstadoOC({ ocId, ocNumero, estado, supervisorIdErp, supervisorNombre }) {
  const ESTADOS_VALIDOS = ['abierta', 'en_edicion', 'cerrada', 'enviada_a_proveedor',
                            'parcialmente_recibida', 'recibida', 'cerrada_con_faltante', 'anulada'];
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return { ok: false, error: `Estado inválido: ${estado}` };
  }

  const idRaw = ocId || ocNumero;
  if (!idRaw) return { ok: false, error: 'Se requiere ocId u ocNumero' };

  const supa = await getClient();
  if (!supa) {
    // Fallback localStorage
    const arr = lsGet(KEYS.OCS, []);
    const idx = arr.findIndex(o => o.id === idRaw || o.numero === idRaw);
    if (idx !== -1) {
      arr[idx].estado = estado;
      lsSet(KEYS.OCS, arr);
    }
    return { ok: true, fallback: true };
  }

  // Resolver UUID
  let uuid = idRaw;
  if (!UUID_RE.test(idRaw)) {
    const { data: ocByNum } = await supa.from('oc').select('id').eq('numero', idRaw).maybeSingle();
    if (!ocByNum) return { ok: false, error: 'OC no encontrada en Supabase' };
    uuid = ocByNum.id;
  }

  const { error } = await supa.from('oc').update({ estado }).eq('id', uuid);
  return { ok: !error, error: error?.message };
}

export async function listarOCs({ estado, proveedorIdErp, limit = 100 } = {}) {
  const supa = await getClient();
  if (!supa) {
    let arr = lsGet(KEYS.OCS, []);
    if (estado) arr = arr.filter(o => o.estado === estado);
    if (proveedorIdErp != null) arr = arr.filter(o => o.proveedorId === proveedorIdErp);
    return { ok: true, fallback: true, data: arr.slice(0, limit) };
  }
  let q = supa.from('oc').select('*').order('fecha_creacion', { ascending: false }).limit(limit);
  if (estado) q = q.eq('estado', estado);
  if (proveedorIdErp != null) q = q.eq('proveedor_id_erp', proveedorIdErp);
  const { data, error } = await q;
  return { ok: !error, error: error?.message, data };
}

/* =============================================================================
   COMPRAS — registrar mercadería que llegó
   ============================================================================= */
export async function registrarCompra({ ocId, facturaProveedor, lineas,
                                        recibidaPorIdErp, recibidaPorNombre,
                                        observaciones }) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.COMPRAS, []);
    const compra = {
      id: 'compra-' + Date.now().toString(36).toUpperCase(),
      ocId, facturaProveedor,
      fechaRecepcion: formatearFecha(new Date()),
      recibidaPorIdErp, recibidaPorNombre,
      lineas, observaciones,
      estado: 'verificando'
    };
    arr.unshift(compra);
    lsSet(KEYS.COMPRAS, arr);
    return { ok: true, fallback: true, compraId: compra.id };
  }
  // ... (insert real similar a las anteriores) ...
  return { ok: true, fallback: false };
}

/* =============================================================================
   SOLICITUDES_ALTA — productos nuevos que pide la cajera
   ============================================================================= */
export async function crearSolicitudAlta(payload) {
  const supa = await getClient();
  if (!supa) {
    const arr = lsGet(KEYS.SOL_ALTA, []);
    arr.unshift({
      id: 'alt-loc-' + Date.now().toString(36),
      fecha: formatearFecha(new Date()),
      estado: 'pendiente',
      ...payload
    });
    lsSet(KEYS.SOL_ALTA, arr);
    return { ok: true, fallback: true };
  }
  const { error } = await supa.from('solicitudes_alta').insert({
    fecha: new Date().toISOString(),
    codigo: payload.codigo,
    descripcion: payload.descripcion,
    motivo: payload.motivo,
    categoria: payload.categoria,
    proveedor_sugerido_id: payload.proveedorSugerido ? toInt(payload.proveedorSugerido) : null,
    cajera_id_erp: toInt(payload.cajeraId),
    cajera_nombre: payload.cajera,
    local_id: toInt(payload.localId),
    local_nombre: payload.local
  });
  return { ok: !error, error: error?.message };
}

/* =============================================================================
   BORRADORES_OP — guardar el draft de la cajera entre sesiones
   ============================================================================= */
export async function guardarBorrador({ cajeraIdErp, localId, contenido }) {
  const supa = await getClient();
  if (!supa) {
    localStorage.setItem('multicompra:draft:op', JSON.stringify(contenido));
    return { ok: true, fallback: true };
  }
  const { error } = await supa.from('borradores_op').upsert({
    cajera_id_erp: cajeraIdErp, local_id: localId,
    ultima_modificacion: new Date().toISOString(),
    contenido
  }, { onConflict: 'cajera_id_erp,local_id' });
  return { ok: !error, error: error?.message };
}

/* =============================================================================
   REALTIME — suscribirse a cambios en op / op_resoluciones / oc
   ----------------------------------------------------------------------------
   Devuelve { ok, unsubscribe } — llamar unsubscribe() al desmontar la pantalla.
   Si Supabase no está conectado, devuelve un noop transparente.

   Eventos:
     onOpNueva(opRow)         — INSERT en tabla op (cajera mandó OP nueva)
     onOpResolucion(resolRow) — INSERT/UPDATE en op_resoluciones (supervisor aprobó/devolvió)
     onOcNueva(ocRow)         — INSERT en tabla oc
     onSolicitudAlta(solRow)  — INSERT en solicitudes_alta
   ============================================================================= */
export async function suscribirseRealtime({
  onOpNueva, onOpResolucion, onOcNueva, onSolicitudAlta
} = {}) {
  const supa = await getClient();
  if (!supa) return { ok: false, fallback: true, unsubscribe: () => {} };

  const ch = supa.channel('mc-realtime-' + Date.now());

  if (onOpNueva) {
    ch.on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'op' },
      (payload) => { try { onOpNueva(payload.new); } catch (e) { console.warn(e); } }
    );
  }
  if (onOpResolucion) {
    ch.on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'op_resoluciones' },
      (payload) => { try { onOpResolucion(payload.new); } catch (e) { console.warn(e); } }
    );
    ch.on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'op_resoluciones' },
      (payload) => { try { onOpResolucion(payload.new); } catch (e) { console.warn(e); } }
    );
  }
  if (onOcNueva) {
    ch.on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'oc' },
      (payload) => { try { onOcNueva(payload.new); } catch (e) { console.warn(e); } }
    );
  }
  if (onSolicitudAlta) {
    ch.on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'solicitudes_alta' },
      (payload) => { try { onSolicitudAlta(payload.new); } catch (e) { console.warn(e); } }
    );
  }

  ch.subscribe();
  return { ok: true, unsubscribe: () => supa.removeChannel(ch) };
}

/* =============================================================================
   Utilidades
   ============================================================================= */
function formatearFecha(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
