/* =============================================================================
   MultiCompra — wrapper de la API SQL del proveedor (SpAdconApp)
   ----------------------------------------------------------------------------
   Expone 6 operaciones MULTICOMPRA_* contra el agente APISQL:

     apiAuth({ usuario, clave })   → { ok, id, nombre, rol, mensaje }
     apiLocales()                  → [ { id, nombre, idSucursal, Sucursal, activo } ]
     apiProveedores()              → [ { id, nombre, ruc, contacto, activo } ]
     apiProductos()                → [ { id, codigo, descripcion, categoria,
                                         marca, costo, precio, iva, activo,
                                         idProveedor } ]
     apiRecalculoStock()           → { ok, mensaje, fechaRecalculo }
     apiStock()                    → [ { IDDeposito, IDProducto, Existencia } ]

   Configuración:
     - URL del endpoint: constante DEFAULT_URL (sobreescribible con setApiConfig).
     - Token Bearer: se persiste en localStorage bajo MULTICOMPRA_TOKEN_KEY.
     - Llamar setApiConfig({ url, token }) al iniciar la app o desde un panel
       de configuración para cambiar.

   Errores:
     Lanza ApiError con .code (NO_TOKEN, NETWORK, PARSE, HTTP_xxx) y .message.
     Capturar siempre con try/catch en el llamador.
   ============================================================================= */

const DEFAULT_URL = 'https://nodoapi.ddns.net/sql';
export const MULTICOMPRA_TOKEN_KEY = 'multicompra:api:token';
export const MULTICOMPRA_URL_KEY   = 'multicompra:api:url';

let _config = {
  url:   localStorage.getItem(MULTICOMPRA_URL_KEY)   || DEFAULT_URL,
  token: localStorage.getItem(MULTICOMPRA_TOKEN_KEY) || ''
};

export class ApiError extends Error {
  constructor(code, message, detalle = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.detalle = detalle;
  }
}

export function setApiConfig({ url, token } = {}) {
  if (url !== undefined) {
    _config.url = url;
    if (url) localStorage.setItem(MULTICOMPRA_URL_KEY, url);
    else localStorage.removeItem(MULTICOMPRA_URL_KEY);
  }
  if (token !== undefined) {
    _config.token = token;
    if (token) localStorage.setItem(MULTICOMPRA_TOKEN_KEY, token);
    else localStorage.removeItem(MULTICOMPRA_TOKEN_KEY);
  }
}

export function getApiConfig() {
  return { ..._config };
}

/* ---------- helper interno: ejecutar un SP arbitrario ---------- */
async function callSP(spString) {
  if (!_config.token) {
    throw new ApiError('NO_TOKEN', 'API token no configurado. Llamar setApiConfig({ token }).');
  }
  if (!_config.url) {
    throw new ApiError('NO_URL', 'API URL no configurada.');
  }

  let response;
  try {
    response = await fetch(_config.url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + _config.token,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ sp: spString })
    });
  } catch (err) {
    throw new ApiError('NETWORK', 'Error de red: ' + err.message);
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (_) {
    throw new ApiError('PARSE', 'Respuesta no es JSON', text.slice(0, 300));
  }

  if (!response.ok) {
    const detalle = (json && (json.detalle || json.error)) || text.slice(0, 300);
    throw new ApiError('HTTP_' + response.status, 'Error HTTP ' + response.status, detalle);
  }

  return json;
}

/* ---------- escapado básico de strings para inyectar en T-SQL ----------
   APISQL ejecuta el "sp" tal cual recibe, así que las comillas simples
   en parámetros se duplican (estándar de T-SQL).
   Nunca pasar números directamente con esta función — usar sqlNum().      */
function sqlStr(value) {
  if (value === null || value === undefined) return 'NULL';
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function sqlNum(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  const n = Number(value);
  if (!Number.isFinite(n)) throw new ApiError('BAD_PARAM', 'Valor no numérico: ' + value);
  return String(n);
}

/* =============================================================================
   1) AUTH — Login
   ============================================================================= */
export async function apiAuth({ usuario, clave }) {
  if (!usuario || !clave) {
    return { ok: false, id: 0, nombre: '', rol: '', mensaje: 'Usuario y clave son obligatorios' };
  }
  const sp = `Exec SpAdconApp @Reporte='MULTICOMPRA_AUTH', @Usuario=${sqlStr(usuario)}, @Clave=${sqlStr(clave)}`;
  const arr = await callSP(sp);
  if (!Array.isArray(arr) || arr.length === 0) {
    return { ok: false, id: 0, nombre: '', rol: '', mensaje: 'Sin respuesta del servidor' };
  }
  const fila = arr[0];

  // Normalizar tipos: ok puede venir como bool, "1", "true", 1.
  const ok = fila.ok === true || fila.ok === 1 || fila.ok === '1' || fila.ok === 'true';

  // Inferir caso "usuario inactivo" cuando ok=false pero hay id (la tabla matcheó user+clave).
  let mensaje = fila.mensaje || '';
  if (!ok && fila.id > 0 && (mensaje === '' || mensaje === 'Correcto')) {
    mensaje = 'Usuario inactivo';
  }
  if (!ok && fila.id === 0 && (mensaje === '' || mensaje === 'Correcto')) {
    mensaje = 'Usuario o clave incorrectos';
  }

  return {
    ok,
    id: Number(fila.id) || 0,
    nombre: fila.nombre || '',
    rol: fila.rol || '',
    mensaje
  };
}

/* =============================================================================
   2) LOCALES — Lista de depósitos
   Devuelve solo activos por defecto. Pasar { incluirInactivos: true } para todos.
   ============================================================================= */
export async function apiLocales({ incluirInactivos = false } = {}) {
  const arr = await callSP(`Exec SpAdconApp @Reporte='MULTICOMPRA_LOCALES'`);
  if (!Array.isArray(arr)) return [];
  return incluirInactivos ? arr : arr.filter(l => l.activo);
}

/* =============================================================================
   3) PROVEEDORES
   ============================================================================= */
export async function apiProveedores({ incluirInactivos = false } = {}) {
  const arr = await callSP(`Exec SpAdconApp @Reporte='MULTICOMPRA_PROVEEDORES'`);
  if (!Array.isArray(arr)) return [];
  return incluirInactivos ? arr : arr.filter(p => p.activo);
}

/* =============================================================================
   4) PRODUCTOS — Catálogo + idProveedor por producto
   ============================================================================= */
export async function apiProductos() {
  const arr = await callSP(`Exec SpAdconApp @Reporte='MULTICOMPRA_PRODUCTOS'`);
  return Array.isArray(arr) ? arr : [];
}

/* =============================================================================
   5) RECALCULO_STOCK — Refresca el snapshot de existencias
   ============================================================================= */
export async function apiRecalculoStock() {
  const arr = await callSP(`Exec SpAdconApp @Reporte='MULTICOMPRA_RECALCULO_STOCK'`);
  if (!Array.isArray(arr) || arr.length === 0) {
    return { ok: false, mensaje: 'Sin respuesta', fechaRecalculo: null };
  }
  const fila = arr[0];
  return {
    ok: fila.ok === true || fila.ok === 1 || fila.ok === '1',
    mensaje: fila.mensaje || '',
    fechaRecalculo: fila.fechaRecalculo || null
  };
}

/* =============================================================================
   6) STOCK — Matriz de existencias (IDDeposito, IDProducto, Existencia)
   ============================================================================= */
export async function apiStock() {
  const arr = await callSP(`Exec SpAdconApp @Reporte='MULTICOMPRA_STOCK'`);
  return Array.isArray(arr) ? arr : [];
}

/* =============================================================================
   Helper: convertir el array plano de apiStock() en un mapa rápido
       map[idDeposito][idProducto] = existencia
   Útil para queries puntuales sin recorrer el array entero cada vez.
   ============================================================================= */
export function indexarStock(stockArr) {
  const map = {};
  for (const fila of stockArr) {
    const d = fila.IDDeposito;
    const p = fila.IDProducto;
    if (!map[d]) map[d] = {};
    map[d][p] = fila.Existencia;
  }
  return map;
}
