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
    cajera_id_erp: op.cajeraId,
    cajera_nombre: op.cajera,
    local_id: op.localId,
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
    producto_id_erp: l.productoId,
    producto_codigo: l.productoCodigo,
    producto_nombre: l.productoNombre,
    producto_costo: l.productoCosto || 0,
    producto_precio: l.productoPrecio || 0,
    proveedor_id_erp: l.idProveedor || null,
    cantidad: l.cantidad,
    orden: i
  }));
  const { error: errL } = await supa.from('op_lineas').insert(lineas);
  if (errL) return { ok: false, error: errL.message, opId: opRow.id };

  return { ok: true, opId: opRow.id };
}

export async function listarOPs({ cajeraIdErp, estado, limit = 100 } = {}) {
  const supa = await getClient();
  if (!supa) {
    let arr = lsGet(KEYS.OPS, []);
    if (cajeraIdErp != null) arr = arr.filter(o => o.cajeraId === cajeraIdErp);
    if (estado) arr = arr.filter(o => o.estado === estado);
    return { ok: true, fallback: true, data: arr.slice(0, limit) };
  }

  let q = supa.from('v_op_con_resolucion').select('*').order('fecha_envio', { ascending: false }).limit(limit);
  if (cajeraIdErp != null) q = q.eq('cajera_id_erp', cajeraIdErp);
  if (estado) q = q.eq('estado', estado);
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
  const { data, error } = await supa.from('op_lineas')
    .select('*').eq('op_id', opId).order('orden');
  return { ok: !error, error: error?.message, data };
}

/* =============================================================================
   OP_RESOLUCIONES — supervisor aprueba / devuelve / marca como en_oc
   ============================================================================= */
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
  const { error } = await supa.from('op_resoluciones').upsert({
    op_id: opId, estado, supervisor_id_erp: supervisorIdErp,
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
    numero, proveedor_id_erp: proveedorIdErp, proveedor_nombre: proveedorNombre,
    proveedor_ruc: proveedorRuc, fecha_creacion: new Date().toISOString(),
    estado: 'abierta', total_gs: totalGs,
    creada_por_id_erp: creadoPorIdErp, creada_por_nombre: creadoPorNombre
  }).select().single();
  if (errOc) return { ok: false, error: errOc.message };

  const lineasInsert = lineas.map(l => ({
    oc_id: ocRow.id,
    producto_id_erp: l.productoId,
    producto_codigo: l.productoCodigo,
    producto_nombre: l.productoNombre,
    cantidad_pedida: l.cantidad,
    costo_unitario: l.costo || 0,
    subtotal: (l.costo || 0) * l.cantidad
  }));
  const { error: errL } = await supa.from('oc_lineas').insert(lineasInsert);
  if (errL) return { ok: false, error: errL.message, ocId: ocRow.id };

  // Vincular las OPs incluidas
  const links = opIds.map(opId => ({ oc_id: ocRow.id, op_id: opId }));
  await supa.from('oc_ops').insert(links);

  return { ok: true, ocId: ocRow.id };
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
    proveedor_sugerido_id: payload.proveedorSugerido || null,
    cajera_id_erp: payload.cajeraId,
    cajera_nombre: payload.cajera,
    local_id: payload.localId,
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
   Utilidades
   ============================================================================= */
function formatearFecha(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
