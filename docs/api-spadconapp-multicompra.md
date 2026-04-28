# Operaciones MULTICOMPRA en `SpAdconApp`

Este documento lista las nuevas ramas `@Reporte` que necesita la PWA **MultiCompra** dentro del SP existente `SpAdconApp` de la base `ADCON2`. Cada operación describe:

- **Valor de `@Reporte`** que vamos a mandar.
- **Parámetros adicionales** que vamos a pasar (si aplica).
- **Columnas exactas** que esperamos recibir, con tipo y ejemplo.

> Convención de naming: todas las operaciones empiezan con `MULTICOMPRA_` para no chocar con los reportes existentes (`VENTASXDIA`, `KONTAR_PRODUCTOS`, etc.).
>
> Convención de output: siempre **un único `SELECT` final** (un solo result set), porque el agente APISQL devuelve solo el último.
>
> Para errores controlados (credenciales inválidas, etc.): devolver una fila con `ok = 0` y `mensaje = '...'`. Para éxito: `ok = 1` + las columnas del resultado.

---

## Estado de operaciones

| # | Reporte | Estado | Para qué |
|---|---|---|---|
| 1 | `MULTICOMPRA_AUTH` | 📝 Especificado, falta implementar | Login (usuario + clave) |
| 2 | `MULTICOMPRA_LOCALES` | ⏳ Por especificar | Lista de sucursales activas |
| 3 | `MULTICOMPRA_PROVEEDORES` | ⏳ Por especificar | Lista de proveedores activos |
| 4 | `MULTICOMPRA_PRODUCTOS` | ⏳ Por especificar | Catálogo (descripción, costo, precio, código) |
| 5 | `MULTICOMPRA_STOCK_PRODUCTO` | ⏳ Por especificar | Stock de un producto en cada sucursal |
| 6 | `MULTICOMPRA_OP_GUARDAR` | ⏳ Por especificar | Guardar Orden de Pedido (¿en SQL Server o Supabase?) |

Empezamos por **AUTH** porque sin login no se puede probar nada más.

---

## 1) `MULTICOMPRA_AUTH` — Login

### Request desde la PWA

```http
POST https://nodoapi.ddns.net/sql
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "sp": "Exec SpAdconApp @Reporte='MULTICOMPRA_AUTH', @Usuario='shirley', @Clave='1234'"
}
```

### Parámetros

| Parámetro | Tipo SQL | Obligatorio | Descripción |
|---|---|---|---|
| `@Reporte` | `varchar(50)` | sí | Siempre `'MULTICOMPRA_AUTH'` |
| `@Usuario` | `varchar(50)` | sí | Login que escribió la cajera/supervisor |
| `@Clave` | `varchar(100)` | sí | Clave en texto plano (la PWA la manda por HTTPS) |

> Nota: si la tabla de usuarios guarda la clave hasheada, el SP hace el hash internamente antes de comparar.

### Response esperado — caso éxito

Una sola fila con estas columnas (orden no importa, pero los **nombres sí**):

| Columna | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `ok` | `bit` | `1` | Siempre `1` cuando el login es válido |
| `id` | `int` | `12` | ID del usuario (PK de la tabla Usuario o Vendedor) |
| `nombre` | `varchar` | `'Shirley González'` | Nombre completo para mostrar en UI |
| `rol` | `varchar(20)` | `'supervisor'` | Valores válidos: `'cajera'`, `'supervisor'`, `'admin'`. Si la tabla original usa otros valores (ej: `'VENDEDOR'`, `'GERENTE'`), mapearlos en el SP a estos 3 |
| `idLocal` | `int` | `7` | `IDSucursal` asignado al usuario. `0` o `NULL` si es admin/central |
| `nombreLocal` | `varchar` | `'MULTIPLAZA'` | `Sucursal.Descripcion` del local asignado. `'Central'` si no tiene |
| `mensaje` | `varchar(100)` | `''` | Vacío en caso de éxito |

**Ejemplo de fila devuelta:**

```json
[{
  "ok": 1,
  "id": 12,
  "nombre": "Shirley González",
  "rol": "supervisor",
  "idLocal": 0,
  "nombreLocal": "Central",
  "mensaje": ""
}]
```

### Response esperado — caso credenciales inválidas

Una sola fila con:

```json
[{
  "ok": 0,
  "id": 0,
  "nombre": "",
  "rol": "",
  "idLocal": 0,
  "nombreLocal": "",
  "mensaje": "Usuario o clave incorrectos"
}]
```

### Response esperado — caso usuario inactivo

```json
[{
  "ok": 0,
  "id": 0,
  "nombre": "",
  "rol": "",
  "idLocal": 0,
  "nombreLocal": "",
  "mensaje": "Usuario inactivo"
}]
```

### Boceto T-SQL (para que Carlos lo adapte al schema real)

```sql
If @Reporte = 'MULTICOMPRA_AUTH' Begin

    Declare @vId          int           = 0
    Declare @vNombre      varchar(100)  = ''
    Declare @vRol         varchar(20)   = ''
    Declare @vIdLocal     int           = 0
    Declare @vNombreLocal varchar(100)  = ''
    Declare @vOk          bit           = 0
    Declare @vMensaje     varchar(100)  = ''
    Declare @vActivo      bit           = 0

    -- Buscar el usuario (ajustar nombre de tabla y columnas reales)
    Select Top 1
        @vId      = U.IDUsuario,           -- o IDVendedor, lo que aplique
        @vNombre  = U.Nombre,
        @vRol     = U.Rol,                 -- o Cargo, Tipo, lo que aplique
        @vIdLocal = IsNull(U.IDSucursal, 0),
        @vActivo  = U.Activo
    From Usuario U                          -- o Vendedor, segun el caso
    Where U.Usuario = @Usuario              -- o Login, Codigo
      And U.Clave   = @Clave                -- o aplicar HashBytes si es hash

    If @vId = 0 Begin
        Set @vMensaje = 'Usuario o clave incorrectos'
    End
    Else If @vActivo = 0 Begin
        Set @vMensaje = 'Usuario inactivo'
        Set @vId = 0
    End
    Else Begin
        Set @vOk = 1
        -- Resolver nombre del local
        If @vIdLocal > 0 Begin
            Select @vNombreLocal = Descripcion From Sucursal Where IDSucursal = @vIdLocal
        End
        Else Begin
            Set @vNombreLocal = 'Central'
        End

        -- Mapeo opcional de rol original a roles MultiCompra
        Set @vRol = Case Upper(@vRol)
            When 'CAJERA'      Then 'cajera'
            When 'CAJERO'      Then 'cajera'
            When 'VENDEDOR'    Then 'cajera'
            When 'SUPERVISOR'  Then 'supervisor'
            When 'SUPERVISORA' Then 'supervisor'
            When 'GERENTE'     Then 'supervisor'
            When 'ADMIN'       Then 'admin'
            When 'ADMINISTRADOR' Then 'admin'
            Else Lower(@vRol)
        End
    End

    Select
        'ok'          = @vOk,
        'id'          = @vId,
        'nombre'      = @vNombre,
        'rol'         = @vRol,
        'idLocal'     = @vIdLocal,
        'nombreLocal' = @vNombreLocal,
        'mensaje'     = @vMensaje

    GoTo Cerrar
End
```

### Cosas que necesito que me confirmen

1. **¿La tabla de login es `Usuario` o `Vendedor`?** ¿Las cajeras y supervisores entran a la PWA con el mismo usuario que ya usan en el ERP de Diego?
2. **¿La clave está en texto plano o hasheada?** Si es hash, ¿qué algoritmo (SHA1, SHA256, MD5)? Para que el SP la hashee antes de comparar.
3. **¿Cómo se llama la columna del rol/cargo y qué valores tiene?** Necesito el listado de valores reales para mapear.
4. **¿La columna del ID del local/sucursal asignado existe?** Ej: `IDSucursal` en la tabla de usuarios.

Apenas me confirmen estos 4 puntos, este reporte queda listo para implementar.

---

## 2..6) Operaciones siguientes

Las voy a documentar en este mismo archivo a medida que terminemos AUTH y validemos la conexión end-to-end.
