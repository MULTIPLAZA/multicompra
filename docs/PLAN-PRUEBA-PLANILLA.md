# Plan de prueba — Planilla OC con 2 locales

> Probar la consolidación cuando varias cajeras de distintos locales
> piden los mismos productos. Cubre las 3 decisiones, los 4 filtros,
> los 3 bulks y la alerta "⚠ Central insuficiente".

---

## Setup

- **Local A**: **KIWI SHOP** (id 2)
- **Local B**: **SAN LORENZO** (id 10)
- **DEPOSITO central**: id 27 (detectado solo)
- **Supervisor**: Shirley (botón "Demo Shirley" del login)

### Antes de empezar

Si tenés datos de pruebas anteriores, **limpialos** desde:
`https://multicompra.pages.dev/admin/borrar-datos-prueba.html`

### Cómo simular 2 locales con la demo

La demo Carolina por defecto tiene un solo local asignado. Para hacer
una OP desde KIWI y otra desde SAN LORENZO, vas a tener que cambiar el
`localId` en localStorage entre OP y OP. Pegá esto en F12 → Console:

**Para KIWI SHOP (id 2):**
```js
const u = JSON.parse(localStorage.getItem('multicompra:user'));
u.localId = 2; u.localNombre = 'KIWI SHOP';
localStorage.setItem('multicompra:user', JSON.stringify(u));
location.href = 'cajera/op-nueva.html';
```

**Para SAN LORENZO (id 10):**
```js
const u = JSON.parse(localStorage.getItem('multicompra:user'));
u.localId = 10; u.localNombre = 'SAN LORENZO';
localStorage.setItem('multicompra:user', JSON.stringify(u));
location.href = 'cajera/op-nueva.html';
```

---

## Productos elegidos (5 — los mismos en ambas OPs)

| Código        | Producto                       | Stk DEPOSITO | Stk KIWI | Stk SAN |
|---------------|--------------------------------|--------------|----------|---------|
| `00006440`    | Glass samsung A20 A30 A50 5D   | 416          | 2        | 19      |
| `00014309`    | Glass Redmi Note 14 4g/5g      | 178          | 0        | 5       |
| `00001023`    | Pendrive Sandisk 32GB          | 3            | 0        | 15      |
| `00001000`    | Glass iPhone 6/6s              | 0            | 0        | 7       |
| `123`         | Cargador Samsung               | 0            | 0        | 0       |

---

## OP 1 — Carolina desde KIWI SHOP

| # | Código     | Cantidad a pedir |
|---|------------|------------------|
| 1 | `00006440` | **200**          |
| 2 | `00014309` | **100**          |
| 3 | `00001023` | **5**            |
| 4 | `00001000` | **8**            |
| 5 | `123`      | **3**            |

Cliquear "Enviar OP" → numero esperado: **`OP-KIW-00001`**

## OP 2 — Carolina desde SAN LORENZO

| # | Código     | Cantidad a pedir |
|---|------------|------------------|
| 1 | `00006440` | **250**          |
| 2 | `00014309` | **100**          |
| 3 | `00001023` | **10**           |
| 4 | `00001000` | **4**            |
| 5 | `123`      | **2**            |

Cliquear "Enviar OP" → numero esperado: **`OP-SAN-00001`**

---

## Decisiones esperadas en la planilla (cuando consolida ambas)

Loguear como **Shirley** → dashboard → tildar **AMBAS** OPs → "Armar OC con seleccionadas" → elegir proveedor (opcional) → "Armar OC y abrir planilla".

Numero de OC esperado: **`OC-MIX-00001`** (porque mezcla 2 locales).

### Lo que debería mostrar la planilla

| Producto              | Local      | Pidió | Stk Local | Sugerido | Decisión default | Notas |
|-----------------------|------------|-------|-----------|----------|------------------|-------|
| Glass samsung A20     | KIWI       | 200   | 2         | 198      | repone_central   | StkCentral 416 ≥ 200 |
|                       | SAN        | 250   | 19        | 231      | repone_central   | StkCentral 416 ≥ 250 |
| → suma repone = **450 > 416** ⚠ | | | | | | **Activa "⚠ Central insuficiente"** |
| Glass Redmi Note 14   | KIWI       | 100   | 0         | 100      | repone_central   | 178 ≥ 100 |
|                       | SAN        | 100   | 5         | 95       | repone_central   | 178 ≥ 100 |
| → suma repone = **200 > 178** ⚠ | | | | | | **Activa "⚠ Central insuficiente"** |
| Pendrive 32GB         | KIWI       | 5     | 0         | 5        | comprar          | 3 < 5 |
|                       | SAN        | 10    | 15        | 0 (sobra)| comprar          | 3 < 10 — sub-pedido (SAN ya tiene 15) |
| Glass iPhone 6/6s     | KIWI       | 8     | 0         | 8        | comprar          | StkCentral 0 |
|                       | SAN        | 4     | 7         | 0 (sobra)| comprar          | StkCentral 0 — sub-pedido |
| Cargador Samsung      | KIWI       | 3     | 0         | 3        | comprar          | StkCentral 0 |
|                       | SAN        | 2     | 0         | 2        | comprar          | StkCentral 0 |

### Cosas que debería mostrar la UI

- **2 chips ⚠** sobre los grupos Glass samsung A20 y Glass Redmi N14
- Filas con icono de **sub-pedido** (chip color naranja claro) en SAN para Pendrive, iPhone 6
- Total a comprar inicial: solo lo de las decisiones `comprar`
  - 5 + 10 (Pendrive) = 15
  - 8 + 4 (iPhone 6) = 12
  - 3 + 2 (Cargador) = 5
  - **Total inicial: 32 unidades** en estado "comprar"
- Filas en `repone_central` no suman al total a comprar

---

## Probar cada filtro chip

| Filtro                          | Cómo                                          | Resultado                                                                 |
|---------------------------------|-----------------------------------------------|---------------------------------------------------------------------------|
| **Solo editados**               | Cambiá la cantidad de cualquier fila          | Solo aparece esa fila                                                     |
| **No necesita**                 | Cambiá manual una fila a "No necesita"        | Solo aparecen las marcadas como `no_necesita`                             |
| **Comprar > 0**                 | Default                                       | 6 filas (Pendrive×2, iPhone 6×2, Cargador×2)                              |
| **⚠ Central insuficiente**     | Default                                       | Glass samsung A20 + Glass Redmi N14 (los 2 grupos en alerta)              |

## Probar bulks

1. Tildá los checkboxes de las 4 filas de **Pendrive + iPhone 6** (4 pedidos seleccionados)
2. **"Ninguno compra"** → las 4 pasan a `no_necesita` (filas grises)
3. **"Comprar todo lo pedido"** → vuelven a `comprar` con cantidad = pedido
4. **"Repone si alcanza"** → todas siguen en `comprar` (ningún producto tiene stock central suficiente)

## Probar "Usar sug"

En cualquier fila de KIWI con decisión `comprar`, después de cambiar la cantidad manualmente debería aparecer un botón pequeño `sug N`. Click → vuelve al sugerido del sistema.

---

## Cerrar OC

Click "Cerrar OC" abajo a la derecha. Debería:
- Aparecer modal lindo (no el feo del browser) preguntando confirmación
- Al confirmar: crear OC en Supabase con número `OC-MIX-00001`
- Marcar OP-KIW-00001 y OP-SAN-00001 como `en_oc`
- Redirigir a `oc-detalle.html?id=OC-MIX-00001`

En el detalle: click **"Descargar PDF"** → diálogo de impresión → debería entrar todo en una hoja A4 (10 productos en la tabla, formato compacto).

---

**Última actualización**: 2026-04-30
