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
export const locales = [
  { id: 'loc-01', nombre: 'Shopping Mcal.',     codigo: 'SHM' },
  { id: 'loc-02', nombre: 'Villa Morra',        codigo: 'VM'  },
  { id: 'loc-03', nombre: 'Ciudad del Este',    codigo: 'CDE' },
  { id: 'loc-04', nombre: 'San Lorenzo',        codigo: 'SL'  },
  { id: 'loc-05', nombre: 'Lambaré',            codigo: 'LAM' },
  { id: 'loc-06', nombre: 'Fernando de la Mora',codigo: 'FDM' },
  { id: 'loc-07', nombre: 'Capiatá',            codigo: 'CAP' },
  { id: 'loc-08', nombre: 'Luque',              codigo: 'LUQ' },
  { id: 'loc-09', nombre: 'Encarnación',        codigo: 'ENC' },
  { id: 'loc-10', nombre: 'Shopping del Sol',   codigo: 'SDS' }
];

// =========================================================================
// Catálogo de productos (25 productos realistas: accesorios celulares)
// `stockPorLocal`: stock actual en cada local (snapshot que trae el SP junto
// con stockCentral cuando se abre la OC). Se usa para que el supervisor vea
// cuánto tiene cada local que pidió el producto.
// =========================================================================
export const productos = [
  // p01 — central OK, locales con pedidos razonables
  { id: 'p01', barras: '7840001000017', nombre: 'Cargador USB-C 20W Premium',           stockCentral: 45,  costo:  38000, precio:  65000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 3,  'loc-04': 4,  'loc-05': 2,  'loc-06': 1,  'loc-07': 2,  'loc-08': 3,  'loc-09': 1,  'loc-10': 2 } },

  // p02 — CASO CLARO: SL pide 15 y tiene 45 (ya cubierto), los otros sí necesitan
  { id: 'p02', barras: '7840001000024', nombre: 'Cable Lightning 1m reforzado',          stockCentral: 120, costo:  18000, precio:  35000,
    stockPorLocal: { 'loc-01': 8,  'loc-02': 3,  'loc-03': 6,  'loc-04': 45, 'loc-05': 4,  'loc-06': 7,  'loc-07': 5,  'loc-08': 9,  'loc-09': 2,  'loc-10': 6 } },

  { id: 'p03', barras: '7840001000031', nombre: 'Auricular Bluetooth TWS Pro',           stockCentral:  8,  costo: 120000, precio: 220000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 } },

  // p04 — CASO "COMPRAR O NADA": stock central en 0 → único camino es comprar
  { id: 'p04', barras: '7840001000048', nombre: 'Funda silicona iPhone 13',              stockCentral:  0,  costo:  25000, precio:  55000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 0,  'loc-04': 3,  'loc-05': 1,  'loc-06': 0,  'loc-07': 2,  'loc-08': 1,  'loc-09': 0,  'loc-10': 3 } },

  { id: 'p05', barras: '7840001000055', nombre: 'Funda silicona iPhone 14',              stockCentral: 62,  costo:  25000, precio:  55000,
    stockPorLocal: { 'loc-01': 4,  'loc-02': 2,  'loc-03': 3,  'loc-04': 5,  'loc-05': 2,  'loc-06': 3,  'loc-07': 4,  'loc-08': 1,  'loc-09': 3,  'loc-10': 2 } },

  { id: 'p06', barras: '7840001000062', nombre: 'Vidrio templado iPhone 13/14',          stockCentral: 300, costo:   8000, precio:  20000,
    stockPorLocal: { 'loc-01': 15, 'loc-02': 20, 'loc-03': 10, 'loc-04': 12, 'loc-05': 8,  'loc-06': 18, 'loc-07': 6,  'loc-08': 14, 'loc-09': 9,  'loc-10': 11 } },

  // p07 — CASO MIXTO: VM pide 30 y tiene 35 (ya está), LAM pide 20 y tiene 4 (sí falta)
  { id: 'p07', barras: '7840001000079', nombre: 'Vidrio templado Samsung A54',           stockCentral: 210, costo:   9000, precio:  22000,
    stockPorLocal: { 'loc-01': 7,  'loc-02': 35, 'loc-03': 5,  'loc-04': 10, 'loc-05': 4,  'loc-06': 9,  'loc-07': 12, 'loc-08': 8,  'loc-09': 6,  'loc-10': 11 } },

  { id: 'p08', barras: '7840001000086', nombre: 'Soporte auto magnético',                stockCentral:  4,  costo:  22000, precio:  45000,
    stockPorLocal: { 'loc-01': 0,  'loc-02': 1,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 0,  'loc-09': 2,  'loc-10': 1 } },

  { id: 'p09', barras: '7840001000093', nombre: 'Power Bank 10000mAh',                   stockCentral: 35,  costo:  65000, precio: 120000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 3,  'loc-03': 1,  'loc-04': 4,  'loc-05': 1,  'loc-06': 2,  'loc-07': 1,  'loc-08': 3,  'loc-09': 2,  'loc-10': 4 } },

  { id: 'p10', barras: '7840001000109', nombre: 'Adaptador OTG USB-C a USB',             stockCentral: 88,  costo:  12000, precio:  28000,
    stockPorLocal: { 'loc-01': 5,  'loc-02': 6,  'loc-03': 3,  'loc-04': 4,  'loc-05': 5,  'loc-06': 2,  'loc-07': 6,  'loc-08': 4,  'loc-09': 3,  'loc-10': 5 } },

  // p11 — CASO STOCK CENTRAL INSUFICIENTE: 3 locales piden y quieren "repone central",
  //       pero central tiene solo 4 unidades → debe dispararse alerta en encabezado
  { id: 'p11', barras: '7840001000116', nombre: 'Cable USB-C a USB-C 2m',                stockCentral:  4,  costo:  22000, precio:  45000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 3,  'loc-05': 0,  'loc-06': 2,  'loc-07': 1,  'loc-08': 2,  'loc-09': 1,  'loc-10': 0 } },

  // p12 — CASO STOCK NEGATIVO (inconsistencia que puede pasar en el sistema base)
  { id: 'p12', barras: '7840001000123', nombre: 'Funda flip Samsung A14',                stockCentral: -2,  costo:  28000, precio:  58000,
    stockPorLocal: { 'loc-01': 0,  'loc-02': 1,  'loc-03': 0,  'loc-04': 0,  'loc-05': 1,  'loc-06': 0,  'loc-07': 1,  'loc-08': 0,  'loc-09': 2,  'loc-10': 0 } },

  { id: 'p13', barras: '7840001000130', nombre: 'Parlante Bluetooth portátil 5W',        stockCentral: 22,  costo:  85000, precio: 160000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 3,  'loc-04': 1,  'loc-05': 2,  'loc-06': 0,  'loc-07': 1,  'loc-08': 3,  'loc-09': 1,  'loc-10': 2 } },

  // p14 — CASO CLARO: VM pide 60 y tiene 180 (stock muerto obvio en el local)
  //       SL también pide 40 y tiene 20 (sí necesita)
  { id: 'p14', barras: '7840001000147', nombre: 'Mica hidrogel universal',               stockCentral: 500, costo:   4000, precio:  12000,
    stockPorLocal: { 'loc-01': 30, 'loc-02':180, 'loc-03': 25, 'loc-04': 20, 'loc-05': 18, 'loc-06': 35, 'loc-07': 22, 'loc-08': 28, 'loc-09': 24, 'loc-10': 40 } },

  { id: 'p15', barras: '7840001000154', nombre: 'Cargador coche doble USB 30W',          stockCentral: 55,  costo:  32000, precio:  62000,
    stockPorLocal: { 'loc-01': 3,  'loc-02': 4,  'loc-03': 2,  'loc-04': 5,  'loc-05': 3,  'loc-06': 4,  'loc-07': 2,  'loc-08': 3,  'loc-09': 5,  'loc-10': 4 } },

  { id: 'p16', barras: '7840001000161', nombre: 'Funda rígida iPhone 15 Pro',            stockCentral: 40,  costo:  35000, precio:  70000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 3,  'loc-03': 1,  'loc-04': 4,  'loc-05': 2,  'loc-06': 1,  'loc-07': 3,  'loc-08': 2,  'loc-09': 1,  'loc-10': 3 } },

  { id: 'p17', barras: '7840001000178', nombre: 'Aro de luz selfie clip',                stockCentral: 12,  costo:  28000, precio:  55000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 2,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 } },

  { id: 'p18', barras: '7840001000185', nombre: 'Memoria MicroSD 64GB',                  stockCentral: 25,  costo:  48000, precio:  85000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 3,  'loc-05': 0,  'loc-06': 2,  'loc-07': 1,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 } },

  { id: 'p19', barras: '7840001000192', nombre: 'Memoria MicroSD 128GB',                 stockCentral: 18,  costo:  75000, precio: 135000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 1 } },

  // p20 — CASO CLARO: SHM pide 20 y tiene 60 (ya está cubierto)
  { id: 'p20', barras: '7840001000208', nombre: 'Pop socket liso colores',               stockCentral: 150, costo:   6000, precio:  18000,
    stockPorLocal: { 'loc-01': 60, 'loc-02': 12, 'loc-03': 18, 'loc-04': 8,  'loc-05': 10, 'loc-06': 14, 'loc-07': 16, 'loc-08': 11, 'loc-09': 9,  'loc-10': 13 } },

  { id: 'p21', barras: '7840001000215', nombre: 'Cable micro USB 1m',                    stockCentral: 240, costo:  10000, precio:  25000,
    stockPorLocal: { 'loc-01': 12, 'loc-02': 15, 'loc-03': 10, 'loc-04': 14, 'loc-05': 8,  'loc-06': 11, 'loc-07': 9,  'loc-08': 13, 'loc-09': 7,  'loc-10': 12 } },

  { id: 'p22', barras: '7840001000222', nombre: 'Funda billetera Samsung S23',           stockCentral:  9,  costo:  42000, precio:  85000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 0,  'loc-03': 1,  'loc-04': 2,  'loc-05': 0,  'loc-06': 1,  'loc-07': 0,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 } },

  { id: 'p23', barras: '7840001000239', nombre: 'Reloj smartwatch T500',                 stockCentral: 14,  costo:  95000, precio: 175000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 0,  'loc-04': 1,  'loc-05': 2,  'loc-06': 0,  'loc-07': 1,  'loc-08': 1,  'loc-09': 0,  'loc-10': 2 } },

  { id: 'p24', barras: '7840001000246', nombre: 'Cinta limpiadora pantalla x10',         stockCentral: 380, costo:   3000, precio:   8000,
    stockPorLocal: { 'loc-01': 20, 'loc-02': 25, 'loc-03': 18, 'loc-04': 22, 'loc-05': 15, 'loc-06': 24, 'loc-07': 19, 'loc-08': 21, 'loc-09': 17, 'loc-10': 20 } },

  { id: 'p25', barras: '7840001000253', nombre: 'Adhesivo anti-polvo parlante iPhone',   stockCentral: 95,  costo:   5000, precio:  14000,
    stockPorLocal: { 'loc-01': 8,  'loc-02': 6,  'loc-03': 4,  'loc-04': 7,  'loc-05': 5,  'loc-06': 9,  'loc-07': 6,  'loc-08': 5,  'loc-09': 4,  'loc-10': 7 } },

  // p26/p27 — NO aparecen en ninguna OP ni en la OC (catálogo ampliado).
  // Se usan como candidatos para "productos fuera de OC" en la pantalla
  // de verificación de Compra (Decisión 18).
  { id: 'p26', barras: '7840001000260', nombre: 'Cargador inalámbrico Qi 15W',           stockCentral: 18,  costo:  55000, precio: 110000,
    stockPorLocal: { 'loc-01': 1,  'loc-02': 2,  'loc-03': 1,  'loc-04': 0,  'loc-05': 1,  'loc-06': 2,  'loc-07': 1,  'loc-08': 0,  'loc-09': 1,  'loc-10': 2 } },

  { id: 'p27', barras: '7840001000277', nombre: 'Lápiz stylus universal capacitivo',     stockCentral: 24,  costo:  12000, precio:  28000,
    stockPorLocal: { 'loc-01': 2,  'loc-02': 1,  'loc-03': 2,  'loc-04': 1,  'loc-05': 0,  'loc-06': 1,  'loc-07': 2,  'loc-08': 1,  'loc-09': 0,  'loc-10': 1 } }
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
      pedidos.push({
        opId: op.id,
        localId: op.localId,
        localNombre: op.localNombre,
        localCodigo: local ? local.codigo : '??',
        productoId: p.id,
        pidio: ln.cantidad,
        stockLocal,
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
// Utilidades de formato
// =========================================================================
export function fmtGs(n) {
  if (n == null || isNaN(n)) return '-';
  return n.toLocaleString('es-PY', { maximumFractionDigits: 0 });
}
