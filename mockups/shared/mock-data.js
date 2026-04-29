// =========================================================================
// MultiCompra — Datos mock
// Módulo ES6. Usar con <script type="module"> + import { ... } from './shared/mock-data.js'
// =========================================================================

// Usuaria actual (supervisora, única en el sistema)
export const currentUser = {
  id: 'user-shirley',
  nombre: 'Shirley',
  rol: 'supervisor',
  iniciales: 'SH'
};

// Cajera actual para mockups de experiencia cajera
// (está asignada a un local en su perfil; no elige local al cargar OP)
export const cajeraActual = {
  id: 'user-carolina',
  nombre: 'Carolina',
  rol: 'cajera',
  iniciales: 'CA',
  localId: 'loc-10',
  localNombre: 'Shopping del Sol',
  localCodigo: 'SDS'
};

// Proveedor asignado a la OC
export const proveedor = {
  id: 'prov-01',
  nombre: 'Distribuidora Celular Plus S.A.',
  ruc: '80012345-6',
  contacto: 'Marcelo Ayala',
  telefono: '+595981123456'
};

// Proveedores disponibles para asignar a una OC nueva (Decisión 3: 1 OC = 1 proveedor)
export const proveedores = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// OPs pendientes (estado 'enviada') — disponibles para agrupar en una OC nueva
// NO se mezclan con las OPs ya agrupadas en OC-0042 (op-1042 a op-1046).
// Casos sembrados:
//   - 5 locales distintos (SHM, CDE, LAM, CAP, LUQ, ENC, FDM, VM)
//   - 2 OPs marcadas como excepción con motivo
//   - 2 OPs "viejas" (más de 7 días sin procesar)
//   - Variedad en cantidad de productos
// =========================================================================
export const cajerasPorLocal = {
  'loc-01': 'Romina',
  'loc-02': 'Nélida',
  'loc-03': 'Paola',
  'loc-04': 'Clara',
  'loc-05': 'Gisela',
  'loc-06': 'Andrea',
  'loc-07': 'Mirta',
  'loc-08': 'Fátima',
  'loc-09': 'Jessica',
  'loc-10': 'Carolina'
};

export const opsPendientes = []; // VACIADO — ver historial git para datos de prueba

// Locales: los 10 de la cadena
// Campos extendidos (dirección, ciudad, teléfono, estado, cajeras) usados en admin/config/locales.
export const locales = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// Catálogo de productos (25 productos realistas: accesorios celulares)
// `stockPorLocal`: stock actual en cada local (snapshot que trae el SP junto
// con stockCentral cuando se abre la OC). Se usa para que el supervisor vea
// cuánto tiene cada local que pidió el producto.
// `sugeridoPorLocal` (D40): cantidad sugerida por el sistema base del cliente,
// calculada estadísticamente según rotación, ventas y stock actual. Ancla para
// que Shirley decida sin partir de cero. Un valor `null` o ausente significa
// "el sistema base no tiene historial suficiente" → la UI muestra "—" y no
// dispara alerta de sobre/sub pedido para ese local.
// Distribución sembrada:
//   ~60% normal (sugerido ≈ pedido ± 15%)
//   ~20% sobrepedido (cajera pidió de más: sugerido << pedido)
//   ~10% subpedido (cajera pidió de menos: sugerido >> pedido)
//   ~10% sin historial (sugerido null en los locales relevantes)
// =========================================================================
export const productos = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// OPs (Órdenes de Pedido) que se agruparon en la OC
// Casos sembrados deliberadamente:
//   - p02: 3+ locales piden (SHM, VM, SL) → agrupación rica; SL ya tiene 45 → "No necesita"
//   - p04: stock central = 0 → "Comprar" es la única opción viable
//   - p11: stock central = 4, 3 locales piden "Repone central" → alerta (insuficiente)
//   - p14: VM pide 60 y tiene 180 (stock muerto) → "No necesita"
//   - p20: SHM pide 20 y tiene 60 → "No necesita"
// =========================================================================
export const ops = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// OC (Orden de Compra) ejemplo
// Modelo V3: una fila por cada pedido individual (local × producto).
// Cada "pedido" tiene su propia decisión explícita: 'no_necesita' | 'repone_central' | 'comprar'.
// El producto se agrupa visualmente con un encabezado fino; la decisión se toma por pedido.
//
// Campos por pedido:
//   opId, localId, localNombre, localCodigo
//   productoId
//   pidio           (read-only, inmutable)
//   stockLocal      (snapshot al abrir OC)
//   excedente       = stockLocal - pidio
//   decision        : 'no_necesita' | 'repone_central' | 'comprar'
//   cantidadComprar : cantidad efectiva a comprar si decision='comprar'
//   decisionDefault : lo que sugirió el sistema (para detectar edición manual)
//   cantidadComprarDefault : cantidad sugerida por el sistema
// =========================================================================

// Decisión por defecto sugerida por el sistema según stock local y central:
function decisionSugerida(pidio, stockLocal, stockCentral) {
  if (stockLocal >= pidio) {
    // El local ya tiene lo que pidió (o más) → por defecto no hace falta
    return { decision: 'no_necesita', cantidad: 0 };
  }
  const faltante = pidio - stockLocal;
  if (stockCentral > 0) {
    // Hay stock central disponible → sugerir repone_central por defecto
    // (Shirley igual puede decidir comprar si prefiere)
    return { decision: 'repone_central', cantidad: 0 };
  }
  // No hay central → comprar lo que falta al local
  return { decision: 'comprar', cantidad: faltante };
}

// Helper para leer el sugerido por local (D40). Devuelve null si el sistema
// base no tiene historial para ese producto × local.
export function getSugeridoPorLocal(producto, localId) {
  if (!producto || !producto.sugeridoPorLocal) return null;
  const v = producto.sugeridoPorLocal[localId];
  return (v == null) ? null : v;
}

function construirPedidos() {
  const pedidos = [];
  const productosUsados = new Set();
  for (const op of ops) {
    const local = locales.find(l => l.id === op.localId);
    for (const ln of op.lineas) {
      const p = productos.find(pp => pp.id === ln.productoId);
      if (!p) continue;
      productosUsados.add(p.id);
      const stockLocal = (p.stockPorLocal && p.stockPorLocal[op.localId] != null)
        ? p.stockPorLocal[op.localId] : 0;
      const sugerido = decisionSugerida(ln.cantidad, stockLocal, p.stockCentral);
      const sugeridoSistema = getSugeridoPorLocal(p, op.localId);
      pedidos.push({
        opId: op.id,
        localId: op.localId,
        localNombre: op.localNombre,
        localCodigo: local ? local.codigo : '??',
        productoId: p.id,
        pidio: ln.cantidad,
        stockLocal,
        sugerido: sugeridoSistema,       // D40: sugerido del sistema base (o null)
        excedente: stockLocal - ln.cantidad,
        decision: sugerido.decision,
        cantidadComprar: sugerido.cantidad,
        decisionDefault: sugerido.decision,
        cantidadComprarDefault: sugerido.cantidad
      });
    }
  }
  return { pedidos, productosUsados };
}

function construirGrupos(pedidos, productosUsados) {
  // Un grupo por producto usado; trae los pedidos que corresponden.
  return productos
    .filter(p => productosUsados.has(p.id))
    .map(p => ({
      productoId: p.id,
      barras: p.barras,
      nombre: p.nombre,
      costoEstimado: p.costo,
      stockCentral: p.stockCentral,
      pedidos: pedidos.filter(x => x.productoId === p.id)
    }));
}

const _built = construirPedidos();
const _grupos = construirGrupos(_built.pedidos, _built.productosUsados);

export const oc = {
  id: 'oc-0042',
  numero: 'OC-0042',
  estado: 'abierta',
  proveedorId: proveedor.id,
  proveedorNombre: proveedor.nombre,
  creadoPor: 'Shirley',
  fechaCreacion: '2026-04-22 13:55',
  snapshotStockTs: '2026-04-22 14:32',
  opsOrigen: ops.map(op => ({ id: op.id, localNombre: op.localNombre, cajera: op.cajera, fecha: op.fecha })),
  grupos: _grupos
};

// =========================================================================
// Compra actual — vinculada a OC-0042 (estado `en_verificacion`)
// Shirley carga la factura contra la OC y verifica línea por línea.
//
// Cada línea vincula productoId → cantidadEsperada (de la OC, agregada por
// producto: suma de `cantidadComprar` en pedidos con decision='comprar'),
// `costoOC` (costo estimado), `cantidadRecibida` (editable, default = esperada)
// y `costoReal` (editable, default = costoOC).
//
// Casos sembrados:
//   - 60% líneas OK (recibida = esperada, costoReal = costoOC)
//   - 2-3 líneas con menos (faltantes)
//   - 1 línea con más cantidad (sobrante)
//   - 1 línea sin recibir (recibida = 0)
//   - 1 línea con costo real distinto (+10%)
//   - 1-2 líneas "fuera de OC" con justificación
// =========================================================================

// Helper: agregar líneas de compra a partir de los grupos de la OC.
// Para el mockup asumimos que la OC ya cerró con una cantidad "a comprar"
// por producto. Si el default del sistema puso 'comprar' en algún pedido,
// sumamos esas cantidades. Si no (ej. todos en 'repone_central' por default),
// simulamos que Shirley decidió comprar igualmente una porción del grupo
// para que esta pantalla tenga volumen suficiente para mostrar el caso.
function construirLineasCompra() {
  const lineas = [];
  oc.grupos.forEach((g) => {
    let esperada = g.pedidos.reduce(
      (s, p) => s + (p.decision === 'comprar' ? (p.cantidadComprar || 0) : 0),
      0
    );
    let opIds = g.pedidos
      .filter(p => p.decision === 'comprar' && p.cantidadComprar > 0)
      .map(p => p.opId);
    // Fallback: si la OC no tiene nada a comprar en este producto,
    // simulamos que el supervisor igual decidió comprar una parte
    // (solo para el mock — da variedad de líneas).
    if (esperada <= 0) {
      const totalPedido = g.pedidos.reduce((s, p) => s + (p.pidio || 0), 0);
      esperada = Math.max(1, Math.ceil(totalPedido * 0.5));
      opIds = g.pedidos.slice(0, 2).map(p => p.opId);
    }
    lineas.push({
      id: `cmp-l-${g.productoId}`,
      productoId: g.productoId,
      barras: g.barras,
      nombre: g.nombre,
      cantidadEsperada: esperada,
      cantidadRecibida: esperada,       // default = lo esperado
      costoOC: g.costoEstimado,          // costo estimado en la OC
      costoReal: g.costoEstimado,        // default = costo OC
      justificacion: null,                // { tipo, texto } si edita
      fueraDeOC: false,
      opIdsOrigen: opIds
    });
  });
  return lineas;
}

const _lineasCompra = construirLineasCompra();

// Sembrar variedad: modificar algunas líneas en sitio según el orden en que
// aparecen (hay ~14-15 productos a comprar). Índices elegidos para que queden
// repartidos visualmente.
if (_lineasCompra.length > 0) {
  // Faltantes (menos cantidad)
  if (_lineasCompra[1]) {
    _lineasCompra[1].cantidadRecibida = Math.max(0, _lineasCompra[1].cantidadEsperada - 5);
    _lineasCompra[1].justificacion = { tipo: 'faltante', texto: 'Proveedor dijo que completa la semana que viene.' };
  }
  if (_lineasCompra[3]) {
    _lineasCompra[3].cantidadRecibida = Math.max(0, Math.floor(_lineasCompra[3].cantidadEsperada * 0.6));
    _lineasCompra[3].justificacion = { tipo: 'faltante', texto: 'Lote quedó sin procesar en depósito.' };
  }
  if (_lineasCompra[6]) {
    _lineasCompra[6].cantidadRecibida = Math.max(0, _lineasCompra[6].cantidadEsperada - 3);
    _lineasCompra[6].justificacion = { tipo: 'faltante', texto: 'Vinieron 3 unidades con embalaje dañado, quedaron.' };
  }
  // Sobrante (más cantidad)
  if (_lineasCompra[2]) {
    _lineasCompra[2].cantidadRecibida = _lineasCompra[2].cantidadEsperada + 2;
    _lineasCompra[2].justificacion = { tipo: 'sobrante', texto: 'Bonificación del proveedor.' };
  }
  // Sin recibir
  if (_lineasCompra[5]) {
    _lineasCompra[5].cantidadRecibida = 0;
    _lineasCompra[5].justificacion = { tipo: 'faltante', texto: 'Proveedor avisó que no tiene stock, manda el mes que viene.' };
  }
  // Costo real distinto (+10%)
  if (_lineasCompra[4]) {
    _lineasCompra[4].costoReal = Math.round(_lineasCompra[4].costoOC * 1.10);
  }
}

// Líneas "fuera de OC" (producto físico que vino sin estar pedido)
// Aprovechamos productos no usados en la OC para evitar choques de productoId.
const _fueraOC = [];
const _usadosEnCompra = new Set(_lineasCompra.map(l => l.productoId));
const _candidatosFuera = productos.filter(p => !_usadosEnCompra.has(p.id));
if (_candidatosFuera[0]) {
  const p = _candidatosFuera[0];
  _fueraOC.push({
    id: `cmp-l-fuera-${p.id}`,
    productoId: p.id,
    barras: p.barras,
    nombre: p.nombre,
    cantidadEsperada: 0,
    cantidadRecibida: 6,
    costoOC: 0,
    costoReal: p.costo,
    justificacion: { tipo: 'producto_distinto', texto: 'Proveedor mandó de más como bonificación por ser cliente frecuente.' },
    fueraDeOC: true,
    opIdsOrigen: []
  });
}
if (_candidatosFuera[1]) {
  const p = _candidatosFuera[1];
  _fueraOC.push({
    id: `cmp-l-fuera-${p.id}`,
    productoId: p.id,
    barras: p.barras,
    nombre: p.nombre,
    cantidadEsperada: 0,
    cantidadRecibida: 3,
    costoOC: 0,
    costoReal: p.costo,
    justificacion: { tipo: 'otro', texto: 'Aprovechamos el viaje del proveedor para traer esto extra.' },
    fueraDeOC: true,
    opIdsOrigen: []
  });
}

// Total factura calculado a partir de las líneas (esto lo cargaría Shirley).
// Lo seteamos levemente distinto del subtotal para mostrar la alerta visual.
function _sumaLineas(lns) {
  return lns.reduce((s, l) => s + (l.cantidadRecibida * l.costoReal), 0);
}
const _subtotalTodo = _sumaLineas([..._lineasCompra, ..._fueraOC]);
// Diferencia deliberada: +12.500 Gs para que aparezca el chip rojo.
const _totalFacturaSembrado = _subtotalTodo + 12500;

export const compraActual = {
  id: 'comp-0017',
  numero: 'COMP-0017',
  ocId: oc.id,
  ocNumero: oc.numero,
  estado: 'en_verificacion',
  fechaCreacion: '2026-04-22 09:10',
  proveedor: {
    ruc: proveedor.ruc,
    nombre: proveedor.nombre
  },
  // Datos de la factura física que Shirley carga
  factura: {
    ruc: proveedor.ruc,
    nombreProveedor: proveedor.nombre,
    fecha: '2026-04-22',
    nroComprobante: '001-001-0045789',
    timbrado: '16552843',
    total: _totalFacturaSembrado
  },
  lineas: [..._lineasCompra, ..._fueraOC]
};

// =========================================================================
// Admin actual (Diego, dueño)
// =========================================================================
export const adminActual = {
  id: 'user-diego',
  nombre: 'Diego',
  rol: 'admin',
  iniciales: 'DG'
};

// =========================================================================
// Historial de OPs de Carolina (cajera de Shopping del Sol)
// Variedad de estados y fechas para poblar la pantalla /cajera/op/historial.
// Estados posibles: 'borrador' | 'enviada' | 'en_oc' | 'cerrada' | 'devuelta' | 'anulada'
// =========================================================================
export const historialCajera = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// Dashboard Admin — datos mock para la vista mobile-first
// Números plausibles para una cadena de 10 locales + central.
// =========================================================================
export const dashboardAdmin = {
  periodo: 'Abril 2026',

  // KPIs principales del mes (con delta vs mes pasado)
  kpis: {
    opsMes:          { valor: 28,        deltaPct:  12, direccion: 'up'   },
    ocsCerradasMes:  { valor:  6,        deltaPct:  20, direccion: 'up'   },
    gsGastadosMes:   { valor: 18_450_000, deltaPct:  -5, direccion: 'down' },
    stockMuertoEvitado: { valor: 4_220_000, deltaPct: 18, direccion: 'up' }
  },

  // Alertas accionables
  alertas: [
    {
      id: 'alert-1',
      tipo: 'op-vieja',
      mensaje: '3 OPs pendientes hace más de 7 días',
      detalle: 'Villa Morra, Ciudad del Este, Shopping Mcal.',
      severidad: 'warning',
      link: '#'
    },
    {
      id: 'alert-2',
      tipo: 'compra-error',
      mensaje: '1 Compra en error de sincronización',
      detalle: 'COMP-0017 — no impactó stock en API base',
      severidad: 'danger',
      link: '#'
    },
    {
      id: 'alert-3',
      tipo: 'stock-bajo',
      mensaje: 'Stock central bajo en 5 productos',
      detalle: 'Funda iPhone 13, Cable USB-C 2m y 3 más',
      severidad: 'warning',
      link: '#'
    }
  ],

  // Factor de ajuste promedio del supervisor respecto de lo pedido por cada cajera.
  // 100% = pidió lo justo; 60% = le bajaron 40% de lo que pedía.
  ajustePorCajera: [
    { cajera: 'Carolina', localCodigo: 'SDS', factor: 95 },
    { cajera: 'Romina',   localCodigo: 'SHM', factor: 88 },
    { cajera: 'Andrea',   localCodigo: 'FDM', factor: 84 },
    { cajera: 'Nélida',   localCodigo: 'VM',  factor: 78 },
    { cajera: 'Clara',    localCodigo: 'SL',  factor: 71 },
    { cajera: 'Lucía',    localCodigo: 'LAM', factor: 62 }
  ],

  // OPs fuera de protocolo (excepción) por cajera este mes
  excepcionesPorCajera: [
    { cajera: 'Carolina', count: 2 },
    { cajera: 'Lucía',    count: 5 },
    { cajera: 'Romina',   count: 1 },
    { cajera: 'Mirta',    count: 3 },
    { cajera: 'Andrea',   count: 0 }
  ],

  // Reposición desde central
  reposicionCentral: {
    productos: 12,
    evitoCompras: 3_180_000,
    tendencia: [2, 4, 3, 5, 6, 7, 9, 12] // por semana (8 últimas)
  },

  // Timeline de actividad reciente
  actividadReciente: [
    { id: 'act-1', mensaje: 'Shirley cerró OC-0042 con Accesorios Amambay', hace: 'hace 2h' },
    { id: 'act-2', mensaje: 'Carolina envió OP-1055',                       hace: 'hace 4h' },
    { id: 'act-3', mensaje: 'Compra COMP-0017 en error de sincronización',  hace: 'hace 1 día', severidad: 'danger' },
    { id: 'act-4', mensaje: 'Shirley devolvió OP-1053 a Nélida',            hace: 'hace 1 día' },
    { id: 'act-5', mensaje: 'Nueva OC-0041 creada (Distribuidora Celular Plus)', hace: 'hace 2 días' }
  ]
};

// =========================================================================
// OCs históricas — listado para /supervisor/oc
// Estados posibles: 'abierta' | 'en_edicion' | 'cerrada' | 'enviada_a_proveedor'
//                   | 'parcialmente_recibida' | 'recibida' | 'cerrada_con_faltante' | 'anulada'
// La OC-0042 actual (abierta) aparece primero; el resto son del histórico
// de los últimos 3 meses con variedad de estados y proveedores.
// =========================================================================
export const ocsHistorico = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// Compras históricas — listado para /supervisor/compra
// Estados posibles: 'precargada' | 'en_verificacion' | 'con_diferencias'
//                   | 'confirmada' | 'error_sincronizacion' | 'anulada'
// =========================================================================
export const comprasHistorico = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// Auditoría / timeline de eventos por entidad
// Eventos genéricos: 'creada', 'enviada', 'devuelta', 'en_oc', 'cerrada',
// 'enviada_a_proveedor', 'recibida', 'anulada', etc.
// =========================================================================
export const auditoria = {
  // OPs pendientes — eventos de ciclo corto
  'op-1043': [
    { ts: '2026-04-20 11:02', actor: 'Nélida',  evento: 'creada',  detalle: 'OP creada en estado borrador.' },
    { ts: '2026-04-20 11:10', actor: 'Nélida',  evento: 'enviada', detalle: 'OP enviada al supervisor.' },
    { ts: '2026-04-22 13:55', actor: 'Shirley', evento: 'en_oc',   detalle: 'Incluida en OC-0042.' }
  ],
  'op-1047': [
    { ts: '2026-04-22 08:15', actor: 'Andrea',  evento: 'creada',  detalle: 'OP creada en estado borrador.' },
    { ts: '2026-04-22 08:30', actor: 'Andrea',  evento: 'enviada', detalle: 'OP enviada al supervisor.' }
  ],
  'op-1048': [
    { ts: '2026-04-22 09:00', actor: 'Mirta',   evento: 'creada',  detalle: 'OP creada en estado borrador (marcada excepción).' },
    { ts: '2026-04-22 09:12', actor: 'Mirta',   evento: 'enviada', detalle: 'OP enviada al supervisor.' }
  ],
  'op-1053': [
    { ts: '2026-04-13 09:00', actor: 'Nélida',  evento: 'creada',  detalle: 'OP creada en estado borrador.' },
    { ts: '2026-04-13 09:15', actor: 'Nélida',  evento: 'enviada', detalle: 'OP enviada al supervisor.' }
  ],
  // OC-0042 actual
  'oc-0042': [
    { ts: '2026-04-22 13:55', actor: 'Shirley', evento: 'creada',               detalle: 'OC creada agrupando 5 OPs.' },
    { ts: '2026-04-22 14:05', actor: 'Shirley', evento: 'edicion',              detalle: 'Decisiones por pedido marcadas.' }
  ],
  'oc-0040': [
    { ts: '2026-04-15 10:20', actor: 'Shirley', evento: 'creada',               detalle: 'OC creada agrupando 6 OPs.' },
    { ts: '2026-04-15 16:30', actor: 'Shirley', evento: 'cerrada',              detalle: 'OC cerrada con Gs. 6.180.000.' },
    { ts: '2026-04-15 17:00', actor: 'Shirley', evento: 'enviada_a_proveedor', detalle: 'Enviada por WhatsApp al proveedor.' },
    { ts: '2026-04-19 11:40', actor: 'Shirley', evento: 'compra_parcial',      detalle: 'Compra parcial registrada (COMP-0016).' }
  ]
};

// =========================================================================
// Reportes admin — datasets mock
// Los períodos se representan como clave textual: '7d' | 'mes' | '3m' | 'anio'
// Cada producto/fila trae datos coherentes entre pedido, comprado, vendido.
// =========================================================================

// ---- Reporte 1: OP vs Compra vs Venta (el reporte madre) ----------------
// Cada fila: producto + pedido (u) + comprado (u) + vendido (u) + costo
// Los ratios se calculan en el cliente. Señal visual verde/ámbar/roja.
export const reporteOpvsCompravsVenta = {
  periodoDefault: '3m',
  // KPIs se calculan sumando las filas (se hace en el render).
  filas: [
    // Verdes: todo coherente
    { productoId: 'p01', pedido: 68,  comprado: 60, vendido: 57 }, // Cargador USB-C 20W
    { productoId: 'p02', pedido: 85,  comprado: 70, vendido: 66 }, // Cable Lightning
    { productoId: 'p06', pedido: 140, comprado:135, vendido:128 }, // Vidrio templado iPhone
    { productoId: 'p10', pedido: 42,  comprado: 40, vendido: 38 }, // Adaptador OTG
    { productoId: 'p21', pedido: 96,  comprado: 90, vendido: 85 }, // Cable micro USB
    { productoId: 'p24', pedido:180,  comprado:170, vendido:160 }, // Cinta limpiadora

    // Ámbar: discrepancias moderadas (pedido > comprado o compra > venta con margen)
    { productoId: 'p05', pedido: 58,  comprado: 32, vendido: 28 }, // Funda iPhone 14 — bajaron mucho
    { productoId: 'p07', pedido: 50,  comprado: 30, vendido: 18 }, // Vidrio Samsung — vendido bajo
    { productoId: 'p09', pedido: 22,  comprado: 20, vendido: 12 }, // Power Bank
    { productoId: 'p15', pedido: 28,  comprado: 25, vendido: 14 }, // Cargador coche
    { productoId: 'p16', pedido: 20,  comprado: 18, vendido:  9 }, // Funda iPhone 15 Pro
    { productoId: 'p25', pedido: 72,  comprado: 65, vendido: 40 }, // Adhesivo anti-polvo

    // Rojo: desfases grandes
    { productoId: 'p14', pedido:120,  comprado: 90, vendido: 15 }, // Mica hidrogel — stock muerto claro
    { productoId: 'p20', pedido: 45,  comprado: 40, vendido:  5 }, // Pop socket — compra alta, venta mínima
    { productoId: 'p04', pedido: 25,  comprado: 25, vendido:  3 }, // Funda iPhone 13 — vendió casi nada

    // Variado adicional
    { productoId: 'p03', pedido: 14,  comprado: 12, vendido: 10 }, // Auricular TWS
    { productoId: 'p13', pedido: 10,  comprado:  8, vendido:  7 }, // Parlante
    { productoId: 'p18', pedido: 12,  comprado: 10, vendido:  7 }, // MicroSD 64
    { productoId: 'p22', pedido:  8,  comprado:  6, vendido:  4 }, // Funda billetera
    { productoId: 'p23', pedido:  9,  comprado:  8, vendido:  6 }  // Smartwatch T500
  ]
};

// ---- Reporte 2: OP fuera de protocolo (excepciones) ---------------------
export const reporteOpFueraProtocolo = {
  periodoDefault: 'mes',
  totalActual: 14,
  totalAnterior: 9,
  deltaPct: 55,
  porCajera: [
    {
      cajera: 'Lucía', localCodigo: 'LAM', count: 5,
      excepciones: [
        { opId: 'op-1052', fecha: '2026-04-20', motivo: 'Se rompió vitrina, quedaron sin muestra de auriculares y smartwatch.' },
        { opId: 'op-1040', fecha: '2026-04-15', motivo: 'Cliente mayorista pidió 30 fundas iPhone urgentes para regalo corporativo.' },
        { opId: 'op-1033', fecha: '2026-04-08', motivo: 'Entraron por error 20 Power Banks vencidos, hay que reemplazar.' },
        { opId: 'op-1028', fecha: '2026-04-04', motivo: 'Agotamos cargadores USB-C por promo del fin de semana.' },
        { opId: 'op-1020', fecha: '2026-03-28', motivo: 'Pedido de escuela local — se llevó todo el stock de micas hidrogel.' }
      ]
    },
    {
      cajera: 'Mirta', localCodigo: 'CAP', count: 3,
      excepciones: [
        { opId: 'op-1048', fecha: '2026-04-22', motivo: 'Venta mayorista ayer agotó stock de cargadores y fundas iPhone.' },
        { opId: 'op-1036', fecha: '2026-04-11', motivo: 'Rotura de stock de vidrios templados por campaña del shopping.' },
        { opId: 'op-1025', fecha: '2026-04-01', motivo: 'Cliente pidió 15 cables Lightning, agotaron existencia.' }
      ]
    },
    {
      cajera: 'Carolina', localCodigo: 'SDS', count: 2,
      excepciones: [
        { opId: 'op-1055', fecha: '2026-04-21', motivo: 'Venta corporativa de 12 fundas y 6 cargadores a empresa del shopping.' },
        { opId: 'op-1019', fecha: '2026-03-23', motivo: 'Venta grande a oficina nos dejó sin stock de cables Lightning y fundas.' }
      ]
    },
    {
      cajera: 'Romina', localCodigo: 'SHM', count: 1,
      excepciones: [
        { opId: 'op-1042', fecha: '2026-04-20', motivo: 'Evento de apertura agotó stock de vidrios templados Samsung.' }
      ]
    },
    {
      cajera: 'Andrea', localCodigo: 'FDM', count: 2,
      excepciones: [
        { opId: 'op-1045', fecha: '2026-04-16', motivo: 'Stock crítico de cargadores de coche tras promo fin de semana.' },
        { opId: 'op-1029', fecha: '2026-04-02', motivo: 'Venta flash en feria del barrio agotó fundas y cables.' }
      ]
    },
    { cajera: 'Nélida', localCodigo: 'VM',  count: 1,
      excepciones: [
        { opId: 'op-1032', fecha: '2026-04-06', motivo: 'Rotura de vitrina, hay que reponer muestra de smartwatch urgente.' }
      ]
    }
  ],
  umbralAlerta: 3 // Cajeras con 3+ excepciones quedan marcadas
};

// ---- Reporte 3: Reposición desde central ---------------------------------
export const reporteReposicionCentral = {
  periodoDefault: '3m',
  totalAhorroGs: 8_420_000,
  totalProductos: 12,
  totalUnidades: 185,
  tendenciaMensual: [
    { mes: 'Ene', ahorroGs: 1_200_000 },
    { mes: 'Feb', ahorroGs: 1_850_000 },
    { mes: 'Mar', ahorroGs: 2_140_000 },
    { mes: 'Abr', ahorroGs: 3_230_000 }
  ],
  filas: [
    { productoId: 'p06', veces: 8, unidades: 35, ahorroGs:   280_000 },
    { productoId: 'p14', veces: 7, unidades: 40, ahorroGs:   160_000 },
    { productoId: 'p02', veces: 6, unidades: 22, ahorroGs:   396_000 },
    { productoId: 'p21', veces: 5, unidades: 18, ahorroGs:   180_000 },
    { productoId: 'p24', veces: 5, unidades: 30, ahorroGs:    90_000 },
    { productoId: 'p07', veces: 4, unidades: 14, ahorroGs:   126_000 },
    { productoId: 'p01', veces: 4, unidades:  8, ahorroGs:   304_000 },
    { productoId: 'p10', veces: 3, unidades:  6, ahorroGs:    72_000 },
    { productoId: 'p25', veces: 3, unidades: 12, ahorroGs:    60_000 },
    { productoId: 'p05', veces: 2, unidades:  5, ahorroGs:   125_000 },
    { productoId: 'p09', veces: 2, unidades:  3, ahorroGs:   195_000 },
    { productoId: 'p15', veces: 1, unidades:  2, ahorroGs:    64_000 }
  ]
};

// ---- Reporte 4: Stock muerto -------------------------------------------
export const reporteStockMuerto = {
  totalInmovilizadoGs: 14_280_000,
  umbralDiasDefault: 30,
  // Productos candidatos a sacar del catálogo o al menos revisar
  filas: [
    { productoId: 'p14', stockTotal: 485, ultimaVenta: '2026-01-12', diasSinRotar: 100, valorGs: 1_940_000 },
    { productoId: 'p20', stockTotal: 195, ultimaVenta: '2026-02-05', diasSinRotar: 76,  valorGs: 1_170_000 },
    { productoId: 'p04', stockTotal:  58, ultimaVenta: '2026-01-28', diasSinRotar: 84,  valorGs: 1_450_000 },
    { productoId: 'p12', stockTotal:  42, ultimaVenta: '2026-02-20', diasSinRotar: 61,  valorGs: 1_176_000 },
    { productoId: 'p19', stockTotal:  28, ultimaVenta: '2026-01-30', diasSinRotar: 82,  valorGs: 2_100_000 },
    { productoId: 'p17', stockTotal:  35, ultimaVenta: '2026-02-15', diasSinRotar: 66,  valorGs:   980_000 },
    { productoId: 'p08', stockTotal:  25, ultimaVenta: '2026-03-02', diasSinRotar: 51,  valorGs:   550_000 },
    { productoId: 'p22', stockTotal:  18, ultimaVenta: '2026-02-08', diasSinRotar: 73,  valorGs:   756_000 },
    { productoId: 'p26', stockTotal:  32, ultimaVenta: '2026-01-18', diasSinRotar: 94,  valorGs: 1_760_000 },
    { productoId: 'p27', stockTotal:  44, ultimaVenta: '2026-02-25', diasSinRotar: 56,  valorGs:   528_000 }
  ]
};

// ---- Reporte 5: Devoluciones -------------------------------------------
export const reporteDevoluciones = {
  periodoDefault: '3m',
  totalDevoluciones: 8,
  totalAnterior: 5,
  deltaPct: 60,
  porCajera: [
    {
      cajera: 'Carolina', localCodigo: 'SDS', count: 1,
      devoluciones: [
        {
          opId: 'op-1026', fecha: '2026-04-02',
          nota: 'La cantidad de cargadores pedidos es muy alta. Revisá cuánto rotaste la semana pasada y mandame el pedido ajustado.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-04-03'
        }
      ]
    },
    {
      cajera: 'Lucía', localCodigo: 'LAM', count: 3,
      devoluciones: [
        {
          opId: 'op-1024', fecha: '2026-04-18',
          nota: 'Estás pidiendo 40 fundas cuando tu promedio semanal es 8. Revisá stock actual antes de pedir.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-04-19'
        },
        {
          opId: 'op-1015', fecha: '2026-03-28',
          nota: 'El pedido incluye productos que ya te repusimos hace 4 días. Verificá bodega antes de enviar.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-03-29'
        },
        {
          opId: 'op-1008', fecha: '2026-03-15',
          nota: 'Pediste 25 Power Banks, no es coherente con tu venta. Si es excepción, marcala como tal.',
          supervisora: 'Shirley', corregida: false, fechaCorreccion: null
        }
      ]
    },
    {
      cajera: 'Nélida', localCodigo: 'VM', count: 2,
      devoluciones: [
        {
          opId: 'op-1053', fecha: '2026-04-21',
          nota: 'Pediste 60 unidades de micas y tenés 180 en stock. Revisá antes de enviar.',
          supervisora: 'Shirley', corregida: false, fechaCorreccion: null
        },
        {
          opId: 'op-1021', fecha: '2026-03-24',
          nota: 'Las cantidades están redondeadas de forma rara. Indicá qué te hace falta concretamente.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-03-25'
        }
      ]
    },
    {
      cajera: 'Clara', localCodigo: 'SL', count: 1,
      devoluciones: [
        {
          opId: 'op-1017', fecha: '2026-03-30',
          nota: 'Pediste 15 cables Lightning pero ya tenés 45 en stock. Verificá stock antes de pedir.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-03-31'
        }
      ]
    },
    {
      cajera: 'Mirta', localCodigo: 'CAP', count: 1,
      devoluciones: [
        {
          opId: 'op-1009', fecha: '2026-03-10',
          nota: 'Marcaste excepción sin explicar el motivo. Volvé a enviar con el motivo completo.',
          supervisora: 'Shirley', corregida: true, fechaCorreccion: '2026-03-10'
        }
      ]
    }
  ]
};

// =========================================================================
// Config — Cajeras (admin/config/cajeras)
// 1 cajera por local (loc-01..loc-10). El loc-04 (San Lorenzo) está inactivo.
// Campos: id, nombre, email, localId, activa, fechaAlta, ultimoAcceso.
// =========================================================================
export const cajerasConfig = [
  { id: 'caj-01', nombre: 'Romina Benítez',   email: 'romina.benitez@multicompra.py',   localId: 'loc-01', activa: true,  fechaAlta: '2025-11-03', ultimoAcceso: '2026-04-22 09:10' },
  { id: 'caj-02', nombre: 'Nélida Gómez',     email: 'nelida.gomez@multicompra.py',     localId: 'loc-02', activa: true,  fechaAlta: '2025-09-14', ultimoAcceso: '2026-04-21 17:33' },
  { id: 'caj-03', nombre: 'Paola Espínola',   email: 'paola.espinola@multicompra.py',   localId: 'loc-03', activa: true,  fechaAlta: '2025-08-22', ultimoAcceso: '2026-04-22 10:04' },
  { id: 'caj-04', nombre: 'Clara Duarte',     email: 'clara.duarte@multicompra.py',     localId: 'loc-04', activa: false, fechaAlta: '2024-06-10', ultimoAcceso: '2026-02-17 19:48' },
  { id: 'caj-05', nombre: 'Gisela Ortiz',     email: 'gisela.ortiz@multicompra.py',     localId: 'loc-05', activa: true,  fechaAlta: '2025-10-01', ultimoAcceso: '2026-04-22 08:42' },
  { id: 'caj-06', nombre: 'Andrea Sanabria',  email: 'andrea.sanabria@multicompra.py',  localId: 'loc-06', activa: true,  fechaAlta: '2025-07-18', ultimoAcceso: '2026-04-22 08:30' },
  { id: 'caj-07', nombre: 'Mirta Aquino',     email: 'mirta.aquino@multicompra.py',     localId: 'loc-07', activa: true,  fechaAlta: '2025-05-06', ultimoAcceso: '2026-04-22 09:12' },
  { id: 'caj-08', nombre: 'Fátima Rolón',     email: 'fatima.rolon@multicompra.py',     localId: 'loc-08', activa: true,  fechaAlta: '2025-12-12', ultimoAcceso: '2026-04-21 16:45' },
  { id: 'caj-09', nombre: 'Jessica Villalba', email: 'jessica.villalba@multicompra.py', localId: 'loc-09', activa: true,  fechaAlta: '2025-04-29', ultimoAcceso: '2026-04-21 11:20' },
  { id: 'caj-10', nombre: 'Carolina Méndez',  email: 'carolina.mendez@multicompra.py',  localId: 'loc-10', activa: true,  fechaAlta: '2025-02-15', ultimoAcceso: '2026-04-22 07:58' }
];

// =========================================================================
// Config — Proveedores (admin/config/proveedores)
// Extiende `proveedores` agregando estado y OCs del último mes.
// =========================================================================
export const proveedoresConfig = [
  { id: 'prov-01', nombre: 'Distribuidora Celular Plus S.A.', ruc: '80012345-6',
    contacto: 'Marcelo Ayala',     telefono: '+595 981 123-456',
    ocsUltimoMes: 4, activo: true,
    especialidad: 'Cargadores, cables y adaptadores' },
  { id: 'prov-02', nombre: 'Importadora AccesoTech S.R.L.',   ruc: '80098765-4',
    contacto: 'Gabriela Benítez',  telefono: '+595 982 987-654',
    ocsUltimoMes: 2, activo: true,
    especialidad: 'Accesorios iPhone y Samsung premium' },
  { id: 'prov-03', nombre: 'TechPoint Paraguay S.A.',         ruc: '80044556-7',
    contacto: 'Rodrigo Cáceres',   telefono: '+595 985 445-566',
    ocsUltimoMes: 3, activo: true,
    especialidad: 'Audio, parlantes y smartwatch' },
  { id: 'prov-04', nombre: 'MayoMóvil Distribuciones',        ruc: '80033221-9',
    contacto: 'Laura Giménez',     telefono: '+595 971 332-219',
    ocsUltimoMes: 1, activo: true,
    especialidad: 'Vidrios templados, micas y fundas' },
  { id: 'prov-05', nombre: 'Accesorios Amambay S.A.',         ruc: '80055667-1',
    contacto: 'Hugo Fernández',    telefono: '+595 984 556-671',
    ocsUltimoMes: 0, activo: false,
    especialidad: 'Power banks y cables microUSB' }
];

// =========================================================================
// Solicitudes de alta de producto (cajera → supervisor)
// Generadas desde op-nueva.html cuando un código no existe en el catálogo.
// Estados: 'pendiente' | 'aprobado' | 'rechazado'
// Pendientes: se leen desde localStorage key 'multicompra:solicitudes_alta_producto'.
// Este array es el seed inicial para mostrar datos ya existentes en el mock
// de supervisor/solicitudes-alta.html.
// =========================================================================
export const solicitudesAltaProducto = []; // VACIADO — ver historial git para datos de prueba

// =========================================================================
// Config — Parámetros globales del sistema (admin/config/parametros)
// =========================================================================
export const parametros = {
  op: {
    diaFijoProtocolo: 'lunes',           // dropdown
    minCaracteresMotivoExcepcion: 30,    // D29
    permitirExcepciones: true            // toggle
  },
  oc: {
    snapshotMaxMinutos: 30,              // D33
    validarTotalFacturaVsLineas: true,   // D37 - bloquea al cerrar si no coincide
    exigirJustificacionLineaDiferencia: true, // D38
    usarSugeridoComoDefaultComprar: true,     // D40 - default al cambiar a "Comprar" = sugerido
    umbralSobrepedidoPct: 20                  // D40 - % de tolerancia antes de marcar "sobrepedido"
  },
  alertas: {
    opsViejasUmbralDias: 7,
    excepcionesCajeraUmbral: 3           // a partir de este nro → chip ámbar
  },
  notificaciones: {
    emailAdmin: 'diego@multicompra.py'
  }
};

// =========================================================================
// Utilidades de formato
// =========================================================================
export function fmtGs(n) {
  if (n == null || isNaN(n)) return '-';
  return n.toLocaleString('es-PY', { maximumFractionDigits: 0 });
}

// Formatea una fecha "YYYY-MM-DD" como "DD/MM/YYYY"
export function fmtFecha(d) {
  if (!d) return '-';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}
