# Log de decisiones — MultiCompra

Cada decisión: fecha, contexto, opciones consideradas, decisión, razón.

---

## 2026-04-22 — Dos webs separadas, no una sola con roles
**Contexto:** ¿la PWA es una única app con rutas distintas según rol, o dos webs separadas?
**Decisión:** Dos experiencias bien separadas (`/cajera` y `/supervisor`) dentro del mismo proyecto. Login común (Supabase Auth), pero el layout y el árbol de navegación son independientes.
**Razón:** Las tareas son muy distintas (cajera = simple, supervisor = densa). Compartir layout obligaría a compromisos feos.

## 2026-04-22 — Auth con Supabase, usuarios individuales, cajera asociada a local
**Contexto:** ¿usuarios compartidos por local o uno por cajera?
**Decisión:** Un usuario por persona. En `perfiles` se asocia `local_id` a cada cajera.
**Razón:** Trazabilidad — saber quién cargó qué OP. Si comparten usuario, se pierde accountability.

## 2026-04-22 — 1 OC = 1 proveedor por defecto
**Contexto:** ¿una OC puede ir a varios proveedores?
**Decisión:** Por defecto 1 OC = 1 proveedor. Excepciones a tratar más adelante si aparecen casos reales.
**Razón:** Simplifica el modelo y el flujo de verificación de Compra. Ampliar después si hace falta.

## 2026-04-22 — Protocolo de pedido siempre externo al software
**Contexto:** ¿el software impone el criterio de cuánto pedir, o solo ejecuta?
**Decisión:** Externo. El software registra y disciplina; el criterio sigue siendo humano.
**Razón:** El usuario ya tiene un protocolo definido; el software no debería duplicar ni reemplazar eso. Además, meter reglas automáticas sin tener data de ventas es riesgoso.

## 2026-04-22 — Stock central: snapshot híbrido con refresh
**Contexto:** ¿caché periódico vs consulta en vivo al SP para ver stock del depósito central?
**Opciones:**
- **En vivo puro:** datos reales pero latencia, fragilidad ante caída del SP.
- **Caché puro:** rápido pero arriesga decisiones sobre stock desactualizado.
- **Híbrido con snapshot:** bulk al abrir OC (solo productos de las OPs agrupadas), timestamp visible, botón refresh, refetch final al cerrar OC. Tabla `reservas_central` en Supabase para evitar que 2 supervisores "gasten" el mismo stock.
**Decisión:** Híbrido con snapshot.
**Razón:** Balance entre UX y datos confiables. El snapshot definitivo al cerrar la OC también sirve para auditoría ("qué stock vio el supervisor cuando decidió").

## 2026-04-22 — Stack: React + Vite + Supabase + Cloudflare Pages
**Contexto:** ¿vanilla JS (como nodoengineweb) o React (como Pulso Desk y CRM-contactos)?
**Decisión:** React + Vite + Supabase + Cloudflare Pages.
**Razón:** Patrón ya validado por el usuario en otros proyectos en producción, tooling moderno, componentes reusables (clave para la planilla editable de OC).

## 2026-04-22 — Fase actual: mockups antes de código
**Contexto:** ¿arrancamos maquetando o codeando?
**Decisión:** Mockups HTML/CSS estáticos primero. Cuando las pantallas estén cerradas, recién se pasa a React.
**Razón:** Iterar UI es más barato en HTML plano que montando React con estado y routing desde el día 1.

---

## Pendientes (requieren conversación con sub-agentes)

- [ ] **Estados de OP / OC / Compra** y transiciones válidas → MultiCompraProducto
- [ ] **Roles completos** (cajera, supervisor, ¿admin?) y matriz de permisos → MultiCompraProducto
- [ ] **¿Compra parcial o con sobrantes?** ¿cómo se maneja la diferencia? → MultiCompraProducto
- [ ] **Reposición desde central** ¿genera orden de traslado separada? → MultiCompraProducto + MultiCompraArquitecto
- [ ] **Árbol de pantallas y rutas** → MultiCompraUX
- [ ] **Mockup de la pantalla más crítica** (editar OC del supervisor) → MultiCompraUX
- [ ] **Schema completo de Supabase + políticas RLS** → MultiCompraArquitecto (después de cerrar reglas con Producto)
- [ ] **Edge Function para wrapper del SP** vs llamada directa → MultiCompraArquitecto
- [ ] **Cómo se sincroniza el catálogo de productos** (cache local vs consulta cada vez) → MultiCompraArquitecto
