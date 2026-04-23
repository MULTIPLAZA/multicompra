# Mockups MultiCompra

Mockups estáticos HTML/CSS/JS vanilla para iterar el diseño de MultiCompra antes de codear en React.

Punto de entrada: [`index.html`](./index.html) (catálogo de pantallas) o [`login.html`](./login.html) (acceso a la app con usuarios demo).

## Cómo correr localmente

Los mockups usan módulos ES6 (`<script type="module">`) y `import` desde `shared/mock-data.js`. Por eso **no funcionan con doble click en el HTML** (CORS bloquea `file://`). Hace falta un servidor HTTP.

### Opción 1 — Python

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra\mockups
python -m http.server 8000
```

Abrir en el navegador: <http://localhost:8000>

### Opción 2 — npx serve (Node)

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra\mockups
npx serve -p 8000
```

Abrir: <http://localhost:8000>

### Opción 3 — Wrangler (simula Cloudflare Pages, respeta `_headers` y `_redirects`)

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra
npx wrangler pages dev mockups
```

## Deploy a Cloudflare Pages

Ver [`../DEPLOY.md`](../DEPLOY.md) — guía paso a paso para publicar el catálogo en `https://multicompra.pages.dev`.

## Estructura de carpetas

```
mockups/
├── index.html                  catálogo de mockups (home pública)
├── login.html                  login común + 3 usuarios demo
├── README.md                   este archivo
├── _headers                    headers HTTP para Cloudflare Pages
├── _redirects                  redirects (raíz → index.html)
├── shared/
│   ├── styles.css              variables CSS + reset + componentes base
│   ├── mock-data.js            datos mock (productos, OPs, OC, dashboard admin, etc.)
│   └── ui.js                   helpers UI compartidos (initSidebarClickOutside)
├── cajera/
│   └── op-nueva.html           carga simple de OP
├── supervisor/
│   ├── oc-nueva.html           armar OC desde OPs pendientes
│   ├── oc-editar.html          planilla crítica: editar OC (V3)
│   ├── oc-cerrar.html          cerrar OC + WhatsApp + PDF
│   └── compra-verificar.html   verificar Compra contra OC
└── admin/
    └── dashboard.html          dashboard mobile-first
```

## Qué contiene cada archivo

| Archivo | Qué muestra |
|---|---|
| `index.html` | Catálogo visual agrupado por perfil (Acceso · Cajera · Supervisor · Admin). Punto de entrada público. |
| `login.html` | Form de email + contraseña con validación decorativa y sección expandible con 3 cards de usuarios demo (Carolina, Shirley, Diego) que redirigen a cada experiencia. |
| `shared/styles.css` | Tokens CSS (light/dark), reset, tipografía, componentes base. Decisión 23 (colores semánticos) y 24 (light/dark) aplicadas. |
| `shared/mock-data.js` | 25 productos, OPs pendientes + agrupadas, OC V3, Compra en verificación, datos del dashboard admin. |
| `shared/ui.js` | `initSidebarClickOutside()` — colapso de sidebar al hacer click fuera (Decisión 25). |
| `cajera/op-nueva.html` | Carga simple de OP con buscador, lista editable y check de excepción. |
| `supervisor/oc-nueva.html` | Armar OC seleccionando OPs pendientes con filtros. |
| `supervisor/oc-editar.html` | **Pantalla crítica.** Planilla densa V3: fila por pedido (local × producto), decisión explícita, colores semánticos. |
| `supervisor/oc-cerrar.html` | Checklist de validación + resumen económico + link wa.me. |
| `supervisor/compra-verificar.html` | Planilla de verificación con cantidad/costo editable, justificaciones, agregar fuera de OC. |
| `admin/dashboard.html` | Mobile-first con KPIs, alertas, ajuste por cajera, reposición central y timeline. Bottombar en mobile / sidebar en desktop. |

## Aviso sobre colores

La paleta sigue siendo **placeholder**. Ya hay sistema semántico aplicado (fondo = decisión, borde = edición manual) y light/dark funcional. La identidad visual de marca se refina en sesión aparte.

## Aviso sobre responsive

- **Supervisor**: desktop-first (1366×768 mínimo, ideal 1920×1080). Planilla densa.
- **Cajera**: desktop simple, inputs y tipografía grandes.
- **Admin**: **mobile-first** (375×667 mínimo). Degrada limpio a desktop con sidebar y grid 2-3 columnas.
- **Login + index**: responsive puro, sin layouts densos.

## Stack futuro vs mockups

Esto es solo HTML/CSS/JS vanilla para iterar diseño. **No es código de producción.** La app real va en React + Vite + Supabase + Cloudflare Pages, reusando patrones visuales (no el código).
