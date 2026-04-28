/* =============================================================================
   MultiCompra — Date Range Picker compartido
   Uso:
     import { initDateRangePicker } from '../../shared/date-range-picker.js';
     initDateRangePicker({
       containerSelector: '.periodo-chips',   // dónde inyectar el botón
       onApply: ({ desde, hasta, label }) => { ... },
       initialFromQS: true,   // leer ?desde=&hasta= al cargar
     });
   ============================================================================= */

/**
 * Formatea YYYY-MM-DD → "01 abr"
 */
function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d, 10)} ${meses[parseInt(m, 10) - 1]}`;
}

/**
 * Retorna YYYY-MM-DD de hoy
 */
function hoy() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Resta N días a una fecha ISO
 */
function restar(isoDate, dias) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

/**
 * Primer día del mes actual
 */
function primerDiaMes() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Rango del mes pasado
 */
function mesPasado() {
  const now = new Date();
  const y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const m = now.getMonth() === 0 ? 12 : now.getMonth();
  const desde = `${y}-${String(m).padStart(2, '0')}-01`;
  const ultimoDia = new Date(y, m, 0).getDate();
  const hasta  = `${y}-${String(m).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
  return { desde, hasta };
}

const PRESETS = [
  { id: 'hoy',      label: 'Hoy',          fn: () => ({ desde: hoy(), hasta: hoy() }) },
  { id: 'ayer',     label: 'Ayer',          fn: () => ({ desde: restar(hoy(), 1), hasta: restar(hoy(), 1) }) },
  { id: '7d',       label: 'Últimos 7 días', fn: () => ({ desde: restar(hoy(), 6), hasta: hoy() }) },
  { id: '30d',      label: 'Últimos 30 días', fn: () => ({ desde: restar(hoy(), 29), hasta: hoy() }) },
  { id: 'mes',      label: 'Este mes',      fn: () => ({ desde: primerDiaMes(), hasta: hoy() }) },
  { id: 'mes-ant',  label: 'Mes pasado',    fn: () => mesPasado() },
];

export function initDateRangePicker(opts = {}) {
  const {
    containerSelector = '.periodo-chips',
    onApply = null,
    initialFromQS = true,
    btnLabel = 'Personalizado…',
  } = opts;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  // ---- Crear el wrapper del botón + popover ----
  const wrap = document.createElement('div');
  wrap.className = 'drp-wrap';

  const calIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'drp-btn chip-period';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.dataset.periodo = 'custom';
  btn.innerHTML = `${calIcon} <span class="drp-btn-label">${btnLabel}</span>`;

  const popover = document.createElement('div');
  popover.className = 'drp-popover';
  popover.hidden = true;
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-label', 'Seleccionar rango de fechas');

  popover.innerHTML = `
    <div class="drp-presets" role="group" aria-label="Presets">
      ${PRESETS.map(p => `<button type="button" class="drp-preset" data-preset="${p.id}">${p.label}</button>`).join('')}
    </div>
    <div class="drp-inputs">
      <label for="drp-desde">Desde</label>
      <input type="date" id="drp-desde" name="drp-desde" max="${hoy()}" />
      <span class="drp-arrow">&rarr;</span>
      <label for="drp-hasta">Hasta</label>
      <input type="date" id="drp-hasta" name="drp-hasta" max="${hoy()}" />
    </div>
    <div class="drp-error" id="drp-error" role="alert" aria-live="polite"></div>
    <div class="drp-actions">
      <button type="button" class="btn btn-secondary btn-sm" id="drp-cancel">Cancelar</button>
      <button type="button" class="btn btn-primary btn-sm" id="drp-apply">Aplicar</button>
    </div>
  `;

  wrap.appendChild(btn);
  wrap.appendChild(popover);
  container.appendChild(wrap);

  const inputDesde = popover.querySelector('#drp-desde');
  const inputHasta = popover.querySelector('#drp-hasta');
  const errorEl    = popover.querySelector('#drp-error');
  const btnApply   = popover.querySelector('#drp-apply');
  const btnCancel  = popover.querySelector('#drp-cancel');

  // Estado interno
  let currentDesde = '';
  let currentHasta = '';

  // ---- Helpers de apertura/cierre ----
  function openPopover() {
    popover.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    // Rellenar con valores actuales si hay
    if (currentDesde) inputDesde.value = currentDesde;
    if (currentHasta) inputHasta.value = currentHasta;
    errorEl.textContent = '';
    inputDesde.focus();
  }

  function closePopover() {
    popover.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  // ---- Validación ----
  function validate() {
    const d = inputDesde.value;
    const h = inputHasta.value;
    if (!d || !h) {
      errorEl.textContent = 'Completá ambas fechas.';
      return false;
    }
    if (h < d) {
      errorEl.textContent = 'La fecha hasta no puede ser anterior a desde.';
      return false;
    }
    if (d > hoy() || h > hoy()) {
      errorEl.textContent = 'No podés seleccionar fechas futuras.';
      return false;
    }
    errorEl.textContent = '';
    return true;
  }

  // ---- Aplicar rango ----
  function applyRange(desde, hasta, presetId = null) {
    currentDesde = desde;
    currentHasta = hasta;

    // Actualizar la URL (query string)
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('desde', desde);
      url.searchParams.set('hasta', hasta);
      window.history.replaceState(null, '', url.toString());
    } catch (_) {}

    // Label en el botón
    const label = desde === hasta
      ? fmtDate(desde)
      : `${fmtDate(desde)} → ${fmtDate(hasta)}`;
    btn.querySelector('.drp-btn-label').textContent = label;
    btn.classList.add('drp-active', 'active');

    // Marcar preset activo si corresponde
    popover.querySelectorAll('.drp-preset').forEach(el => {
      el.classList.toggle('drp-preset-active', el.dataset.preset === presetId);
    });

    // Desactivar chips del período externo (los chip-period que no son el botón custom)
    container.querySelectorAll('.chip-period:not(.drp-btn)').forEach(c => {
      c.classList.remove('active');
    });

    closePopover();

    if (typeof onApply === 'function') {
      onApply({ desde, hasta, label, presetId });
    }
  }

  // ---- Eventos ----
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popover.hidden) openPopover(); else closePopover();
  });

  btnCancel.addEventListener('click', () => closePopover());

  btnApply.addEventListener('click', () => {
    if (validate()) applyRange(inputDesde.value, inputHasta.value);
  });

  // Presets
  popover.querySelectorAll('.drp-preset').forEach(el => {
    el.addEventListener('click', () => {
      const preset = PRESETS.find(p => p.id === el.dataset.preset);
      if (!preset) return;
      const { desde, hasta } = preset.fn();
      inputDesde.value = desde;
      inputHasta.value = hasta;
      errorEl.textContent = '';
    });
  });

  // Doble click en preset aplica directo
  popover.querySelectorAll('.drp-preset').forEach(el => {
    el.addEventListener('dblclick', () => {
      const preset = PRESETS.find(p => p.id === el.dataset.preset);
      if (!preset) return;
      const { desde, hasta } = preset.fn();
      applyRange(desde, hasta, el.dataset.preset);
    });
  });

  // Validar en tiempo real
  inputDesde.addEventListener('change', () => validate());
  inputHasta.addEventListener('change', () => validate());

  // Cerrar al click fuera
  document.addEventListener('click', (e) => {
    if (!popover.hidden && !wrap.contains(e.target)) closePopover();
  });

  // Esc cierra
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popover.hidden) closePopover();
  });

  // Desactivar el chip custom cuando se selecciona otro chip externo
  container.querySelectorAll('.chip-period:not(.drp-btn)').forEach(c => {
    c.addEventListener('click', () => {
      btn.classList.remove('drp-active', 'active');
      btn.querySelector('.drp-btn-label').textContent = btnLabel;
      currentDesde = '';
      currentHasta = '';
      // Limpiar query string
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('desde');
        url.searchParams.delete('hasta');
        window.history.replaceState(null, '', url.toString());
      } catch (_) {}
    });
  });

  // ---- Leer query string inicial ----
  if (initialFromQS) {
    try {
      const url = new URL(window.location.href);
      const d = url.searchParams.get('desde');
      const h = url.searchParams.get('hasta');
      if (d && h && d <= hoy() && h <= hoy() && h >= d) {
        // Desactivar chips externos
        container.querySelectorAll('.chip-period:not(.drp-btn)').forEach(c => c.classList.remove('active'));
        applyRange(d, h);
      }
    } catch (_) {}
  }

  return { applyRange, openPopover, closePopover };
}
