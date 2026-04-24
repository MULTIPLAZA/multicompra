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
export const proveedores = [
  {
    id: 'prov-01',
    nombre: 'Distribuidora Celular Plus S.A.',
    ruc: '80012345-6',
    contacto: 'Marcelo Ayala',
    telefono: '+595981123456',
    especialidad: 'Cargadores, cables y adaptadores'
  },
  {
    id: 'prov-02',
    nombre: 'Importadora AccesoTech S.R.L.',
    ruc: '80098765-4',
    contacto: 'Gabriela Benítez',
    telefono: '+595982987654',
    especialidad: 'Accesorios iPhone y Samsung premium'
  },
  {
    id: 'prov-03',
    nombre: 'TechPoint Paraguay S.A.',
    ruc: '80044556-7',
    contacto: 'Rodrigo Cáceres',
    telefono: '+595985445566',
    especialidad: 'Audio, parlantes y smartwatch'
  },
  {
    id: 'prov-04',
    nombre: 'MayoMóvil Distribuciones',
    ruc: '80033221-9',
    contacto: 'Laura Giménez',
    telefono: '+595971332219',
    especialidad: 'Vidrios templados, micas y fundas'
  }
];

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

export const opsPendientes = [
  {
    id: 'op-1047', localId: 'loc-06', localNombre: 'Fernando de la Mora',
    cajera: 'Andrea', fecha: '2026-04-22 08:30', enviadaHace: 'hoy',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: false,
    lineas: [
      { productoId: 'p01', cantidad: 6  },
      { productoId: 'p05', cantidad: 4  },
      { productoId: 'p10', cantidad: 8  },
      { productoId: 'p15', cantidad: 3  },
      { productoId: 'p21', cantidad: 15 }
    ]
  },
  {
    id: 'op-1048', localId: 'loc-07', localNombre: 'Capiatá',
    cajera: 'Mirta', fecha: '2026-04-22 09:12', enviadaHace: 'hoy',
    estado: 'enviada',
    esExcepcion: true,
    motivoExcepcion: 'Venta mayorista ayer agotó stock de cargadores y fundas iPhone.',
    esVieja: false,
    lineas: [
      { productoId: 'p01', cantidad: 20 },
      { productoId: 'p04', cantidad: 15 },
      { productoId: 'p05', cantidad: 12 },
      { productoId: 'p16', cantidad: 10 }
    ]
  },
  {
    id: 'op-1049', localId: 'loc-08', localNombre: 'Luque',
    cajera: 'Fátima', fecha: '2026-04-21 16:45', enviadaHace: 'hace 1 día',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: false,
    lineas: [
      { productoId: 'p02', cantidad: 10 },
      { productoId: 'p06', cantidad: 25 },
      { productoId: 'p09', cantidad: 3  },
      { productoId: 'p13', cantidad: 2  },
      { productoId: 'p17', cantidad: 4  },
      { productoId: 'p20', cantidad: 12 },
      { productoId: 'p24', cantidad: 30 },
      { productoId: 'p25', cantidad: 18 }
    ]
  },
  {
    id: 'op-1050', localId: 'loc-09', localNombre: 'Encarnación',
    cajera: 'Jessica', fecha: '2026-04-21 11:20', enviadaHace: 'hace 1 día',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: false,
    lineas: [
      { productoId: 'p03', cantidad: 3  },
      { productoId: 'p07', cantidad: 15 },
      { productoId: 'p11', cantidad: 2  },
      { productoId: 'p18', cantidad: 3  },
      { productoId: 'p19', cantidad: 2  },
      { productoId: 'p22', cantidad: 3  }
    ]
  },
  {
    id: 'op-1051', localId: 'loc-10', localNombre: 'Shopping del Sol',
    cajera: 'Carolina', fecha: '2026-04-20 14:05', enviadaHace: 'hace 2 días',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: false,
    lineas: [
      { productoId: 'p01', cantidad: 5  },
      { productoId: 'p08', cantidad: 3  },
      { productoId: 'p14', cantidad: 20 },
      { productoId: 'p16', cantidad: 4  },
      { productoId: 'p23', cantidad: 2  }
    ]
  },
  {
    id: 'op-1052', localId: 'loc-05', localNombre: 'Lambaré',
    cajera: 'Gisela', fecha: '2026-04-20 10:40', enviadaHace: 'hace 2 días',
    estado: 'enviada',
    esExcepcion: true,
    motivoExcepcion: 'Se rompió vitrina, quedaron sin muestra de auriculares y smartwatch.',
    esVieja: false,
    lineas: [
      { productoId: 'p03', cantidad: 4  },
      { productoId: 'p13', cantidad: 3  },
      { productoId: 'p23', cantidad: 3  }
    ]
  },
  {
    id: 'op-1053', localId: 'loc-02', localNombre: 'Villa Morra',
    cajera: 'Nélida', fecha: '2026-04-13 09:15', enviadaHace: 'hace 9 días',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: true,
    lineas: [
      { productoId: 'p06', cantidad: 18 },
      { productoId: 'p21', cantidad: 12 },
      { productoId: 'p24', cantidad: 20 }
    ]
  },
  {
    id: 'op-1054', localId: 'loc-03', localNombre: 'Ciudad del Este',
    cajera: 'Paola', fecha: '2026-04-12 15:50', enviadaHace: 'hace 10 días',
    estado: 'enviada',
    esExcepcion: false, motivoExcepcion: null,
    esVieja: true,
    lineas: [
      { productoId: 'p02', cantidad: 20 },
      { productoId: 'p10', cantidad: 10 },
      { productoId: 'p15', cantidad: 5  },
      { productoId: 'p25', cantidad: 25 }
    ]
  }
];

// Locales: los 10 de la cadena
// Campos extendidos (dirección, ciudad, teléfono, estado, cajeras) usados en admin/config/locales.
export const locales = [
  { id: 'loc-01', nombre: 'Shopping Mcal.',      codigo: 'SHM',
    direccion: 'Shopping Mariscal López, local 112', ciudad: 'Asunción',
    telefono: '+595 21 611-200', activo: true,  cajerasCount: 1 },
  { id: 'loc-02', nombre: 'Villa Morra',         codigo: 'VM',
    direccion: 'Av. Mcal. López 3333 c/ Senador Long', ciudad: 'Asunción',
    telefono: '+595 21 605-411', activo: true,  cajerasCount: 1 },
  { id: 'loc-03', nombre: 'Ciudad del Este',     codigo: 'CDE',
    direccion: 'Shopping París, local 48',        ciudad: 'Ciudad del Este',
    telefono: '+595 61 512-890', activo: true,  cajerasCount: 1 },
  { id: 'loc-04', nombre: 'San Lorenzo',         codigo: 'SL',
    direccion: 'Ruta Mcal. Estigarribia km 13',   ciudad: 'San Lorenzo',
    telefono: '+595 21 576-014', activo: false, cajerasCount: 0 },
  { id: 'loc-05', nombre: 'Lambaré',             codigo: 'LAM',
    direccion: 'Av. Cacique Lambaré c/ Perú',     ciudad: 'Lambaré',
    telefono: '+595 21 900-124', activo: true,  cajerasCount: 1 },
  { id: 'loc-06', nombre: 'Fernando de la Mora', codigo: 'FDM',
    direccion: 'Av. San Blas 789',                ciudad: 'Fernando de la Mora',
    telefono: '+595 21 680-733', activo: true,  cajerasCount: 1 },
  { id: 'loc-07', nombre: 'Capiatá',             codigo: 'CAP',
    direccion: 'Ruta 2 km 20, frente al cruce',   ciudad: 'Capiatá',
    telefono: '+595 228 635-501', activo: true, cajerasCount: 1 },
  { id: 'loc-08', nombre: 'Luque',               codigo: 'LUQ',
    direccion: 'Av. Cacique Guarira 1450',        ciudad: 'Luque',
    telefono: '+595 21 644-320', activo: true,  cajerasCount: 1 },
  { id: 'loc-09', nombre: 'Encarnación',         codigo: 'ENC',
    direccion: 'Av. Caballero 1220',              ciudad: 'Encarnación',
    telefono: '+595 71 203-415', activo: true,  cajerasCount: 1 },
  { id: 'loc-10', nombre: 'Shopping del Sol',    codigo: 'SDS',
    direccion: 'Shopping del Sol, local 205',     ciudad: 'Asunción',
    telefono: '+595 21 611-700', activo: true,  cajerasCount: 1 }
];

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
export const productos = [
  // p01 — NORMAL (sugerido ≈ pedido): SHM pidió 10 → sug 10; VM pidió 8 → sug 9
  { id: 'p01', barras: '7840001000017', nombre: 'Cargador USB-C 20W Premium',           stockCentral: 45,  costo:  38000, precio:  65000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 3,  'loc-04': 4,  'loc-05': 2,  'loc-06': 1,  'loc-07': 2,  'loc-08': 3,  'loc-09': 1,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 10, 'loc-02': 9,  'loc-03': 8,  'loc-04': 6,  'loc-05': 7,  'loc-06': 6,  'loc-07': 8,  'loc-08': 5,  'loc-09': 6,  'loc-10': 7 } },

  // p02 — SOBREPEDIDO: SL pidió 15 pero tiene 45 → sugerido 2 (chip ámbar "sobrepedido")
  //       SHM pidió 12 → sug 10 (normal), VM pidió 25 → sug 22 (normal)
  { id: 'p02', barras: '7840001000024', nombre: 'Cable Lightning 1m reforzado',          stockCentral: 120, costo:  18000, precio:  35000,
    stockPorLocal: { 'loc-01': 8,  'loc-02': 3,  'loc-03': 6,  'loc-04': 45, 'loc-05': 4,  'loc-06': 7,  'loc-07': 5,  'loc-08': 9,  'loc-09': 2,  'loc-10': 6 },
    sugeridoPorLocal: { 'loc-01': 10, 'loc-02': 22, 'loc-03': 18, 'loc-04': 2,  'loc-05': 15, 'loc-06': 14, 'loc-07': 16, 'loc-08': 12, 'loc-09': 18, 'loc-10': 14 } },

  // p03 — NORMAL: SHM pidió 6 → sug 5; LAM pidió 4 → sug 4
  { id: 'p03', barras: '7840001000031', nombre: 'Auricular Bluetooth TWS Pro',           stockCentral:  8,  costo: 120000, precio: 220000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 5,  'loc-02': 3,  'loc-03': 4,  'loc-04': 3,  'loc-05': 4,  'loc-06': 3,  'loc-07': 3,  'loc-08': 3,  'loc-09': 3,  'loc-10': 4 } },

  // p04 — NORMAL: SHM pidió 8 → sug 7; VM pidió 6 → sug 6; SL pidió 4 → sug 5
  { id: 'p04', barras: '7840001000048', nombre: 'Funda silicona iPhone 13',              stockCentral:  0,  costo:  25000, precio:  55000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 0,  'loc-04': 3,  'loc-05': 1,  'loc-06': 0,  'loc-07': 2,  'loc-08': 1,  'loc-09': 0,  'loc-10': 3 },
    sugeridoPorLocal: { 'loc-01': 7,  'loc-02': 6,  'loc-03': 5,  'loc-04': 5,  'loc-05': 4,  'loc-06': 5,  'loc-07': 6,  'loc-08': 5,  'loc-09': 4,  'loc-10': 5 } },

  // p05 — SUBPEDIDO: CDE pidió 15 → sug 25 (chip azul "subpedido")
  { id: 'p05', barras: '7840001000055', nombre: 'Funda silicona iPhone 14',              stockCentral: 62,  costo:  25000, precio:  55000,
    stockPorLocal: { 'loc-01': 4,  'loc-02': 2,  'loc-03': 3,  'loc-04': 5,  'loc-05': 2,  'loc-06': 3,  'loc-07': 4,  'loc-08': 1,  'loc-09': 3,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 8,  'loc-02': 9,  'loc-03': 25, 'loc-04': 10, 'loc-05': 8,  'loc-06': 7,  'loc-07': 9,  'loc-08': 7,  'loc-09': 7,  'loc-10': 8 } },

  // p06 — NORMAL: SHM pidió 40 → sug 42; SL pidió 30 → sug 28
  { id: 'p06', barras: '7840001000062', nombre: 'Vidrio templado iPhone 13/14',          stockCentral: 300, costo:   8000, precio:  20000,
    stockPorLocal: { 'loc-01': 15, 'loc-02': 20, 'loc-03': 10, 'loc-04': 12, 'loc-05': 8,  'loc-06': 18, 'loc-07': 6,  'loc-08': 14, 'loc-09': 9,  'loc-10': 11 },
    sugeridoPorLocal: { 'loc-01': 42, 'loc-02': 35, 'loc-03': 38, 'loc-04': 28, 'loc-05': 30, 'loc-06': 32, 'loc-07': 36, 'loc-08': 30, 'loc-09': 28, 'loc-10': 34 } },

  // p07 — NORMAL: VM pidió 30 → sug 28 (dentro del umbral aunque tiene stock);
  //       LAM pidió 20 → sug 22
  { id: 'p07', barras: '7840001000079', nombre: 'Vidrio templado Samsung A54',           stockCentral: 210, costo:   9000, precio:  22000,
    stockPorLocal: { 'loc-01': 7,  'loc-02': 35, 'loc-03': 5,  'loc-04': 10, 'loc-05': 4,  'loc-06': 9,  'loc-07': 12, 'loc-08': 8,  'loc-09': 6,  'loc-10': 11 },
    sugeridoPorLocal: { 'loc-01': 25, 'loc-02': 28, 'loc-03': 22, 'loc-04': 18, 'loc-05': 22, 'loc-06': 20, 'loc-07': 24, 'loc-08': 20, 'loc-09': 18, 'loc-10': 22 } },

  // p08 — NORMAL: CDE pidió 8 → sug 7
  { id: 'p08', barras: '7840001000086', nombre: 'Soporte auto magnético',                stockCentral:  4,  costo:  22000, precio:  45000,
    stockPorLocal: { 'loc-01': 0,  'loc-02': 1,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 0,  'loc-09': 2,  'loc-10': 1 },
    sugeridoPorLocal: { 'loc-01': 4,  'loc-02': 3,  'loc-03': 7,  'loc-04': 4,  'loc-05': 3,  'loc-06': 4,  'loc-07': 4,  'loc-08': 5,  'loc-09': 3,  'loc-10': 4 } },

  // p09 — NORMAL: SHM pidió 4 → sug 4; LAM pidió 3 → sug 3
  { id: 'p09', barras: '7840001000093', nombre: 'Power Bank 10000mAh',                   stockCentral: 35,  costo:  65000, precio: 120000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 3,  'loc-03': 1,  'loc-04': 4,  'loc-05': 1,  'loc-06': 2,  'loc-07': 1,  'loc-08': 3,  'loc-09': 2,  'loc-10': 4 },
    sugeridoPorLocal: { 'loc-01': 4,  'loc-02': 5,  'loc-03': 4,  'loc-04': 3,  'loc-05': 3,  'loc-06': 4,  'loc-07': 4,  'loc-08': 3,  'loc-09': 3,  'loc-10': 5 } },

  // p10 — NORMAL: CDE pidió 12 → sug 13
  { id: 'p10', barras: '7840001000109', nombre: 'Adaptador OTG USB-C a USB',             stockCentral: 88,  costo:  12000, precio:  28000,
    stockPorLocal: { 'loc-01': 5,  'loc-02': 6,  'loc-03': 3,  'loc-04': 4,  'loc-05': 5,  'loc-06': 2,  'loc-07': 6,  'loc-08': 4,  'loc-09': 3,  'loc-10': 5 },
    sugeridoPorLocal: { 'loc-01': 10, 'loc-02': 12, 'loc-03': 13, 'loc-04': 8,  'loc-05': 9,  'loc-06': 8,  'loc-07': 10, 'loc-08': 9,  'loc-09': 8,  'loc-10': 10 } },

  // p11 — SOBREPEDIDO en CDE (pidió 3, sug 1). SHM 5→sug 4, VM 4→sug 4 (normales).
  //       Queda como ejemplo de sobrepedido leve cuando central está apretado.
  { id: 'p11', barras: '7840001000116', nombre: 'Cable USB-C a USB-C 2m',                stockCentral:  4,  costo:  22000, precio:  45000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 3,  'loc-05': 0,  'loc-06': 2,  'loc-07': 1,  'loc-08': 2,  'loc-09': 1,  'loc-10': 0 },
    sugeridoPorLocal: { 'loc-01': 4,  'loc-02': 4,  'loc-03': 1,  'loc-04': 2,  'loc-05': 3,  'loc-06': 2,  'loc-07': 3,  'loc-08': 2,  'loc-09': 3,  'loc-10': 3 } },

  // p12 — SUBPEDIDO: CDE pidió 6, sug 12 (chip azul)
  { id: 'p12', barras: '7840001000123', nombre: 'Funda flip Samsung A14',                stockCentral: -2,  costo:  28000, precio:  58000,
    stockPorLocal: { 'loc-01': 0,  'loc-02': 1,  'loc-03': 0,  'loc-04': 0,  'loc-05': 1,  'loc-06': 0,  'loc-07': 1,  'loc-08': 0,  'loc-09': 2,  'loc-10': 0 },
    sugeridoPorLocal: { 'loc-01': 4,  'loc-02': 3,  'loc-03': 12, 'loc-04': 3,  'loc-05': 3,  'loc-06': 3,  'loc-07': 4,  'loc-08': 3,  'loc-09': 3,  'loc-10': 4 } },

  // p13 — NORMAL: SHM pidió 3 → sug 3; LAM pidió 2 → sug 2
  { id: 'p13', barras: '7840001000130', nombre: 'Parlante Bluetooth portátil 5W',        stockCentral: 22,  costo:  85000, precio: 160000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 3,  'loc-04': 1,  'loc-05': 2,  'loc-06': 0,  'loc-07': 1,  'loc-08': 3,  'loc-09': 1,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 3,  'loc-02': 3,  'loc-03': 4,  'loc-04': 2,  'loc-05': 2,  'loc-06': 3,  'loc-07': 3,  'loc-08': 2,  'loc-09': 2,  'loc-10': 3 } },

  // p14 — SOBREPEDIDO FUERTE: VM pidió 60, sug 3 (tiene 180 de stock → cajera se excedió)
  //       SL pidió 40, sug 35 (normal dentro del umbral).
  { id: 'p14', barras: '7840001000147', nombre: 'Mica hidrogel universal',               stockCentral: 500, costo:   4000, precio:  12000,
    stockPorLocal: { 'loc-01': 30, 'loc-02':180, 'loc-03': 25, 'loc-04': 20, 'loc-05': 18, 'loc-06': 35, 'loc-07': 22, 'loc-08': 28, 'loc-09': 24, 'loc-10': 40 },
    sugeridoPorLocal: { 'loc-01': 40, 'loc-02': 3,  'loc-03': 35, 'loc-04': 35, 'loc-05': 30, 'loc-06': 40, 'loc-07': 35, 'loc-08': 35, 'loc-09': 30, 'loc-10': 42 } },

  // p15 — NORMAL: CDE pidió 6 → sug 6
  { id: 'p15', barras: '7840001000154', nombre: 'Cargador coche doble USB 30W',          stockCentral: 55,  costo:  32000, precio:  62000,
    stockPorLocal: { 'loc-01': 3,  'loc-02': 4,  'loc-03': 2,  'loc-04': 5,  'loc-05': 3,  'loc-06': 4,  'loc-07': 2,  'loc-08': 3,  'loc-09': 5,  'loc-10': 4 },
    sugeridoPorLocal: { 'loc-01': 5,  'loc-02': 4,  'loc-03': 6,  'loc-04': 4,  'loc-05': 4,  'loc-06': 5,  'loc-07': 5,  'loc-08': 4,  'loc-09': 3,  'loc-10': 5 } },

  // p16 — NORMAL: SL pidió 5 → sug 5
  { id: 'p16', barras: '7840001000161', nombre: 'Funda rígida iPhone 15 Pro',            stockCentral: 40,  costo:  35000, precio:  70000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 3,  'loc-03': 1,  'loc-04': 4,  'loc-05': 2,  'loc-06': 1,  'loc-07': 3,  'loc-08': 2,  'loc-09': 1,  'loc-10': 3 },
    sugeridoPorLocal: { 'loc-01': 4,  'loc-02': 4,  'loc-03': 5,  'loc-04': 5,  'loc-05': 4,  'loc-06': 4,  'loc-07': 3,  'loc-08': 4,  'loc-09': 4,  'loc-10': 4 } },

  // p17 — SIN HISTORIAL: sin sugeridoPorLocal → la UI muestra "—" para todos los locales
  //       (Producto nuevo del catálogo; el sistema base aún no acumuló ventas.)
  { id: 'p17', barras: '7840001000178', nombre: 'Aro de luz selfie clip',                stockCentral: 12,  costo:  28000, precio:  55000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 2,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 },
    sugeridoPorLocal: null },

  // p18 — NORMAL: SHM pidió 5 → sug 5
  { id: 'p18', barras: '7840001000185', nombre: 'Memoria MicroSD 64GB',                  stockCentral: 25,  costo:  48000, precio:  85000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 3,  'loc-05': 0,  'loc-06': 2,  'loc-07': 1,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 5,  'loc-02': 4,  'loc-03': 4,  'loc-04': 3,  'loc-05': 3,  'loc-06': 3,  'loc-07': 3,  'loc-08': 4,  'loc-09': 3,  'loc-10': 4 } },

  // p19 — NORMAL: CDE pidió 4 → sug 4
  { id: 'p19', barras: '7840001000192', nombre: 'Memoria MicroSD 128GB',                 stockCentral: 18,  costo:  75000, precio: 135000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 1 },
    sugeridoPorLocal: { 'loc-01': 3,  'loc-02': 2,  'loc-03': 4,  'loc-04': 2,  'loc-05': 2,  'loc-06': 3,  'loc-07': 2,  'loc-08': 2,  'loc-09': 2,  'loc-10': 3 } },

  // p20 — SOBREPEDIDO: SHM pidió 20 pero tiene 60 → sug 5 (chip ámbar)
  //       LAM pidió 15 → sug 14 (normal)
  { id: 'p20', barras: '7840001000208', nombre: 'Pop socket liso colores',               stockCentral: 150, costo:   6000, precio:  18000,
    stockPorLocal: { 'loc-01': 60, 'loc-02': 12, 'loc-03': 18, 'loc-04': 8,  'loc-05': 10, 'loc-06': 14, 'loc-07': 16, 'loc-08': 11, 'loc-09': 9,  'loc-10': 13 },
    sugeridoPorLocal: { 'loc-01': 5,  'loc-02': 14, 'loc-03': 12, 'loc-04': 12, 'loc-05': 14, 'loc-06': 14, 'loc-07': 14, 'loc-08': 12, 'loc-09': 12, 'loc-10': 14 } },

  // p21 — NORMAL: SHM pidió 15 → sug 16 (aparece en op-pendiente, no en OC);
  //       SL pidió 30 → sug 28
  { id: 'p21', barras: '7840001000215', nombre: 'Cable micro USB 1m',                    stockCentral: 240, costo:  10000, precio:  25000,
    stockPorLocal: { 'loc-01': 12, 'loc-02': 15, 'loc-03': 10, 'loc-04': 14, 'loc-05': 8,  'loc-06': 11, 'loc-07': 9,  'loc-08': 13, 'loc-09': 7,  'loc-10': 12 },
    sugeridoPorLocal: { 'loc-01': 16, 'loc-02': 18, 'loc-03': 22, 'loc-04': 28, 'loc-05': 20, 'loc-06': 18, 'loc-07': 22, 'loc-08': 20, 'loc-09': 16, 'loc-10': 18 } },

  // p22 — NORMAL: CDE pidió 4 → sug 4
  { id: 'p22', barras: '7840001000222', nombre: 'Funda billetera Samsung S23',           stockCentral:  9,  costo:  42000, precio:  85000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 },
    sugeridoPorLocal: { 'loc-01': 3,  'loc-02': 3,  'loc-03': 4,  'loc-04': 3,  'loc-05': 3,  'loc-06': 3,  'loc-07': 3,  'loc-08': 3,  'loc-09': 2,  'loc-10': 4 } },

  // p23 — SIN HISTORIAL: sin sugeridoPorLocal → "—" en todos los locales.
  { id: 'p23', barras: '7840001000239', nombre: 'Reloj smartwatch T500',                 stockCentral: 14,  costo:  95000, precio: 175000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 0,  'loc-04': 1,  'loc-05': 2,  'loc-06': 0,  'loc-07': 1,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 },
    sugeridoPorLocal: null },

  // p24 — SOBREPEDIDO: SL pidió 50 → sug 10 (chip ámbar: cajera se entusiasmó)
  { id: 'p24', barras: '7840001000246', nombre: 'Cinta limpiadora pantalla x10',         stockCentral: 380, costo:   3000, precio:   8000,
    stockPorLocal: { 'loc-01': 20, 'loc-02': 25, 'loc-03': 18, 'loc-04': 22, 'loc-05': 15, 'loc-06': 24, 'loc-07': 19, 'loc-08': 21, 'loc-09': 17, 'loc-10': 20 },
    sugeridoPorLocal: { 'loc-01': 25, 'loc-02': 22, 'loc-03': 24, 'loc-04': 10, 'loc-05': 22, 'loc-06': 26, 'loc-07': 22, 'loc-08': 24, 'loc-09': 20, 'loc-10': 24 } },

  // p25 — SUBPEDIDO: CDE pidió 30 → sug 45 (chip azul); LAM pidió 20 → sug 22 (normal)
  { id: 'p25', barras: '7840001000253', nombre: 'Adhesivo anti-polvo parlante iPhone',   stockCentral: 95,  costo:   5000, precio:  14000,
    stockPorLocal: { 'loc-01': 8,  'loc-02': 6,  'loc-03': 4,  'loc-04': 7,  'loc-05': 5,  'loc-06': 9,  'loc-07': 6,  'loc-08': 5,  'loc-09': 4,  'loc-10': 7 },
    sugeridoPorLocal: { 'loc-01': 14, 'loc-02': 12, 'loc-03': 45, 'loc-04': 14, 'loc-05': 22, 'loc-06': 16, 'loc-07': 14, 'loc-08': 14, 'loc-09': 12, 'loc-10': 16 } },

  // p26/p27 — NO aparecen en ninguna OP ni en la OC (catálogo ampliado).
  // Se usan como candidatos para "productos fuera de OC" en la pantalla
  // de verificación de Compra (Decisión 18).
  { id: 'p26', barras: '7840001000260', nombre: 'Cargador inalámbrico Qi 15W',           stockCentral: 18,  costo:  55000, precio: 110000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 0,  'loc-05': 1,  'loc-06': 2,  'loc-07': 1,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 } },

  { id: 'p27', barras: '7840001000277', nombre: 'Lápiz stylus universal capacitivo',     stockCentral: 24,  costo:  12000, precio:  28000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 2,  'loc-08': 1,  'loc-09': 0,  'loc-10': 1 } },

  // p28 / p29 / p30 — códigos variados para demo de escaneo en op-nueva.html
  // Uno con prefijo distinto (7790 — importado argentino), otro corto (interno de local),
  // y uno con prefijo local Paraguay (784 pero otra secuencia).
  { id: 'p28', barras: '7790001234567', nombre: 'Auricular con cable jack 3.5mm',         stockCentral: 60,  costo:   9000, precio:  22000,
    stockPorLocal: { 'loc-01': 3,  'loc-02': 4,  'loc-03': 2,  'loc-04': 5,  'loc-05': 3,  'loc-06': 2,  'loc-07': 4,  'loc-08': 3,  'loc-09': 2,  'loc-10': 5 } },

  { id: 'p29', barras: '7840002000015', nombre: 'Cargador USB-C PD 45W GaN',              stockCentral: 15,  costo:  85000, precio: 155000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 0,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 2,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 } },

  { id: 'p30', barras: '7840002000022', nombre: 'Cable HDMI 1.5m',                        stockCentral: 32,  costo:  14000, precio:  32000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 3,  'loc-04': 2,  'loc-05': 1,  'loc-06': 2,  'loc-07': 1,  'loc-08': 3,  'loc-09': 2,  'loc-10': 1 } }
];

// =========================================================================
// OPs (Órdenes de Pedido) que se agruparon en la OC
// Casos sembrados deliberadamente:
//   - p02: 3+ locales piden (SHM, VM, SL) → agrupación rica; SL ya tiene 45 → "No necesita"
//   - p04: stock central = 0 → "Comprar" es la única opción viable
//   - p11: stock central = 4, 3 locales piden "Repone central" → alerta (insuficiente)
//   - p14: VM pide 60 y tiene 180 (stock muerto) → "No necesita"
//   - p20: SHM pide 20 y tiene 60 → "No necesita"
// =========================================================================
export const ops = [
  {
    id: 'op-1042', localId: 'loc-01', localNombre: 'Shopping Mcal.',
    cajera: 'Romina', fecha: '2026-04-20 10:15', estado: 'en_oc',
    lineas: [
      { productoId: 'p01', cantidad: 10 },
      { productoId: 'p02', cantidad: 12 },  // SHM pide p02 (agrupación rica)
      { productoId: 'p03', cantidad: 6  },
      { productoId: 'p04', cantidad: 8  },  // stock central = 0
      { productoId: 'p06', cantidad: 40 },
      { productoId: 'p09', cantidad: 4  },
      { productoId: 'p11', cantidad: 5  },  // alerta central insuficiente
      { productoId: 'p13', cantidad: 3  },
      { productoId: 'p18', cantidad: 5  },
      { productoId: 'p20', cantidad: 20 }   // SHM ya tiene 60 → "No necesita"
    ]
  },
  {
    id: 'op-1043', localId: 'loc-02', localNombre: 'Villa Morra',
    cajera: 'Nélida', fecha: '2026-04-20 11:02', estado: 'en_oc',
    lineas: [
      { productoId: 'p01', cantidad: 8  },
      { productoId: 'p02', cantidad: 25 },
      { productoId: 'p04', cantidad: 6  },  // stock central = 0
      { productoId: 'p07', cantidad: 30 },  // VM ya tiene 35 → caso MIXTO
      { productoId: 'p11', cantidad: 4  },  // alerta central insuficiente
      { productoId: 'p14', cantidad: 60 },  // VM ya tiene 180 → stock muerto obvio
      { productoId: 'p17', cantidad: 3  },
      { productoId: 'p23', cantidad: 2  }
    ]
  },
  {
    id: 'op-1044', localId: 'loc-03', localNombre: 'Ciudad del Este',
    cajera: 'Paola', fecha: '2026-04-20 12:40', estado: 'en_oc',
    lineas: [
      { productoId: 'p05', cantidad: 15 },
      { productoId: 'p08', cantidad: 8  },
      { productoId: 'p10', cantidad: 12 },
      { productoId: 'p11', cantidad: 3  },  // alerta central insuficiente (3er local pide p11)
      { productoId: 'p12', cantidad: 6  },
      { productoId: 'p15', cantidad: 6  },
      { productoId: 'p19', cantidad: 4  },
      { productoId: 'p22', cantidad: 4  },
      { productoId: 'p25', cantidad: 30 }
    ]
  },
  {
    id: 'op-1045', localId: 'loc-04', localNombre: 'San Lorenzo',
    cajera: 'Clara', fecha: '2026-04-21 09:30', estado: 'en_oc',
    lineas: [
      { productoId: 'p02', cantidad: 15 },  // SL ya tiene 45 → caso LOCAL CUBIERTO
      { productoId: 'p04', cantidad: 4  },  // stock central = 0
      { productoId: 'p06', cantidad: 30 },
      { productoId: 'p14', cantidad: 40 },
      { productoId: 'p16', cantidad: 5  },
      { productoId: 'p21', cantidad: 30 },
      { productoId: 'p24', cantidad: 50 }
    ]
  },
  {
    id: 'op-1046', localId: 'loc-05', localNombre: 'Lambaré',
    cajera: 'Gisela', fecha: '2026-04-21 14:10', estado: 'en_oc',
    lineas: [
      { productoId: 'p03', cantidad: 4  },
      { productoId: 'p07', cantidad: 20 },  // LAM tiene 4 → parte MIXTA que sí hace falta
      { productoId: 'p09', cantidad: 3  },
      { productoId: 'p13', cantidad: 2  },
      { productoId: 'p20', cantidad: 15 },
      { productoId: 'p25', cantidad: 20 }
    ]
  }
];

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
export const historialCajera = [
  {
    id: 'op-1051',
    fechaEnvio: '2026-04-20 14:05',
    estado: 'enviada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p01', cantidad: 5  },
      { productoId: 'p08', cantidad: 3  },
      { productoId: 'p14', cantidad: 20 },
      { productoId: 'p16', cantidad: 4  },
      { productoId: 'p23', cantidad: 2  }
    ]
  },
  {
    id: 'op-1038',
    fechaEnvio: '2026-04-13 09:42',
    estado: 'cerrada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p02', cantidad: 10 },
      { productoId: 'p05', cantidad: 6  },
      { productoId: 'p09', cantidad: 3  },
      { productoId: 'p21', cantidad: 12 }
    ]
  },
  {
    id: 'op-1031',
    fechaEnvio: '2026-04-06 10:18',
    estado: 'cerrada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p04', cantidad: 4  },
      { productoId: 'p06', cantidad: 25 },
      { productoId: 'p10', cantidad: 5  },
      { productoId: 'p15', cantidad: 3  },
      { productoId: 'p20', cantidad: 8  },
      { productoId: 'p24', cantidad: 40 }
    ]
  },
  {
    id: 'op-1026',
    fechaEnvio: '2026-04-02 16:30',
    estado: 'devuelta',
    esExcepcion: true,
    motivoExcepcion: 'Se rompió la vitrina y quedamos sin muestra de cargadores, necesitamos reponer urgente.',
    notaDevolucion: 'La cantidad de cargadores pedidos es muy alta. Revisá cuánto rotaste la semana pasada y mandame el pedido ajustado.',
    lineas: [
      { productoId: 'p01', cantidad: 50 },
      { productoId: 'p15', cantidad: 20 }
    ]
  },
  {
    id: 'op-1024',
    fechaEnvio: '2026-03-30 09:55',
    estado: 'cerrada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p03', cantidad: 2  },
      { productoId: 'p07', cantidad: 10 },
      { productoId: 'p13', cantidad: 2  },
      { productoId: 'p25', cantidad: 15 }
    ]
  },
  {
    id: 'op-1019',
    fechaEnvio: '2026-03-23 11:02',
    estado: 'cerrada',
    esExcepcion: true,
    motivoExcepcion: 'Venta grande a oficina ayer nos dejó sin stock de cables Lightning y fundas.',
    notaDevolucion: null,
    lineas: [
      { productoId: 'p02', cantidad: 15 },
      { productoId: 'p05', cantidad: 8  },
      { productoId: 'p16', cantidad: 6  }
    ]
  },
  {
    id: 'op-1014',
    fechaEnvio: '2026-03-16 14:25',
    estado: 'cerrada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p06', cantidad: 30 },
      { productoId: 'p21', cantidad: 15 },
      { productoId: 'p24', cantidad: 25 }
    ]
  },
  {
    id: 'op-1011',
    fechaEnvio: '2026-03-12 10:40',
    estado: 'anulada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p09', cantidad: 2 },
      { productoId: 'p18', cantidad: 3 }
    ]
  },
  {
    id: 'op-1007',
    fechaEnvio: '2026-03-09 08:52',
    estado: 'cerrada',
    esExcepcion: false,
    motivoExcepcion: null,
    notaDevolucion: null,
    lineas: [
      { productoId: 'p01', cantidad: 4  },
      { productoId: 'p11', cantidad: 2  },
      { productoId: 'p15', cantidad: 3  },
      { productoId: 'p20', cantidad: 10 }
    ]
  }
];

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
export const ocsHistorico = [
  {
    id: 'oc-0042', numero: 'OC-0042',
    proveedorId: 'prov-01', proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaCreacion: '2026-04-22', estado: 'abierta',
    unidadesTotal: 312, totalGs: 8_640_000,
    opsCount: 5, comprasCount: 0
  },
  {
    id: 'oc-0041', numero: 'OC-0041',
    proveedorId: 'prov-03', proveedorNombre: 'TechPoint Paraguay S.A.',
    fechaCreacion: '2026-04-18', estado: 'enviada_a_proveedor',
    unidadesTotal: 145, totalGs: 14_320_000,
    opsCount: 4, comprasCount: 0
  },
  {
    id: 'oc-0040', numero: 'OC-0040',
    proveedorId: 'prov-04', proveedorNombre: 'MayoMóvil Distribuciones',
    fechaCreacion: '2026-04-15', estado: 'parcialmente_recibida',
    unidadesTotal: 420, totalGs: 6_180_000,
    opsCount: 6, comprasCount: 1
  },
  {
    id: 'oc-0039', numero: 'OC-0039',
    proveedorId: 'prov-02', proveedorNombre: 'Importadora AccesoTech S.R.L.',
    fechaCreacion: '2026-04-10', estado: 'cerrada',
    unidadesTotal: 88, totalGs: 9_850_000,
    opsCount: 3, comprasCount: 1
  },
  {
    id: 'oc-0038', numero: 'OC-0038',
    proveedorId: 'prov-01', proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaCreacion: '2026-04-05', estado: 'cerrada_con_faltante',
    unidadesTotal: 210, totalGs: 5_460_000,
    opsCount: 5, comprasCount: 2
  },
  {
    id: 'oc-0037', numero: 'OC-0037',
    proveedorId: 'prov-03', proveedorNombre: 'TechPoint Paraguay S.A.',
    fechaCreacion: '2026-03-29', estado: 'cerrada',
    unidadesTotal: 176, totalGs: 11_480_000,
    opsCount: 4, comprasCount: 1
  },
  {
    id: 'oc-0036', numero: 'OC-0036',
    proveedorId: 'prov-04', proveedorNombre: 'MayoMóvil Distribuciones',
    fechaCreacion: '2026-03-22', estado: 'anulada',
    unidadesTotal: 0, totalGs: 0,
    opsCount: 3, comprasCount: 0
  },
  {
    id: 'oc-0035', numero: 'OC-0035',
    proveedorId: 'prov-02', proveedorNombre: 'Importadora AccesoTech S.R.L.',
    fechaCreacion: '2026-03-18', estado: 'cerrada',
    unidadesTotal: 64, totalGs: 7_120_000,
    opsCount: 2, comprasCount: 1
  },
  {
    id: 'oc-0034', numero: 'OC-0034',
    proveedorId: 'prov-01', proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaCreacion: '2026-03-12', estado: 'cerrada',
    unidadesTotal: 298, totalGs: 8_220_000,
    opsCount: 5, comprasCount: 1
  },
  {
    id: 'oc-0033', numero: 'OC-0033',
    proveedorId: 'prov-03', proveedorNombre: 'TechPoint Paraguay S.A.',
    fechaCreacion: '2026-03-05', estado: 'cerrada',
    unidadesTotal: 112, totalGs: 10_640_000,
    opsCount: 3, comprasCount: 1
  },
  {
    id: 'oc-0032', numero: 'OC-0032',
    proveedorId: 'prov-04', proveedorNombre: 'MayoMóvil Distribuciones',
    fechaCreacion: '2026-02-26', estado: 'cerrada',
    unidadesTotal: 356, totalGs: 4_980_000,
    opsCount: 4, comprasCount: 1
  },
  {
    id: 'oc-0031', numero: 'OC-0031',
    proveedorId: 'prov-01', proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaCreacion: '2026-02-18', estado: 'cerrada_con_faltante',
    unidadesTotal: 184, totalGs: 6_310_000,
    opsCount: 4, comprasCount: 2
  }
];

// =========================================================================
// Compras históricas — listado para /supervisor/compra
// Estados posibles: 'precargada' | 'en_verificacion' | 'con_diferencias'
//                   | 'confirmada' | 'error_sincronizacion' | 'anulada'
// =========================================================================
export const comprasHistorico = [
  {
    id: 'comp-0017', numero: 'COMP-0017',
    ocId: 'oc-0042', ocNumero: 'OC-0042',
    proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaFactura: '2026-04-22', nroComprobante: '001-001-0045789',
    totalFactura: 8_625_500, estado: 'en_verificacion'
  },
  {
    id: 'comp-0016', numero: 'COMP-0016',
    ocId: 'oc-0040', ocNumero: 'OC-0040',
    proveedorNombre: 'MayoMóvil Distribuciones',
    fechaFactura: '2026-04-19', nroComprobante: '001-003-0012441',
    totalFactura: 3_910_000, estado: 'con_diferencias'
  },
  {
    id: 'comp-0015', numero: 'COMP-0015',
    ocId: 'oc-0039', ocNumero: 'OC-0039',
    proveedorNombre: 'Importadora AccesoTech S.R.L.',
    fechaFactura: '2026-04-14', nroComprobante: '002-001-0008712',
    totalFactura: 9_850_000, estado: 'confirmada'
  },
  {
    id: 'comp-0014', numero: 'COMP-0014',
    ocId: 'oc-0038', ocNumero: 'OC-0038',
    proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaFactura: '2026-04-09', nroComprobante: '001-001-0045612',
    totalFactura: 5_200_000, estado: 'error_sincronizacion'
  },
  {
    id: 'comp-0013', numero: 'COMP-0013',
    ocId: 'oc-0037', ocNumero: 'OC-0037',
    proveedorNombre: 'TechPoint Paraguay S.A.',
    fechaFactura: '2026-04-02', nroComprobante: '001-002-0019334',
    totalFactura: 11_480_000, estado: 'confirmada'
  },
  {
    id: 'comp-0012', numero: 'COMP-0012',
    ocId: 'oc-0035', ocNumero: 'OC-0035',
    proveedorNombre: 'Importadora AccesoTech S.R.L.',
    fechaFactura: '2026-03-24', nroComprobante: '002-001-0008665',
    totalFactura: 7_120_000, estado: 'confirmada'
  },
  {
    id: 'comp-0011', numero: 'COMP-0011',
    ocId: 'oc-0034', ocNumero: 'OC-0034',
    proveedorNombre: 'Distribuidora Celular Plus S.A.',
    fechaFactura: '2026-03-15', nroComprobante: '001-001-0045488',
    totalFactura: 8_220_000, estado: 'confirmada'
  },
  {
    id: 'comp-0010', numero: 'COMP-0010',
    ocId: 'oc-0032', ocNumero: 'OC-0032',
    proveedorNombre: 'MayoMóvil Distribuciones',
    fechaFactura: '2026-03-02', nroComprobante: '001-003-0012301',
    totalFactura: 4_980_000, estado: 'confirmada'
  }
];

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
