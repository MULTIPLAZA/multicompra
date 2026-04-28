/* =============================================================================
   MultiCompra — capa de datos cacheada
   ----------------------------------------------------------------------------
   Wrapper sobre shared/api.js que prefetcha y cachea en sessionStorage:
     - locales       (depósitos activos)
     - proveedores   (activos)
     - productos     (catálogo completo)
     - stock         (matriz IDDeposito × IDProducto × Existencia)
     - stockMap      (índice rápido { [idDep]: { [idProd]: existencia } })

   Uso:
     1) Llamar prefetchAll(onProgress) UNA VEZ al login (después de elegir local).
     2) En las pantallas, importar getProductos(), getLocales(), etc.

   La cache vive en sessionStorage (se borra al cerrar el browser).
   TTL por seguridad: 1 hora. Si pasa más, prefetchAll() vuelve a pegar al backend.
   ============================================================================= */

import {
  apiLocales, apiProveedores, apiProductos, apiStock,
  apiRecalculoStock, indexarStock, ApiError
} from './api.js';

const CACHE_KEY = 'multicompra:cache:v1';
const CACHE_TTL_MS = 60 * 60 * 1000;  // 1 hora

let _cache = null;

// Restaurar cache de sessionStorage si está vigente
(function restore() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const c = JSON.parse(raw);
    const age = Date.now() - new Date(c.fechaCarga || 0).getTime();
    if (age > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return;
    }
    // Reindexar stock (sessionStorage no guarda funciones, pero indexarStock es JSON puro)
    if (c.stock && !c.stockMap) c.stockMap = indexarStock(c.stock);
    _cache = c;
  } catch (_) {
    sessionStorage.removeItem(CACHE_KEY);
  }
})();

export function getCache() { return _cache; }

export function isCargado() {
  return _cache !== null && Array.isArray(_cache.productos);
}

export function clearCache() {
  _cache = null;
  try { sessionStorage.removeItem(CACHE_KEY); } catch (_) {}
}

/* =============================================================================
   prefetchAll(onProgress?)
   Trae las 4 colecciones en serie y las cachea. Si una falla, sigue con las
   demás (devuelve errores en el resultado).

   onProgress (opcional): callback({ index, total, label, status, error? })
     status: 'loading' | 'ok' | 'error'

   Retorna: { ok, errores: [{label, error}], cache }
   ============================================================================= */
export async function prefetchAll(onProgress) {
  const errores = [];
  const result = { fechaCarga: new Date().toISOString() };

  const steps = [
    { label: 'Locales',     key: 'locales',     fn: apiLocales },
    { label: 'Proveedores', key: 'proveedores', fn: apiProveedores },
    { label: 'Productos',   key: 'productos',   fn: apiProductos },
    { label: 'Stock',       key: 'stock',       fn: apiStock }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (onProgress) onProgress({ index: i, total: steps.length, label: step.label, status: 'loading' });
    try {
      result[step.key] = await step.fn();
      if (onProgress) onProgress({ index: i, total: steps.length, label: step.label, status: 'ok', count: Array.isArray(result[step.key]) ? result[step.key].length : null });
    } catch (err) {
      const msg = err instanceof ApiError ? `[${err.code}] ${err.message}` : err.message;
      errores.push({ label: step.label, error: msg });
      result[step.key] = [];
      if (onProgress) onProgress({ index: i, total: steps.length, label: step.label, status: 'error', error: msg });
    }
  }

  // Indexar stock para queries rápidas
  result.stockMap = indexarStock(result.stock || []);

  _cache = result;
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(result)); } catch (_) {
    // Si falla (cuota), seguimos en memoria nomás
  }

  return { ok: errores.length === 0, errores, cache: result };
}

/* =============================================================================
   Refrescar SOLO el stock (para llamar después de un RECALCULO_STOCK)
   ============================================================================= */
export async function refreshStock() {
  if (!_cache) return { ok: false, error: 'Cache vacío. Hacer prefetchAll primero.' };
  try {
    await apiRecalculoStock(); // dispara el snapshot
    const stock = await apiStock();
    _cache.stock = stock;
    _cache.stockMap = indexarStock(stock);
    _cache.fechaCarga = new Date().toISOString();
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(_cache)); } catch (_) {}
    return { ok: true, count: stock.length };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* =============================================================================
   Getters — atajos para que las pantallas no tengan que tocar _cache directo
   ============================================================================= */
export function getProductos()   { return _cache?.productos   || []; }
export function getLocales()     { return _cache?.locales     || []; }
export function getProveedores() { return _cache?.proveedores || []; }
export function getStock()       { return _cache?.stock       || []; }
export function getStockMap()    { return _cache?.stockMap    || {}; }
export function getFechaCarga()  { return _cache?.fechaCarga  || null; }

/* =============================================================================
   Helpers de búsqueda
   ============================================================================= */
export function getProductoPorId(id) {
  return getProductos().find(p => p.id === id) || null;
}

export function getProductoPorCodigo(codigo) {
  if (!codigo) return null;
  const c = String(codigo).trim();
  return getProductos().find(p => String(p.codigo || '').trim() === c) || null;
}

export function getLocalPorId(id) {
  return getLocales().find(l => l.id === id) || null;
}

export function getProveedorPorId(idProveedor) {
  if (!idProveedor) return null;
  return getProveedores().find(p => p.id === idProveedor) || null;
}

/* Stock de un producto en un depósito específico (0 si no hay registro) */
export function getStockProducto(idDeposito, idProducto) {
  const map = getStockMap();
  return (map[idDeposito] && map[idDeposito][idProducto]) || 0;
}

/* Stock total de un producto (sumando todos los depósitos) */
export function getStockTotal(idProducto) {
  let total = 0;
  const map = getStockMap();
  for (const d of Object.keys(map)) {
    total += map[d][idProducto] || 0;
  }
  return total;
}

/* Stock de un producto desglosado por depósito (array de filas) */
export function getStockPorLocal(idProducto) {
  const map = getStockMap();
  const filas = [];
  for (const loc of getLocales()) {
    filas.push({
      idLocal: loc.id,
      nombreLocal: loc.nombre,
      sucursal: loc.Sucursal || '',
      stock: (map[loc.id] && map[loc.id][idProducto]) || 0
    });
  }
  return filas;
}

/* Buscar productos por texto (en descripción o código) */
export function buscarProductos(texto, limit = 50) {
  if (!texto) return [];
  const q = texto.toLowerCase().trim();
  if (q.length < 2) return [];
  const out = [];
  for (const p of getProductos()) {
    const desc = (p.descripcion || '').toLowerCase();
    const cod  = (p.codigo || '').toLowerCase();
    if (desc.includes(q) || cod.includes(q)) {
      out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
}
