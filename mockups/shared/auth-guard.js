/**
 * auth-guard.js — Guards de permisos por rol para MultiCompra.
 *
 * Uso típico (al inicio del primer <script type="module"> de cada pantalla):
 *
 *   import { requireRol } from '../shared/auth-guard.js';
 *   requireRol('supervisor', 'admin');
 *
 * El módulo es síncrono: el redirect ocurre antes de que se ejecute
 * cualquier código posterior al import.
 *
 * Roles válidos: 'cajera' | 'supervisor' | 'admin'
 */

const STORAGE_KEY = 'multicompra:user';

// Páginas que no aplican guard (públicas o de salida).
const PAGINAS_PUBLICAS = ['login.html', 'sin-permiso.html', 'logout.html', 'index.html'];

/**
 * Devuelve el usuario logueado desde localStorage o null si no existe / está malformado.
 * @returns {{ id, nombre, rol, iniciales, localId, localNombre } | null}
 */
export function getUserActual() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u.rol !== 'string') return null;
    return u;
  } catch (_) {
    return null;
  }
}

/**
 * Calcula la URL del dashboard según el rol del usuario logueado.
 * Se usa desde sin-permiso.html para el botón "Volver a mi panel".
 * @param {string} rol
 * @param {string} [base=''] - prefijo de ruta relativa (ej: '../')
 * @returns {string}
 */
export function dashboardPorRol(rol, base = '') {
  const mapa = {
    cajera:     `${base}cajera/dashboard.html`,
    supervisor: `${base}supervisor/dashboard.html`,
    admin:      `${base}admin/dashboard.html`,
  };
  return mapa[rol] || `${base}login.html`;
}

/**
 * Verifica que el usuario logueado tenga uno de los roles permitidos.
 * - Sin sesión → redirige a login.html (relativo a la página actual).
 * - Sesión con rol no permitido → redirige a sin-permiso.html con ?intentado=X&actual=Y.
 *
 * Si la URL actual ya es una página pública (login, sin-permiso, logout, index),
 * no aplica ninguna redirección.
 *
 * @param {...string} rolesPermitidos - Uno o más roles que pueden acceder.
 */
export function requireRol(...rolesPermitidos) {
  // No aplicar guard en páginas públicas.
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  if (PAGINAS_PUBLICAS.includes(paginaActual)) return;

  const user = getUserActual();

  // Sin sesión → login.
  if (!user) {
    // Calcular cuántos niveles subir para llegar a la raíz de mockups/.
    // Ejemplo: cajera/dashboard.html → ../login.html
    //          admin/config/cajeras.html → ../../login.html
    const depth = window.location.pathname.split('/').length - 1;
    // La raíz de mockups tiene login.html; necesitamos subir (depth - profundidad base).
    // Simplificado: contamos los "/" después de "mockups/".
    const pathParts = window.location.pathname.split('/');
    const mockupsIdx = pathParts.lastIndexOf('mockups');
    const stepsUp = mockupsIdx >= 0
      ? pathParts.length - mockupsIdx - 2   // cuántos directorios hay después de mockups/
      : 1;
    const prefix = stepsUp > 0 ? '../'.repeat(stepsUp) : '';
    window.location.replace(`${prefix}login.html`);
    return;
  }

  // Rol no permitido → sin-permiso.html con contexto.
  if (!rolesPermitidos.includes(user.rol)) {
    const pathParts = window.location.pathname.split('/');
    const mockupsIdx = pathParts.lastIndexOf('mockups');
    const stepsUp = mockupsIdx >= 0
      ? pathParts.length - mockupsIdx - 2
      : 1;
    const prefix = stepsUp > 0 ? '../'.repeat(stepsUp) : '';
    // intentado = el rol mínimo pedido (el primero de la lista).
    const intentado = rolesPermitidos[0];
    window.location.replace(
      `${prefix}sin-permiso.html?intentado=${encodeURIComponent(intentado)}&actual=${encodeURIComponent(user.rol)}`
    );
  }
  // Si el rol está permitido: no hace nada, la página continúa cargando.
}
