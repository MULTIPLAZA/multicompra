# Plan de prueba — Planilla OC (5 productos, 1 OP, todos los filtros)

> Usar este checklist para validar end-to-end el flujo:
> cajera → supervisor → planilla → cerrar OC → detalle.

---

## Setup inicial

- **Local desde el cual hacer la OP**: **KIWI SHOP** (id local = 2)
  - Carolina (cajera demo) — entrar con el botón "Demo Carolina" del login.
  - Por el fix nuevo, el demo le reasigna automáticamente un local real
    del ERP. Si por algún motivo no le tocó KIWI, abrí Console y pegá:
    ```js
    const u = JSON.parse(localStorage.getItem('multicompra:user'));
    u.localId = 2; u.localNombre = 'KIWI SHOP';
    localStorage.setItem('multicompra:user', JSON.stringify(u));
    location.href = 'cajera/op-nueva.html';
    ```
- **Supervisor**: Shirley (botón "Demo Shirley")
- **DEPOSITO central**: id 27 (lo detecta solo, no hace falta tocar nada)

---

## Productos a pedir (OP única, 5 líneas)

Códigos REALES del catálogo del ERP de Diego, elegidos para cubrir las 3
decisiones default + activar los 4 filtros chip + los 3 bulks.

| # | Código a escanear | Producto                       | Cantidad a pedir | Stk DEPOSITO | Stk KIWI |
|---|-------------------|--------------------------------|------------------|--------------|----------|
| 1 | `00006440`        | Glass samsung A20 A30 A50 5D   | **5**            | 416          | 2        |
| 2 | `00014309`        | Glass Redmi Note 14 4g/5g      | **200**          | 178          | 0        |
| 3 | `00001023`        | Pendrive Sandisk 32gb          | **10**           | 3            | 0        |
| 4 | `00001000`        | Glass iPhone 6/6s              | **8**            | 0            | 0        |
| 5 | `123`             | Cargador Samsung               | **3**            | 0            | 0        |

> Nota: el código `123` es del cargador Samsung (sí, código de 3 dígitos —
> no tiene leading zeros). Después del fix de "ceros a la izquierda", se
> matchea aunque escribas `0000123`.

---

## Decisiones por defecto que debería calcular la planilla

| # | Producto         | Pidió | StkLocal | Sugerido (=pidió-stkLocal) | StkCentral | Decisión default        |
|---|------------------|-------|----------|----------------------------|------------|-------------------------|
| 1 | Glass samsung    | 5     | 2        | 3                          | 416        | **repone_central** ✓    |
| 2 | Glass Redmi N14  | 200   | 0        | 200                        | 178        | **comprar** (178<200)   |
| 3 | Pendrive 32GB    | 10    | 0        | 10                         | 3          | **comprar** (3<10)      |
| 4 | Glass iPhone 6   | 8     | 0        | 8                          | 0          | **comprar** (0<8)       |
| 5 | Cargador Samsung | 3     | 0        | 3                          | 0          | **comprar** (0<3)       |

Si alguno de estos no coincide → bug en la planilla, screenshot y avisame.

---

## Cómo activar cada filtro chip (4 filtros)

### 🟢 "Solo editados"
- En cualquier fila cambiá la cantidad del input "Comprar" (ej. de 10 a 7
  en el Pendrive) **o** cambiá la decisión.
- Click en el chip **"Solo editados"** → debería mostrar SOLO esa fila.

### 🟠 "No necesita"
- En la fila del Cargador Samsung (#5) click en el botón "No necesita".
- Click chip **"No necesita"** → muestra solo esa fila.

### 🔵 "Comprar > 0"
- Default: filas #2, #3, #4, #5 ya están en `comprar`.
- Click chip **"Comprar > 0"** → muestra esas 4. Oculta el Glass samsung
  (#1, que está en `repone_central`).

### 🔴 "⚠ Central insuficiente"
- En la fila del **Glass Redmi N14** (#2) click "Repone central".
- Eso pone 200 en `repone_central`, pero el DEPOSITO solo tiene 178 →
  aparece chip **"⚠ Central insuficiente"** en la cabecera del grupo.
- Click chip **"⚠ Central insuficiente"** → muestra solo ese grupo.

---

## Cómo activar los 3 bulks

1. Tildá los checkboxes de las filas #3, #4, #5 (Pendrive, iPhone 6, Cargador).
2. Probá uno por uno:
   - **"Ninguno compra"** → las 3 pasan a `no_necesita` (filas grises).
   - **"Comprar todo lo pedido"** → vuelven a `comprar` con cantidad = pedido.
   - **"Repone si alcanza"** → todas quedan en `comprar` (porque ningún
     producto tiene stock central suficiente).

---

## Botón "Usar sug" (en cada fila de `comprar`)

- En la fila del Glass Redmi (#2), después de cambiar la cantidad
  manualmente a otro número, debería aparecer el botón pequeño `sug 200`.
- Click → vuelve la cantidad a 200.

---

## Cerrar OC

1. Asegurate que al menos UN producto tenga decisión `comprar` con
   cantidad > 0 (sino el botón "Cerrar OC" queda deshabilitado).
2. Click **"Cerrar OC"** abajo a la derecha.
3. Confirmá el modal.
4. Debería redirigir a `oc-detalle.html?id=OC-loc-XXXX` con la OC cerrada.
5. En el detalle: click **"Descargar PDF"** → diálogo de impresión del
   browser → "Guardar como PDF".

---

## Checklist visual (marcá ✓ a medida que pruebes)

- [ ] OP creada en KIWI SHOP con los 5 códigos
- [ ] Shirley ve la OP en el dashboard
- [ ] "Armar OC con seleccionadas" → te lleva a oc-nueva
- [ ] "Armar OC y abrir planilla" → llegás a oc-editar?fromNueva=1
- [ ] La columna "Stk.Local" muestra valores reales (no 0 fijo)
- [ ] La columna "Sugerido" muestra valores calculados
- [ ] Decisión default coincide con la tabla de arriba
- [ ] Filtro "Solo editados" funciona
- [ ] Filtro "No necesita" funciona
- [ ] Filtro "Comprar > 0" funciona
- [ ] Filtro "⚠ Central insuficiente" funciona (después de cambiar Redmi a repone_central)
- [ ] Bulk "Ninguno compra" funciona
- [ ] Bulk "Comprar todo lo pedido" funciona
- [ ] Bulk "Repone si alcanza" funciona
- [ ] Botón "Usar sug" funciona
- [ ] "Cerrar OC" crea la OC en Supabase y redirige a oc-detalle
- [ ] oc-detalle muestra los datos correctos (no `undefined` ni `NaN`)
- [ ] "Descargar PDF" abre el diálogo de impresión

---

## Si algo falla

Abrir F12 → Console y pegar:

```js
// Datos de la planilla
const d = window.__debug;
console.log('Productos cache:', d.getProductos().length);
console.log('Depots stockMap:', Object.keys(d.getStockMap()));
console.log('OC grupos:', d.oc?.grupos.length);
d.oc?.grupos.forEach(g => {
  console.log(`${g.nombre} | stkCentral=${g.stockCentral} | pedidos=${g.pedidos.length}`);
  g.pedidos.forEach(p => {
    console.log(`  ${p.localNombre} | pidio=${p.pidio} stkLocal=${p.stockLocal} sug=${p.sugerido} dec=${p.decision}`);
  });
});
```

Pegame ese output completo + screenshot del error.

---

**Última actualización**: 2026-04-30
