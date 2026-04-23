# Log de decisiones — MultiCompra

Cada decisión: fecha, contexto, opciones consideradas, decisión, razón.

---

## 1. 2026-04-22 — Experiencias separadas en el mismo proyecto
**Contexto:** ¿la PWA es una única app con rutas distintas según rol, o experiencias separadas?
**Opciones:**
- App única con layout condicional por rol.
- Experiencias separadas (`/cajera`, `/supervisor`, `/admin`) dentro del mismo proyecto.
**Decisión:** Experiencias bien separadas dentro del mismo proyecto. Login común (Supabase Auth), pero layout y árbol de navegación independientes por perfil. Son 3 experiencias (no 2): cajera, supervisor, admin.
**Razón:** Las tareas son muy distintas entre perfiles (cajera = simple desktop, supervisor = densa desktop, admin = reportes mobile). Compartir layout obligaría a compromisos feos.

## 2. 2026-04-22 — Auth con Supabase, usuarios individuales, cajera asociada a local
**Contexto:** ¿usuarios compartidos por local o uno por cajera?
**Decisión:** Un usuario por persona. En `perfiles` se asocia `local_id` a cada cajera. Supervisor y admin no tienen `local_id` (o tienen uno neutro).
**Razón:** Trazabilidad — saber quién cargó qué OP. Si comparten usuario, se pierde accountability, y el problema central del proyecto justamente es la falta de accountability previa.

## 3. 2026-04-22 — 1 OC = 1 proveedor por defecto
**Contexto:** ¿una OC puede ir a varios proveedores?
**Decisión:** Por defecto 1 OC = 1 proveedor. Excepciones a tratar más adelante si aparecen casos reales.
**Razón:** Simplifica el modelo y el flujo de verificación de Compra. Ampliar después si hace falta.

## 4. 2026-04-22 — Protocolo de pedido siempre externo al software
**Contexto:** ¿el software impone el criterio de cuánto pedir, o solo ejecuta?
**Decisión:** Externo. El software registra y disciplina; el criterio sigue siendo humano.
**Razón:** El usuario ya tiene un protocolo definido; el software no debería duplicar ni reemplazar eso. Además, meter reglas automáticas sin tener data histórica de ventas es riesgoso.

## 5. 2026-04-22 — Snapshot de stock (central + locales) con refresh
**Contexto:** ¿caché periódico vs consulta en vivo al SP para ver stock? Y más importante: ¿alcanza con ver stock central o también hay que ver el stock de cada local que pidió el producto?
**Opciones:**
- **En vivo puro:** datos reales pero latencia, fragilidad ante caída del SP.
- **Caché puro:** rápido pero arriesga decisiones sobre stock desactualizado.
- **Híbrido con snapshot (solo central):** bulk al abrir OC con stock central, timestamp visible, botón refresh, refetch al cerrar OC.
- **Híbrido con snapshot ampliado (central + locales):** mismo patrón pero el bulk trae también el stock actual de cada local que aparece en las OPs agrupadas.
**Decisión:** Híbrido con snapshot **ampliado a stock por local**. Al abrir la OC, el sistema pide al SP del proveedor una matriz `producto × (central + N locales)` limitada a los productos presentes en las OPs agrupadas y a los locales que efectivamente pidieron algo. Timestamp único y botón refresh único (refresca ambas cosas a la vez). Refetch automático al cerrar la OC.
**Razón:** El supervisor (Shirley) no puede decidir bien con solo el stock central: puede pasar que un local ya tenga el producto en cantidad suficiente y pedirlo sea desperdicio. Ampliar el snapshot habilita la UI de "detalle por local" (ver Decisión 21) y que Shirley ignore/baje pedidos caso por caso. Se mantiene el snapshot como base para auditoría ("qué stock vio el supervisor cuando decidió"). Nota: al no haber traslados dentro de MultiCompra (ver decisión 7), no hace falta gestionar reservas internas; el stock "real" lo maneja el sistema base del cliente.
**Nota técnica (pendiente Arquitecto):** Esto requiere del SP del proveedor una acción que devuelva la matriz producto × (central + N locales) para los productos de las OPs agrupadas. A confirmar con MultiCompraArquitecto cuando tengamos la documentación del SP `SPMultiCompra`. Si el SP no soporta la consulta matricial, fallback = N llamadas (una por local) en paralelo.

## 6. 2026-04-22 — Stack: React + Vite + Supabase + Cloudflare Pages
**Contexto:** ¿vanilla JS (como nodoengineweb) o React (como Pulso Desk y CRM-contactos)?
**Decisión:** React + Vite + Supabase + Cloudflare Pages.
**Razón:** Patrón ya validado por el usuario en otros proyectos en producción, tooling moderno, componentes reusables (clave para la planilla editable de OC).

---

## 7. 2026-04-22 — Flujo físico real: Proveedor → Central → Local
**Contexto:** ¿los traslados desde el depósito central hacia los locales son parte de MultiCompra?
**Opciones:**
- A. Modelar "Traslado" como entidad dentro de MultiCompra (además de OP/OC/Compra).
- B. Dejar traslados fuera del alcance, en el sistema base del cliente.
**Decisión:** **B.** El flujo físico real es **Proveedor → Depósito Central → Local**. La mercadería siempre entra primero a central. El traslado central → local se registra en el **sistema de producción del cliente** (el que expone `SPMultiCompra`), NO en MultiCompra. MultiCompra solamente consulta la API para ver stock actualizado por local y por central.
**Razón:** Duplicar lógica de traslados en MultiCompra obligaría a sincronizar estado contra el sistema base, con riesgo de inconsistencias. El cliente ya tiene resuelto el traslado en su sistema; MultiCompra no necesita reimplementarlo. Alcance más chico = menos superficie de bugs.

## 8. 2026-04-22 — Día fijo de OP + OPs de excepción permitidas
**Contexto:** ¿la cajera puede cargar OP cualquier día, o hay un día protocolo?
**Opciones:**
- A. Libre todos los días.
- B. Día fijo rígido (ej. solo lunes).
- C. Día fijo por defecto, pero permitir excepciones con justificación.
**Decisión:** **C.** Hay un día fijo por semana (default: lunes, a confirmar operativamente). **Pero** se permiten OPs de excepción fuera del día fijo (ej: urgencia un sábado por una venta grande). La cajera debe completar un campo `motivo_excepcion` obligatorio al crear una OP fuera de protocolo.
**Razón:** El día fijo mete disciplina; la excepción evita que el software se vuelva un freno para urgencias reales. La obligatoriedad del motivo deja rastro y permite al admin auditar "OPs fuera de protocolo por cajera" como reporte.

## 9. 2026-04-22 — Compra parcial: supervisor decide caso por caso
**Contexto:** Si el proveedor entrega menos de lo comprado, ¿qué pasa con la OC?
**Opciones:**
- A. Cerrar siempre con faltante.
- B. Dejar siempre abierta esperando más entregas.
- C. Supervisor decide caso por caso.
**Decisión:** **C.** El sistema soporta dos caminos:
- Dejar la OC en estado `parcialmente_recibida` abierta, aceptando más Compras sobre la misma OC.
- Cerrar la OC como `cerrada_con_faltante`.
El supervisor elige al confirmar la Compra.
**Razón:** En la realidad hay proveedores que completan después y proveedores que no. Forzar una única política genera fricción innecesaria. La decisión queda con el humano, que es el principio no negociable del proyecto.

## 10. 2026-04-22 — 3 perfiles con UI distinta: cajera, supervisor, admin
**Contexto:** ¿con 2 perfiles (cajera, supervisor) alcanza, o hace falta un admin separado?
**Decisión:** 3 perfiles con UI y permisos distintos:
- **Cajera** — desktop simple, solo crear/enviar OP y ver estado de sus OPs.
- **Supervisor** — desktop denso tipo planilla, gestiona OC y Compra, aprueba/devuelve OPs.
- **Admin** — **mobile-first**, enfocado en reportes (OPs vs compras vs ventas, OPs fuera de protocolo, comportamiento por cajera, alertas de stock muerto).
**Razón:** El dueño consume información en el celular, no arma OCs. Darle una UI desktop densa no le sirve. El admin no es el supervisor: son roles distintos, con permisos distintos.

## 11. 2026-04-22 — 1 OP abierta por cajera a la vez
**Contexto:** ¿la cajera puede tener varias OPs sin procesar a la vez?
**Decisión:** No. El sistema bloquea la creación de una 2da OP si la cajera tiene una OP en estado `borrador` o `enviada` (no procesada todavía por supervisor).
**Razón:** Evita spam de OPs, obliga a la cajera a consolidar su pedido en un solo documento. Si necesita agregar algo, edita la OP en borrador; si ya la envió, conversa con supervisor o espera procesamiento.

## 12. 2026-04-22 — Estados completos de OP, OC y Compra
**Contexto:** Necesitamos un modelo de estados claro para que el sistema no quede en ambigüedad.
**Decisión:** Definidos estados y transiciones para las 3 entidades. Ver sección **"Modelo de estados"** al final de este archivo.
**Razón:** Trazabilidad y claridad operativa. Sin estados explícitos, no hay cómo auditar ni cómo condicionar permisos.

## 13. 2026-04-22 — Supervisor puede devolver OP a cajera con nota
**Contexto:** ¿qué pasa si el supervisor recibe una OP disparatada (ej. pide 50 unidades de algo que rota 2)?
**Opciones:**
- A. Supervisor edita en silencio la cantidad en la OC y listo.
- B. Supervisor puede "devolver" la OP a la cajera con una nota pidiendo revisión.
**Decisión:** Se permiten las dos. Si edita en la OC, queda registrado como diferencia auditada (cantidad_pedida vs cantidad_a_comprar). Si devuelve, la OP pasa a estado `devuelta`, la cajera la corrige y la reenvía.
**Razón:** La devolución con nota es el ciclo de educación — la cajera entiende por qué su pedido era excesivo. A mediano plazo, esto forma criterio. Es el corazón del valor del sistema.

## 14. 2026-04-22 — OP sin precio, OC con costo estimado, Compra con precio real
**Contexto:** ¿dónde aparece el precio/costo en el flujo?
**Decisión:**
- **OP:** no lleva precio. La cajera solo pide cantidades.
- **OC:** el supervisor puede cargar un costo estimado por producto (opcional), útil para ver total tentativo antes de enviar al proveedor.
- **Compra:** precio real obligatorio, por línea, tal como vino en el comprobante del proveedor.
**Razón:** La cajera no maneja precios; el supervisor sí pero con precio estimado (referencial); el precio definitivo es el del comprobante físico, que es la fuente de verdad contable.

## 15. 2026-04-22 — Prohibir cerrar OC vacía → anular
**Contexto:** ¿qué pasa si el supervisor baja todas las cantidades a comprar a 0 y luego intenta cerrar la OC?
**Decisión:** No se puede "cerrar" una OC con todas las filas en `cantidad_a_comprar = 0`. En ese caso, el sistema obliga a **anular** la OC.
**Razón:** Si el supervisor decidió no comprarle nada a ese proveedor (todo se repone desde central o se descarta), la acción semánticamente correcta es anular, no cerrar. Cerrar con total 0 ensucia reportes y confunde el estado del sistema.

## 16. 2026-04-22 — `cantidad_pedida` inmutable una vez enviada la OP
**Contexto:** ¿se puede editar el valor original pedido por la cajera después de enviar?
**Decisión:** No. Una vez que la OP pasa de `borrador` a `enviada`, `cantidad_pedida` es inmutable. Lo que se edita es `cantidad_a_comprar` dentro de la OC (que es una entidad distinta).
**Razón:** La `cantidad_pedida` es el dato histórico sobre el que se mide el criterio de la cajera. Si se edita, se pierde la base del reporte "qué pidió vs qué se compró vs qué se vendió", que es la herramienta del dueño para evaluar comportamiento.

## 17. 2026-04-22 — OC anulada → OPs vuelven a `pendiente`
**Contexto:** ¿qué pasa con las OPs que estaban agrupadas dentro de una OC que se anula?
**Decisión:** Al anular una OC, las OPs asociadas vuelven al estado `enviada` (o `pendiente de OC`), disponibles para ser agrupadas en una nueva OC.
**Razón:** La OP no se pierde ni se marca como "ya procesada". La decisión del supervisor fue descartar esa OC puntual, no descartar lo que las cajeras pidieron. El pedido original sigue vivo hasta que entre en otra OC o la cajera misma lo dé de baja.

## 18. 2026-04-22 — Compra permite agregar productos fuera de OC con flag
**Contexto:** Llegó un producto que no estaba en la OC (el proveedor mandó algo extra o el supervisor aprovechó el viaje). ¿Se registra o se ignora?
**Decisión:** Se permite agregar líneas a la Compra que no existían en la OC, con:
- Flag `fuera_de_oc = true` en la línea.
- Campo `justificacion` obligatorio.
**Razón:** La realidad de un proveedor informal es que manda cosas extra o que el supervisor aprovecha. Obligar a que todo pase por OC formal genera data sucia (compras sin registrar o falseadas). Mejor dejar el agujero controlado y medible.

## 19. 2026-04-22 — Admin separado del supervisor con roles y permisos distintos
**Contexto:** ¿el dueño usa el mismo usuario y UI que el supervisor, o tiene entorno propio?
**Decisión:** Admin tiene:
- Usuario propio con rol `admin` en Supabase.
- UI propia, mobile-first, centrada en reportes.
- Permisos de solo lectura sobre todas las entidades + configuración de parámetros globales (día de OP, locales, proveedores, cajeras activas/inactivas).
- NO puede crear OCs ni confirmar Compras (eso es trabajo del supervisor).
**Razón:** Separar "quien decide qué comprar" de "quien mira los resultados". Si el admin también opera, se pierde la figura del supervisor como filtro.

## 20. 2026-04-22 — Reposición desde central = marca en MultiCompra, acción fuera
**Contexto:** Cuando el supervisor baja una `cantidad_a_comprar` a 0 porque decide reponer desde central, ¿qué hace MultiCompra?
**Decisión:**
- Se agrega el campo booleano `repone_desde_central` en la fila de la OC (o en la OP enlazada, según se defina en modelo — a validar con MultiCompraArquitecto).
- MultiCompra **no genera ninguna acción automática**. Es una **marca** para reporte: permite al admin filtrar "qué se reponía desde central vs qué se compraba".
- La acción real (generar el traslado central → local) la hace el supervisor o alguien de su equipo en el **sistema base del cliente**, manualmente.
**Razón:** Alineado con la decisión 7 — los traslados no viven en MultiCompra. Pero necesitamos dejar rastro de la intención del supervisor para que el reporte del admin tenga sentido.

## 21. 2026-04-22 — Edición de OC con fila por pedido individual, agrupada por producto (V3)
**Contexto:** Al probar el primer mockup de la planilla (V2 — fila master por producto con sub-filas expandibles por local), Shirley notó que la **jerarquía visual estaba invertida**. El sistema le mostraba primero el producto agregado y recién al expandir aparecía el pedido concreto de cada local, pero lo que ella decide en la vida real es **pedido por pedido**: "este local ¿realmente necesita lo que pidió?". La unidad de decisión no es el producto agregado; es el pedido individual (local × producto). El agregado es consecuencia, no insumo de la decisión.

El flujo mental de Shirley, pedido por pedido, es:
1. ¿El local ya tiene stock suficiente? → **No necesita** (descarta el pedido).
2. Si hace falta, ¿hay stock en central? → **Repone desde central** (se gestiona fuera, marca para reporte).
3. Si no hay central o decide no usarlo, **comprar X cantidad** al proveedor.

Encapsular eso en una fila master obliga a expandir antes de poder actuar y empuja a tomar decisiones a nivel producto, que no es como funciona la cabeza de Shirley.

**Opciones consideradas:**
- **V1 (descartada, inicial):** Tabla plana por producto, con una sola fila por producto y stock central como única guía. No permitía ver por qué cada local pidió esa cantidad ni chequear si ya lo tenía → Shirley decidía "a ojo".
- **V2 (descartada, iterada):** Fila master por producto + sub-filas expandibles por local con acciones (bajar / ignorar / restaurar). Mejoró el V1 al traer stock local, pero mantuvo el producto como fila primaria y escondió la decisión real detrás de un chevron.
- **V3 (elegida):** **Fila por pedido individual (local × producto)**, agrupada visualmente por producto con un **encabezado agrupador fino** que muestra nombre del producto, código de barras, stock central, costo unitario, total a comprar del grupo y alerta si el total a reponer excede el stock central. La fila primaria es el pedido; la agrupación es solo visual (no colapsable) y sirve para contextualizar sin esconder información.

**Decisión: V3.**

Detalles del modelo V3:
- Columnas de la **fila pedido**: checkbox bulk · Local (ícono + nombre + OP origen) · Pidió (read-only, mono) · Stock local (read-only, mono) · Excedente (calculado, verde si ≥ 0, gris si < 0) · Decisión (grupo de 3 botones-radio: "No necesita" / "Repone central" / "Comprar X") · Auditoría (ícono).
- **Decisión** explícita por pedido, 3 estados mutuamente excluyentes:
  - *No necesita* (default si excedente ≥ 0): el pedido se descarta, opacidad reducida (60%) para diferenciarse.
  - *Repone central*: habilitado solo si `stock_central > 0`, muestra chip "disp: X" con la disponibilidad; fondo azul claro cuando está activo.
  - *Comprar [cantidad]*: input editable; default = `max(0, pidió - stock_local)` o el pedido completo si excedente < 0.
- **Encabezado agrupador** (no colapsable, fino, gris claro) muestra:
  - Nombre del producto + código de barras.
  - Stock central (con chip de timestamp global del snapshot).
  - Costo unitario.
  - Total a comprar del grupo (suma de `cantidadComprar` de los pedidos con `decision='comprar'`), recalculado en tiempo real.
  - Alerta "Central insuficiente" (píldora roja) cuando la suma de `repone_central` supera el `stock_central` del producto — señal a Shirley de que se está excediendo.
- **Filas con edición manual** respecto del default (cambiaron decisión o ajustaron cantidad comprar) se resaltan con fondo amarillo suave para marcarlas como editadas.
- **Bulk actions**: marcar N pedidos y aplicar "No necesita" / "Comprar todo lo pedido" / "Repone central (si alcanza)".
- **Filtros**: búsqueda por producto o local, chips "Solo editados" / "Solo con excedente" / "Solo a comprar" / "Central insuficiente".
- **Footer sticky**: contadores (X no necesita, Y repone central, Z a comprar) y **Total OC** (suma de `cantidadComprar × costoUnitario` agrupado por producto). Botón "Cerrar OC" deshabilitado si Total OC = 0.
- **Accesibilidad**: cada fila pedido es un `<tr role="row">`. Los 3 botones forman un `role="radiogroup"`; navegación con Tab al grupo y flechas izquierda/derecha (o arriba/abajo) dentro. `aria-checked` refleja el estado. Input de "Comprar" focusable con Tab cuando ese botón está activo.

**Razón:**
- La jerarquía visual **sigue al flujo mental real**. Shirley decide pedido por pedido, no producto por producto. El producto es un contexto (stock central, costo, total acumulado), no la unidad de acción.
- El encabezado agrupador reemplaza al master colapsable: la info clave del producto está siempre a la vista, sin esconderla detrás de un chevron.
- La alerta "Central insuficiente" en el encabezado es más útil a nivel grupo (donde se suman los reponeCentral) que repetida en cada sub-fila.
- Shirley puede scrollear la tabla entera y ver en cada pedido, de un vistazo, qué sugiere el sistema y si hay que cambiarlo; con V2 tenía que abrir producto por producto.

**Supuestos y pendientes:**
- Default del sistema para cada pedido: `no_necesita` si excedente ≥ 0, `repone_central` si stock_central > 0 y falta en el local, `comprar` con faltante si no hay central. Shirley puede cambiarlo siempre — es solo una guía. **Pendiente Producto**: confirmar que estos defaults están alineados con el criterio real.
- **Pendiente Arquitecto**: modelo de datos para persistir el pedido individual. Opciones:
  - (a) Tabla `oc_pedido` con `op_id`, `local_id`, `producto_id`, `pidio`, `stock_local_snapshot`, `decision`, `cantidad_comprar`, enlazada a `oc_id`.
  - (b) Reusar la tabla `oc_linea_fuente` ya propuesta en la versión anterior, renombrando campos.
- **Pendiente Producto**: ¿el supervisor puede marcar "Repone central" aunque el stock central no alcance, dejando la decisión de cubrir el faltante al sistema base del cliente? (en V3 la opción se habilita si central > 0, pero no valida que central cubra; solo dispara alerta).

## 22. 2026-04-22 — Sidebar colapsado por defecto en pantallas tipo planilla
**Contexto:** El sidebar global del supervisor ocupa 220px de ancho. En pantallas densas como la planilla de edición de OC (con tabla de muchas columnas + decisiones inline), ese espacio "roba" ancho útil para escanear la tabla. En una notebook de 1366px esto se siente especialmente.

**Opciones consideradas:**
- **A (elegida)**: Colapsar el sidebar por defecto solo en pantallas tipo planilla (clase `page-dense`). Queda en ~56px con íconos y tooltip al hover. El botón hamburguesa lo expande temporal a 200px; queda un poco más angosto que los 220 default. La preferencia del usuario (expandido/colapsado) se persiste en `localStorage`.
- **B**: Achicar el sidebar global para todas las pantallas. Descartada: en pantallas menos densas el sidebar con texto ayuda a la navegación; no hay razón para penalizarlas.
- **C**: Sacar el sidebar completamente en pantallas densas. Descartada: pierde el acceso rápido entre secciones (OCs, OPs, Compras).

**Decisión:** **A.**

Detalles de implementación:
- Clase `page-dense` en el contenedor `.app` → activa colapso por defecto.
- Clase `sidebar-forced-open` (toggle por el usuario) → expande a `--sidebar-w-dense` (200px).
- `localStorage` clave `multicompra.sidebar.forceOpen` (`"true"` / `"false"`).
- Tooltip on-hover sobre cada `nav-item` colapsado usando `data-label` attribute.
- Otras pantallas (cajera, admin, dashboard supervisor) no llevan `page-dense` → sidebar expandido por defecto como hoy.

**Razón:** Shirley vive en esa planilla. El ancho vale más que el acceso rápido a otras secciones, que se mantiene disponible en 1 click sobre el ícono hamburguesa. La persistencia en `localStorage` respeta la preferencia individual: si Shirley prefiere tenerlo expandido, lo deja así y no se le olvida entre sesiones.

## 23. 2026-04-22 — Sistema semántico de colores en planilla de OC (5 significados)
**Contexto:** La V3 de la planilla mezclaba señales: la opacidad 60% marcaba "no necesita", el amarillo marcaba "editado" pero también pintaba la fila entera (tapaba el fondo de decisión), el azul claro marcaba "repone central". Había colisión entre "qué se decidió" y "fue editado manualmente", y el uso de opacidad para distinguir estado es una señal débil y accesible mal (daltonismo, contraste).

**Decisión:** Separar en dos dimensiones ortogonales:

- **Fondo de fila = estado de la decisión** (una sola por vez):
  - Verde tenue (`--decision-no-bg`) → "No necesita". Reemplaza la opacidad 60% anterior.
  - Azul tenue (`--decision-central-bg`) → "Repone desde central".
  - Neutro / sin fondo (`--decision-comprar-bg` transparente) → "Comprar" default.
  - Rojo tenue (`--decision-pendiente-bg`) → crítico / pendiente de decidir (stock central 0 y sin decisión tomada).
- **Borde lateral izquierdo ~3px ámbar** (`--edit-mark`) = marca de edición manual. Clase `row--edited`. Combinable con cualquier fondo de decisión. Implementado con `box-shadow: inset 3px 0 0 0 var(--edit-mark)` en la primera celda sticky para no romper `border-collapse: separate`.

**Refuerzo por ícono** (para daltonismo) al lado del selector de decisión:
- No necesita → check ✓
- Repone central → flecha circular ↺
- Comprar → carrito
- Pendiente / crítico → triángulo con signo de exclamación

Ningún significado depende solo del color: siempre hay etiqueta + ícono + (cuando aplica) borde.

**Variables CSS nuevas en `shared/styles.css`**, definidas dos veces (`:root` light y `[data-theme="dark"]` dark):
`--decision-no-bg`, `--decision-no-border`, `--decision-no-text`
`--decision-central-bg`, `--decision-central-border`, `--decision-central-text`
`--decision-comprar-bg`, `--decision-comprar-border`, `--decision-comprar-text`
`--decision-pendiente-bg`, `--decision-pendiente-border`, `--decision-pendiente-text`
`--edit-mark`

Clases de fila: `row--decision-no`, `row--decision-central`, `row--decision-comprar`, `row--decision-pendiente`, `row--edited`.

**Razón:** Dos dimensiones ortogonales significan dos señales independientes sin colisión. Shirley puede ver de un vistazo "qué está decidido y además qué toqué yo" en la misma fila. Reemplazar opacidad por color tenue mejora contraste y accesibilidad. El borde lateral es una convención universal para "modificado" que no pelea con el fondo.

## 24. 2026-04-22 — Soporte light / dark mode con toggle, localStorage y prefers-color-scheme
**Contexto:** Shirley (y cualquier otro usuario) puede tener preferencia de tema del SO. Forzar un solo tema sin respetar esa preferencia se nota feo, especialmente en una planilla que se mira por muchas horas.

**Decisión:** Soportar ambos modos desde los mockups base.

- Todas las variables de color definidas en `:root` (light) y sobreescritas en `[data-theme="dark"]` sobre el `<html>`.
- **Primera visita:** respeta `prefers-color-scheme` del sistema operativo.
- **Toggle** en el header (ícono sol/luna, al lado del avatar) cambia el tema con un click. Accesible por teclado (`aria-label="Cambiar tema claro / oscuro"`).
- **Persistencia:** `localStorage` clave `multicompra:theme`, valores `"light"` / `"dark"`.
- **Al recargar:** lee `localStorage` primero; si no hay, cae a `prefers-color-scheme`.
- **Anti-flash:** mini script inline en el `<head>` de cada HTML, antes del `<link>` del CSS, que setea `data-theme` sobre `<html>` según la prioridad de arriba. Así no hay parpadeo blanco al cargar en dark.
- **Transición suave** (≤ 200ms) en elementos estructurales (`body`, header, sidebar, footer, botones). Las tablas grandes NO tienen transition de tema para evitar lag en planillas de cientos de filas.

**Paleta dark:** placeholder, usa `#0f172a` / `#1e293b` / `#273346` como superficies, texto `#e2e8f0` / `#f8fafc`, evita negro puro. Contraste AA mínimo verificado a ojo; la paleta marca (teal → `#2dd4bf` en dark) sigue siendo placeholder — se refina cuando se cierre la identidad visual.

**Razón:** Es un costo bajo hacerlo ahora mientras armamos los mockups (todo token, sin duplicar CSS), y sale gratis cuando migremos a React (las mismas variables CSS funcionan igual). Deja el problema "qué color usamos realmente" para otro momento sin bloquear el avance.

## 25. 2026-04-23 — Click fuera del sidebar lo colapsa
**Contexto:** Hoy el sidebar expandido (en pantallas `page-dense`) solo se colapsa con el botón hamburguesa. Click en cualquier otra parte de la UI no hace nada. Es un comportamiento antinatural respecto del patrón estándar de sidebars colapsables en apps web.
**Decisión:** Un click en cualquier parte fuera del sidebar, cuando está expandido en modo `page-dense`, lo colapsa automáticamente. La preferencia se persiste en `localStorage` con la misma clave (`multicompra.sidebar.forceOpen`). El click sobre el propio botón hamburguesa no dispara el colapso (lo toglea normalmente).
**Razón:** Patrón estándar de sidebars colapsables (Drive, Notion, VS Code, etc.). Reduce fricción: Shirley no tiene que apuntar al ícono, cualquier click en la planilla o el área libre libera el espacio.

## 26. 2026-04-23 — Ícono de auditoría por fila = popover inline
**Contexto:** En `oc-editar` hay un botón "Auditoría" por cada fila pedido. Al hacer click, ¿abre panel lateral grande con todo el detalle o popover inline junto a la fila?
**Opciones:**
- A. Panel lateral (drawer) con la auditoría completa de la fila.
- B. Popover inline junto a la fila.
**Decisión:** **B.** Popover inline posicionado al lado de la fila, con mini-lista "OP origen · local · cantidad pedida · cajera". Cierra con click fuera o tecla `Esc`.
**Razón:** Shirley quiere una ojeada rápida sin perder el contexto visual de la planilla. Un drawer grande obliga a cerrarlo antes de volver a trabajar; el popover no rompe el flujo.

## 27. 2026-04-23 — Default 0 al cambiar "Repone central" → "Comprar" con excedente ≥ 0
**Contexto:** Si una fila está en decisión "Repone central" y Shirley la cambia a "Comprar", y el local tenía excedente (stock_local ≥ pedido), ¿qué cantidad sugiere el input de "Comprar"?
**Opciones:**
- A. Lo que pidió originalmente la cajera.
- B. 0.
**Decisión:** **B.** El default es 0. Shirley decide manualmente subir la cantidad si realmente quiere comprar algo.
**Razón:** Si había excedente, el local ya tiene suficiente. Forzar que Shirley suba manualmente evita "comprar por inercia" — si la cantidad quedara en lo pedido por la cajera, un click descuidado terminaría comprando algo que no hacía falta. Con 0 el default es siempre el seguro; lo explícito es el cambio.

## 28. 2026-04-23 — Buscador de productos: startsWith por código, includes por descripción
**Contexto:** En los buscadores de productos (cajera/op-nueva y el modal "Agregar fuera de OC" en compra-verificar) se puede matchear el código de barra con `includes` o `startsWith`.
**Decisión:** `startsWith` para el **código de barra**, `includes` para la **descripción**.
**Razón:** Los códigos de barra se tipean o escanean desde el principio; con `includes` cualquier subcadena mete ruido (por ejemplo, escribir "7840" matchearía con códigos que tienen "7840" en el medio). En descripción, `includes` sí es útil porque se busca por palabra ("cargador", "hidrogel").

## 29. 2026-04-23 — Mínimo 30 caracteres en motivo de excepción de OP
**Contexto:** Al marcar una OP como excepción (fuera del día protocolo), hay un textarea "motivo" con un mínimo de caracteres. ¿Cuántos?
**Opciones:** 20, 30 o 50.
**Decisión:** **30** caracteres mínimo.
**Razón:** 20 es muy poco para justificar algo (no alcanza ni para una frase completa). 50 es exagerado y genera fricción para la cajera. 30 garantiza que el texto sea una oración real y no un "urgente" escueto, sin volverse pesado.

## 30. 2026-04-23 — Post-envío de OP: cajera ve detalle read-only, no pantalla de bloqueo
**Contexto:** Al enviar la OP, ¿la cajera queda en una pantalla de bloqueo genérica ("ya enviaste tu OP") o ve el detalle de lo que acaba de enviar?
**Decisión:** Ve el **detalle read-only** de su OP enviada, con badge "Enviada" y un CTA chiquito aclarando "No podés crear otra hasta que Shirley la procese". Si la cajera intenta **crear una 2da OP** (desde el menú u otro lugar), ahí sí aparece la pantalla de bloqueo con link "Ver mi OP enviada".
**Razón:** Cierre de ciclo natural. Ver lo que acaba de mandar confirma visualmente que el envío funcionó y le recuerda qué pidió. La pantalla de bloqueo genérica esconde su propio trabajo; solo aparece cuando realmente intenta hacer algo prohibido (abrir una segunda OP).

## 31. 2026-04-23 — Dropdown de proveedor: solo catálogo, sin inline creation
**Contexto:** En "Nueva OC", al elegir proveedor, ¿se permite crear uno nuevo inline (tipo "+ Crear proveedor…") o solo se eligen del catálogo existente?
**Decisión:** Solo del catálogo. El alta de proveedor vive en `/admin/config/proveedores`.
**Razón:** Crear un proveedor en el momento del armado de OC es apurado y mete alta sucia (faltan RUC, contacto, condiciones). Forzar el paso previo por admin mantiene la data limpia y evita duplicados "Distribuidora X" / "Distri X SA" creados en caliente.

## 32. 2026-04-23 — Devolver OP = modal con motivo, no pantalla dedicada
**Contexto:** Cuando Shirley devuelve una OP a la cajera con una nota (Decisión 13), ¿es un modal o una pantalla dedicada?
**Decisión:** **Modal** con textarea (mínimo 20 caracteres), botón Cancelar y botón Confirmar. Al confirmar, se saca la OP de la lista y aparece un toast.
**Razón:** Es una acción rápida (escribir 1-2 frases y mandar). Una pantalla completa rompe el flujo: Shirley estaba mirando la lista de OPs y tendría que navegar ida y vuelta. El modal mantiene el contexto.

## 33. 2026-04-23 — Snapshot de stock: máximo 30 min antes de forzar refresh al cerrar OC
**Contexto:** Al cerrar OC, si el snapshot de stock central tiene más de X minutos, se obliga a refrescar antes de dejar avanzar.
**Opciones:** 15 min, 30 min o 60 min.
**Decisión:** **30 minutos**.
**Razón:** 15 min es demasiado agresivo (obligaría refetch casi siempre, y el SP puede estar caro). 60 min es demasiado viejo para tomar decisiones de stock (en 1 hora puede venderse mucho). 30 min es el balance entre "datos frescos" y "no molestar con refresh innecesario".

## 34. 2026-04-23 — WhatsApp: solo link manual (wa.me), sin envío automático
**Contexto:** Al cerrar OC, ¿se envía el WhatsApp automáticamente al proveedor o solo se genera un link?
**Decisión:** Solo se **genera el link** `https://wa.me/[numero]?text=[texto-prefilled]`. Shirley lo abre manualmente y envía desde su WhatsApp. El PDF lo adjunta ella.
**Razón:** El envío automático requiere integración con WhatsApp Business API (costo mensual, complejidad de setup, verificación de cuenta). La generación de link cubre el 100% del caso de uso con costo cero y sin dependencias externas. Si más adelante el volumen justifica la API oficial, se migra sin cambiar el resto.

## 35. 2026-04-23 — "Cerrar OC" y "Marcar enviada al proveedor" = acciones separadas
**Contexto:** ¿Cerrar una OC también la marca automáticamente como enviada al proveedor, o son 2 pasos distintos?
**Decisión:** **2 acciones separadas.** Primero se cierra (estado `cerrada`); después, cuando Shirley efectivamente la mandó al proveedor (por WhatsApp, email, etc.), aprieta manualmente "Marcar como enviada al proveedor" y pasa a `enviada_a_proveedor`.
**Razón:** En la realidad puede pasar un día entre cerrar una OC y efectivamente enviarla (Shirley cierra a la noche, la manda a la mañana siguiente). Unificar los dos estados miente sobre el flujo real y ensucia el reporte de "OCs enviadas hoy". Separar respeta la realidad operativa.

## 36. 2026-04-23 — Checkbox "confirmo que revisé todo" al cerrar OC: se mantiene
**Contexto:** Al cerrar OC ya hay un checklist de validaciones previas que corre automático. ¿Hace falta además un checkbox explícito "confirmo que revisé todo" o es redundante?
**Decisión:** Mantener el checkbox.
**Razón:** El checklist automático valida reglas duras (proveedor asignado, al menos 1 línea, snapshot reciente, nada pendiente). El checkbox agrega un freno humano contra errores por velocidad: Shirley conscientemente firma que revisó. Es un costo mínimo de fricción a cambio de un doble freno contra cierres equivocados.

## 37. 2026-04-23 — Al confirmar Compra con total_factura ≠ suma_líneas: se bloquea salvo justificación
**Contexto:** Hoy al confirmar Compra, si el total de la factura no coincide con la suma de las líneas, se mostraba una alerta pero igual se dejaba confirmar. ¿Bloqueamos?
**Decisión:** **Se bloquea** el botón de confirmación del modal final. Si Shirley quiere avanzar pese a la diferencia, aparece un textarea **obligatorio** "Justificar diferencia (mínimo 30 caracteres)". Recién con justificación completa se habilita el botón.
**Razón:** Sin bloqueo, confirmar con total mal es demasiado fácil (un click más y queda). La justificación (descuento, bonificación, error de carga del proveedor, etc.) queda en auditoría y permite al admin revisar esos casos. Si realmente hay una razón legítima, escribir 30 caracteres no es carga excesiva.

## 38. 2026-04-23 — Justificación obligatoria en líneas de Compra con diferencia vs OC
**Contexto:** Al confirmar Compra, las líneas donde `cantidad_recibida ≠ cantidad_esperada` (más, menos, cero), ¿requieren justificación obligatoria o solo opcional?
**Decisión:** **Obligatoria.** Dropdown con motivo tipificado (`faltante` / `sobrante` / `producto_distinto` / `otro`) + texto opcional complementario. Si quedan líneas con diferencia sin justificar, el botón del modal final queda bloqueado y se listan cuáles faltan, con link de acción "Ir a justificar" que scrollea a esa fila.
**Razón:** Sin justificación, el reporte de auditoría pierde valor: no se puede detectar patrones (por ejemplo, "el proveedor X siempre entrega menos"). Con motivo tipificado, el admin puede agregar por tipo y tomar decisiones comerciales. El dropdown acotado (4 opciones) evita texto libre sucio.

---

## Modelo de estados

### Estados de OP (Orden de Pedido)

```
borrador  →  enviada  →  en_oc  →  cerrada
    ↓           ↓           ↓
 anulada    devuelta    (anulada de OC → vuelve a enviada)
                ↓
            borrador  (cajera corrige y reenvía)
```

Transiciones:
- `borrador → enviada`: cajera confirma y envía al supervisor.
- `borrador → anulada`: cajera descarta antes de enviar.
- `enviada → en_oc`: supervisor agrupa la OP en una OC.
- `enviada → devuelta`: supervisor la devuelve con nota.
- `devuelta → borrador`: cajera la corrige y vuelve a trabajarla.
- `en_oc → cerrada`: la OC que la contenía se cerró (Compra confirmada o cerrada con faltante).
- `en_oc → enviada`: la OC que la contenía se anuló (vuelve al pool).

Campos clave:
- `cantidad_pedida` (inmutable desde `enviada`).
- `motivo_excepcion` (obligatorio si se creó fuera del día protocolo).
- Auditoría: quién creó, cuándo, cambios de estado, quién devolvió, motivo.

### Estados de OC (Orden de Compra)

```
abierta  →  enviada_a_proveedor  →  parcialmente_recibida  →  cerrada
   ↓             ↓                         ↓                     ↓
anulada      anulada               cerrada_con_faltante      (final)
                                          ↓
                                     cerrada (si después llega el resto)
```

Transiciones:
- `abierta → enviada_a_proveedor`: supervisor cierra el armado, genera PDF/Excel/WhatsApp.
- `abierta → anulada`: supervisor descarta (todas las filas quedaron en 0 o cambió de idea). Las OPs asociadas vuelven a `enviada`.
- `enviada_a_proveedor → parcialmente_recibida`: llegó una Compra parcial y el supervisor decide mantener la OC abierta.
- `enviada_a_proveedor → cerrada`: Compra completa confirmada.
- `parcialmente_recibida → cerrada_con_faltante`: supervisor decide cerrar asumiendo que no llega más.
- `parcialmente_recibida → cerrada`: llegó el resto en una 2da Compra.

Campos clave por grupo producto (derivados / contexto, no persistidos como entidad separada — ver pendiente Arquitecto en Decisión 21):
- `producto_id`, `barras`, `nombre`.
- `costo_estimado` (opcional, editable a nivel grupo si hace falta más adelante).
- `stock_central_snapshot` al momento de decidir.

Campos clave por **pedido individual** (fila real de la planilla V3, ver Decisión 21):
- `op_id`, `local_id`, `producto_id` (trazabilidad).
- `pidio` (inmutable — cantidad que pidió el local en la OP).
- `stock_local_snapshot` (snapshot del stock del local al abrir la OC).
- `decision` ∈ {`no_necesita`, `repone_central`, `comprar`}.
- `cantidad_comprar` (solo relevante si `decision='comprar'`).
- `decision_default`, `cantidad_comprar_default` (para detectar edición manual y alimentar filtro "Solo editados").

### Estados de Compra

```
precargada  →  en_verificacion  →  confirmada
     ↓                                  
  anulada                           
```

Transiciones:
- `precargada`: se creó la Compra tomando datos de la OC.
- `precargada → en_verificacion`: supervisor arranca el chequeo físico del comprobante.
- `en_verificacion → confirmada`: supervisor confirma (impacta stock vía API, cierra o actualiza OC).
- `precargada → anulada` / `en_verificacion → anulada`: se descarta la Compra antes de confirmar.

Campos clave por línea:
- `cantidad_recibida`, `precio_real` (obligatorio al confirmar).
- `fuera_de_oc` (booleano) + `justificacion` (si `fuera_de_oc = true`).
- Diferencias calculadas automáticamente (cantidad_a_comprar vs cantidad_recibida, costo_estimado vs precio_real).

---

## Pendientes

### Para MultiCompraUX
- [ ] Árbol de pantallas y rutas para los **3 perfiles** (cajera, supervisor, admin).
- [ ] Mockup de la pantalla más crítica: **editar OC del supervisor** (planilla densa con inline edit, filtros, bulk actions, marca `repone_desde_central`).
- [ ] Mockup de **OP de excepción** (cómo se presenta el campo `motivo_excepcion`).
- [ ] Mockup de **devolución de OP con nota**.
- [ ] Mockup del **dashboard del admin en mobile** (reportes clave: OPs vs Compras vs Ventas, OPs fuera de protocolo por cajera, stock muerto).
- [ ] Flujo de **Compra con diferencias** y selección supervisor de `parcialmente_recibida` vs `cerrada_con_faltante`.

### Para MultiCompraArquitecto
- [ ] **Schema completo de Supabase** con tablas OP, OC, Compra, líneas, perfiles, auditoría.
- [ ] Definir si `repone_desde_central` vive en la línea de OC, en la línea de OP, o en ambos lados.
- [ ] **Políticas RLS** por perfil (cajera solo ve sus OPs de su local, supervisor ve todo, admin read-only global).
- [ ] **Edge Function** para wrapper del SP externo (`SPMultiCompra`) vs llamada directa desde el frontend.
- [ ] Cómo se sincroniza el **catálogo de productos** (cache local vs consulta cada vez).
- [ ] Cómo se implementa la **regla de 1 OP abierta por cajera** (constraint en DB vs validación app).
- [ ] Cómo se implementa la **inmutabilidad de `cantidad_pedida`** (trigger DB vs lógica app).
- [ ] Log de auditoría: tabla aparte o columnas `created_by`, `updated_by`, `history`.

### Para MultiCompraProducto (esta ronda no cerró)
- [ ] Confirmar operativamente **cuál es el día fijo de OP** (default lunes, pendiente pregunta a Diego).
- [ ] Definir reporte del admin: lista concreta de KPIs prioritarios.
- [ ] Política de **notificaciones** (WhatsApp/email): cuándo sí, a quién, qué eventos.
- [ ] Qué pasa si una **OP queda olvidada** en estado `enviada` por más de N días sin ser agrupada: ¿recordatorio al supervisor? ¿auto-anulación?
- [ ] Manejo de **productos nuevos** (que la cajera quiere pedir pero aún no están en el catálogo central).
