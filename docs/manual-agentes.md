# Manual — Cómo trabajar con los agentes de MultiCompra

Guía para vos y tu compañero, para que los dos usen los agentes del proyecto de la misma manera y no se pisen.

---

## 1. ¿Qué son los agentes?

Claude Code (la herramienta que estamos usando) permite definir **sub-agentes**: son "asistentes especializados" a los que Claude puede delegarles tareas concretas. Cada sub-agente tiene:

- **Un rol claro** (ej: product owner, diseñador, arquitecto)
- **Un foco específico** (ej: solo diseño, no código)
- **Un contexto precargado** (lee el brief del proyecto, decisiones, memoria) antes de responder
- **Reglas de estilo y de qué NO hacer**, para no salirse de su rol

En la práctica: vos le pedís algo a Claude, y Claude (si es pertinente) llama al sub-agente correcto para que responda con autoridad sobre su tema. También podés pedirle explícitamente que hable con un agente específico.

**¿Por qué usamos agentes en este proyecto?** Porque el riesgo más grande en software custom es que una persona sola (Claude o humano) decida producto, UX y arquitectura al mismo tiempo y termine con una solución mediocre en las tres cosas. Separando responsabilidades, cada decisión pasa por el "especialista" y queda documentada.

---

## 2. Los 3 agentes de MultiCompra

### MultiCompraProducto
**Qué hace:** define **qué hace** el software y **bajo qué reglas**.

**En qué te ayuda:**
- Estados de OP / OC / Compra (borrador, cerrada, anulada, etc.) y qué transiciones son válidas
- Roles y permisos (cajera, supervisor, admin)
- Reglas de edición (¿se puede editar una OP ya enviada? ¿hasta qué estado?)
- Validaciones de negocio (ej: no cerrar OC con todo en cero)
- Casos borde (¿qué pasa si la compra llega parcial? ¿si sobra? ¿si cambió el producto?)
- Reportes de control (qué se pidió vs qué se compró vs qué se vendió)
- Qué se loguea en auditoría

**En qué NO te ayuda:** no propone pantallas ni escribe código. No elige librerías ni tablas.

**Cuándo llamarlo:** cuando tengas una duda funcional. Ej: *"¿cómo debería comportarse una OP si la cajera la deja en borrador 3 días sin enviar?"*

---

### MultiCompraUX
**Qué hace:** diseña **cómo se ve y se usa** el software.

**En qué te ayuda:**
- Árbol de pantallas y rutas (`/supervisor/oc/:id/editar`, etc.)
- Layouts y navegación
- Wireframes y mockups estáticos en HTML/CSS vanilla (sin React todavía)
- Patrones reusables (tabla editable, buscador de productos, badges de estado)
- Guía de estilos base (paleta, tipografía, espaciados)
- Diferenciar UX del supervisor (densa, tipo planilla) de la de cajera (simple)

**En qué NO te ayuda:** no define reglas de negocio ni decide stack técnico. No escribe React todavía (estamos en fase de mockups).

**Cuándo llamarlo:** cuando tengas una decisión de diseño o quieras ver algo maquetado. Ej: *"¿cómo debería verse la pantalla de edición de OC con 80 productos?"*

---

### MultiCompraArquitecto
**Qué hace:** decide **cómo está construido** el software.

**En qué te ayuda:**
- Schema de Supabase (tablas, relaciones, índices)
- Políticas de RLS (seguridad a nivel fila)
- Integración con el SP `SPMultiCompra` del proveedor (¿llamada directa o vía Edge Function?)
- Estrategia de caché del stock central (snapshots, reservas, invalidación)
- Estructura de carpetas del proyecto React
- Manejo de estado (TanStack Query, Zustand, Context)
- Migraciones SQL versionadas
- PWA (manifest, service worker)
- Anticipar problemas: race conditions, API caída, escalabilidad

**En qué NO te ayuda:** no define features ni dibuja pantallas.

**Cuándo llamarlo:** cuando haya una decisión técnica. Ej: *"¿las llamadas al SP las hacemos desde el browser o desde Supabase Edge Functions?"*

---

## 3. Cómo invocar a un agente

En Claude Code, hay 3 formas de que un agente entre en juego:

### 3.1 Claude lo decide automáticamente
Si tu mensaje coincide con la descripción del agente, Claude puede invocarlo sin que lo pidas. Ej: si escribís *"¿qué estados deberían tener las OPs?"*, Claude suele llamar a **MultiCompraProducto** por su cuenta.

### 3.2 Lo pedís por nombre
Si querés asegurarte, escribí explícitamente:

> *"Pasale esto a **MultiCompraProducto**: ¿qué pasa si una cajera intenta cerrar una OP sin productos?"*

O:

> *"Que **MultiCompraUX** me proponga el árbol de pantallas de la app."*

Claude va a invocar al agente nombrado y te trae la respuesta.

### 3.3 Lo pedís por tema
Si no te acordás el nombre:

> *"Necesito ayuda con el diseño de las pantallas, ¿quién se encarga?"*

Claude te va a indicar qué agente corresponde y lo llama.

---

## 4. Flujo de trabajo recomendado

### Regla de oro
**No saltees agentes.** Si una pantalla depende de reglas de negocio no definidas, hablá primero con Producto. Si querés codear algo pero no está la arquitectura pensada, hablá primero con Arquitecto. Saltear genera retrabajo.

### Flujo típico de una nueva funcionalidad

```
1. [Producto]    Definir qué hace, bajo qué reglas, edge cases
       ↓
2. [UX]          Proponer cómo se ve, maquetar, iterar
       ↓
3. [Arquitecto]  Diseñar schema, definir integración, estado, caché
       ↓
4. [Claude main] Codear feature (recién acá se escribe código)
```

### Flujo para una duda puntual
A veces no es una feature nueva, es una duda chica. Ahí llamás a un solo agente:
- *"¿Qué estados debería tener una Compra?"* → **Producto**
- *"¿Dónde pongo el botón de refresh del stock central?"* → **UX**
- *"¿Qué tipo de dato uso para guardar `cantidad_a_comprar`?"* → **Arquitecto**

### Fase actual del proyecto
**Estamos en fase de diseño + mockups.** Ningún agente debería estar escribiendo código React o SQL de features. Si ves que uno arranca a codear una feature completa, algo se saltó. Lo único que se codea ahora:
- **Mockups HTML/CSS estáticos** (los hace **MultiCompraUX** en `mockups/`)
- **Documentación** (docs/ del repo)

---

## 5. Dónde vive cada cosa

```
Documents/GitHub/multicompra/
├── docs/
│   ├── contexto.md          ← brief original del cliente (no lo edites salvo corrección)
│   ├── decisiones.md        ← log de decisiones cerradas (se actualiza cuando se cierra algo)
│   └── manual-agentes.md    ← este archivo
├── mockups/                 ← todas las pantallas en HTML/CSS vanilla (lo llena UX)
├── supabase/
│   └── migrations/          ← SQL versionado (vacío hasta que arranquemos código)
└── src/                     ← código React (vacío hasta que cerremos mockups)
```

**Memoria persistente de Claude** (fuera del repo):
- `C:\Users\Administrador\.claude\projects\C--Users-Administrador\memory\project_multicompra.md` — contexto que Claude lee en cada sesión nueva. Se actualiza cuando hay decisiones importantes o cambia la fase del proyecto.

**Definición de los agentes**:
- `C:\Users\Administrador\.claude\agents\multicompra-producto.md`
- `C:\Users\Administrador\.claude\agents\multicompra-ux.md`
- `C:\Users\Administrador\.claude\agents\multicompra-arquitecto.md`

---

## 6. Cómo actualizar el proyecto

### Cuando se cierra una decisión importante
1. El agente propone opciones con trade-offs.
2. Vos elegís.
3. El agente (o vos, o Claude main) **agrega la decisión a `docs/decisiones.md`** con fecha, opciones consideradas, decisión y razón.
4. Si la decisión cambia cosas de contexto (fase, stack, usuarios, etc.), también se actualiza `project_multicompra.md` en la memoria.
5. Commit al repo con mensaje claro.

### Cuando cambia la fase
Ej: cuando terminemos mockups y arranquemos código.
1. Actualizar `project_multicompra.md` → campo "Fase actual".
2. Actualizar `README.md` del repo.
3. Anunciarlo en la conversación con Claude para que los agentes lo tengan presente.

### Cuando aparece un agente nuevo
Ej: si más adelante hace falta un **MultiCompraQA** para testing.
1. Crear el `.md` del agente en `C:\Users\Administrador\.claude\agents\`.
2. Agregarlo a `project_multicompra.md` en la sección "Sub-agentes".
3. Agregarlo a este manual.

---

## 7. Cosas que NO hay que pedirle a los agentes

| Qué | Por qué |
|---|---|
| Decisiones urgentes sin contexto | Los agentes leen el contexto antes de responder — si no está documentado, primero documentalo. |
| Opiniones personales o generales ("¿qué te parece mi idea?") | Los agentes piensan en función del proyecto, no hacen coaching. Preguntá cosas concretas. |
| Cosas de otros proyectos (NODO, XMLBox, etc.) | Estos agentes son solo para MultiCompra. Para NODO hay otros agentes (ver `MEMORY.md`). |
| Código de feature completa en fase de mockups | Estamos diseñando, no construyendo. Si un agente arranca a codear, lo frenás. |
| Escribir en inglés | Todos trabajan en español paraguayo/rioplatense. |

---

## 8. Checklist antes de pedir que se escriba código de feature

Antes de que Claude (o un agente) empiece a codear una feature real (no mockup), confirmá:

- [ ] **Producto** fijó los estados y transiciones de la entidad involucrada
- [ ] **Producto** fijó los roles y permisos aplicables
- [ ] **UX** tiene mockup de la pantalla aprobado
- [ ] **Arquitecto** tiene el schema de Supabase definido
- [ ] **Arquitecto** definió la estrategia de integración con el SP si aplica
- [ ] La decisión está en `docs/decisiones.md`
- [ ] Entendés vos (humano) el flujo completo — si no lo entendés, no lo codees

Si 1 de los 7 no está listo, volvé al agente que corresponda antes de codear.

---

## 9. Plantillas rápidas de prompts

### Consulta a Producto
> *"Pasá esto a **MultiCompraProducto**: [describir situación]. ¿Qué regla aplica? Si hay más de una opción, dame trade-offs."*

### Pedido de mockup a UX
> *"Que **MultiCompraUX** mockee la pantalla de [X]. Tomá como base las reglas de [Y] que ya cerramos con Producto. Uná mockup HTML/CSS estático, sin React."*

### Consulta a Arquitecto
> *"**MultiCompraArquitecto**: necesito diseñar [X]. ¿Cuáles son las opciones, qué trade-offs tienen, qué recomendás?"*

### Cerrar una decisión
> *"Ok, vamos con la opción B. Documentala en `docs/decisiones.md` y, si cambia algo de la memoria del proyecto, actualizá `project_multicompra.md` también."*

---

## 10. FAQ

**¿Mi compañero puede usar los mismos agentes desde su máquina?**
Sí, pero tiene que tener los archivos `.md` de los agentes y de la memoria en su propia `C:\Users\...\.claude\`. Si querés, los podemos pasar a un repo compartido o a un archivo comprimido. Pedilo y lo armo.

**¿Qué pasa si un agente se equivoca o da una respuesta floja?**
Decilo en la conversación: *"Eso no cubre el caso de X, replanteálo."* El agente itera. Si el error se repite, puede ser que falte algo en su definición — ahí editamos el `.md` del agente.

**¿Cómo hago para que los dos (vos y tu compañero) no se pisen?**
- Los dos trabajan sobre **el mismo repo** (push/pull a un repo remoto que definan — GitHub, GitLab, lo que sea).
- **Decisiones siempre en `docs/decisiones.md`** — ese archivo es la fuente de verdad.
- Antes de pedirle algo a un agente, leé lo que haya en ese archivo para no reabrir cosas ya cerradas.
- Si los dos trabajan en paralelo, coordínense qué agente está usando cada uno para no abrir la misma pregunta en dos lados.

**¿Puedo saltear a un agente y pedirle todo a Claude directamente?**
Podés, pero pierde la garantía de foco. Los agentes están diseñados para que ninguna decisión importante se tome sin su contexto cargado. Si saltás, Claude va a tomar decisiones con menos pensamiento estructurado.

**¿Los agentes se acuerdan de conversaciones anteriores?**
No tienen memoria de conversación propia. Cada vez que se los invoca leen los mismos archivos (contexto, decisiones, memoria). Por eso es crítico que las decisiones queden escritas en `docs/decisiones.md` — lo que no está ahí, el agente no se entera.

**¿Qué hago si una decisión vieja hay que cambiarla?**
1. Abrila de nuevo con el agente que corresponda.
2. Documentá la nueva decisión en `decisiones.md` con fecha posterior y razón del cambio.
3. No borres la vieja — dejá las dos para histórico.

---

## 11. Contacto entre agentes

Los agentes no se hablan entre ellos directamente. Vos (humano) sos el integrador. Si **Producto** deja algo "a validar con Arquitecto", vos llevás esa pregunta a **Arquitecto** en la próxima tanda.

Claude puede coordinar secuencialmente: *"llamá primero a Producto para cerrar X, después a UX para mockear Y"* — y lo hace, pero siempre con vos en el medio revisando.

---

## 12. Qué hacer hoy, lunes, primer día de trabajo

1. Leer `docs/contexto.md` (5 min)
2. Leer `docs/decisiones.md` (5 min)
3. Leer este manual (10 min)
4. Abrir Claude Code en la carpeta del proyecto
5. Preguntarle: *"Che, ¿en qué está MultiCompra y qué sigue?"*
6. Claude debería resumir el estado y proponer la próxima tarea (probablemente: cerrar estados de OP/OC con **Producto**, o mockup de pantalla de OC con **UX**).

Listo. Si algo de este manual no te cierra, decilo y lo ajustamos.
