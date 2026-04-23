# Deploy de MultiCompra a Cloudflare Pages

Guía paso a paso para publicar los mockups en una URL pública, usando GitHub + Cloudflare Pages.

> Build output = `mockups/`. No hay build step: son archivos estáticos HTML/CSS/JS.

---

## 1. Subir el repo a GitHub

Si el repo ya está en GitHub, saltá al paso 2.

### Con `gh` CLI (recomendado)

Abrí una terminal en la carpeta del proyecto:

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra
gh repo create multicompra --public --source=. --remote=origin --push
```

Si preferís que el repo sea privado, cambiá `--public` por `--private`.

### Vía web (sin `gh` CLI)

1. Entrá a <https://github.com/new>
2. Nombre: `multicompra`. Visibilidad a gusto.
3. **No** inicialices con README, .gitignore ni license (ya los tenés locales).
4. Cuando te muestre la pantalla "quick setup", copiá el bloque "push an existing repository":

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra
git remote add origin https://github.com/TU_USUARIO/multicompra.git
git branch -M main
git push -u origin main
```

Reemplazá `TU_USUARIO` por tu usuario de GitHub.

---

## 2. Conectar el repo a Cloudflare Pages

1. Entrá a <https://dash.cloudflare.com/> → panel izquierdo → **Workers & Pages** → pestaña **Pages**.
2. Click en **Create application** → pestaña **Pages** → **Connect to Git**.
3. Autorizá GitHub la primera vez (pedirá permisos sobre el repo).
4. Seleccioná el repo `multicompra` y click **Begin setup**.

### Build configuration

| Campo | Valor |
|---|---|
| Project name | `multicompra` (o el que quieras para el subdominio) |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **(dejar vacío)** |
| Build output directory | `mockups` |
| Root directory | (dejar vacío — default es la raíz del repo) |

5. Click **Save and Deploy**.
6. Cloudflare clona, publica el contenido de `mockups/` y te muestra una URL tipo:

```
https://multicompra.pages.dev
```

El primer deploy tarda ~1-2 minutos. Cuando esté verde, abrís la URL y tenés el catálogo funcionando.

---

## 3. URL de producción y custom domain

Cloudflare te da por default un subdominio `*.pages.dev`. Para usar un dominio propio:

1. Dentro del proyecto en Cloudflare Pages → pestaña **Custom domains** → **Set up a custom domain**.
2. Ingresá el dominio o subdominio (ej: `multicompra.midominio.com`).
3. Si el dominio está en Cloudflare, se agrega el CNAME automático. Si está en otro DNS, te da un CNAME para que lo cargues manualmente.
4. Esperá la propagación (5-30 min) y ya queda servido por HTTPS automáticamente.

---

## 4. Preview deployments

Cualquier commit que pushees a una rama distinta de `main` genera una **URL de preview** independiente.

Ejemplo:

```bash
git checkout -b feature/dashboard-v2
# ... cambios ...
git add .
git commit -m "dashboard: nueva sección de reportes"
git push -u origin feature/dashboard-v2
```

Cloudflare Pages detecta el push y crea una URL tipo:

```
https://feature-dashboard-v2.multicompra.pages.dev
```

Útil para revisar cambios antes de mergear a `main`. Si abrís un Pull Request, la URL de preview aparece automáticamente como comentario del bot.

---

## 5. Actualizaciones (flujo diario)

Cada push a `main` dispara un redeploy automático. No hay que tocar Cloudflare después del setup inicial.

```bash
# Editás lo que tengas que editar en mockups/...
git add mockups/
git commit -m "login: ajuste de copy"
git push
```

En ~1 minuto ya está publicado. El historial de deploys queda en **Deployments** dentro del proyecto de Cloudflare, con opción de rollback a cualquier versión anterior con un click.

---

## 6. Probar localmente antes de subir

Los mockups usan módulos ES6 (`<script type="module">`) y `import` desde `shared/mock-data.js`, así que **no funcionan con doble click** (CORS bloquea `file://`). Hace falta un servidor HTTP:

### Opción A — Python

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra\mockups
python -m http.server 8000
```

Abrí <http://localhost:8000> en el navegador.

### Opción B — Node

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra\mockups
npx serve -p 8000
```

Abrí <http://localhost:8000>.

### Opción C — Wrangler (simula Cloudflare Pages local, incluye `_headers` y `_redirects`)

```bash
cd C:\Users\Administrador\Documents\GitHub\multicompra
npx wrangler pages dev mockups
```

La opción C es la más fiel a lo que va a pasar en producción, porque respeta los archivos `_headers` y `_redirects`.

---

## 7. Archivos especiales del deploy

Dentro de `mockups/` hay dos archivos que Cloudflare Pages lee automáticamente:

| Archivo | Para qué |
|---|---|
| `_headers` | Setea headers HTTP por path. Forzamos `Content-Type: application/javascript` en `/shared/*.js` para que los módulos ES6 carguen correctamente, y agregamos headers de seguridad (X-Frame-Options, nosniff, Referrer-Policy). |
| `_redirects` | Redirige `/` a `/index.html`. Redundante con el default de Cloudflare pero explícito. |

Si agregás rutas nuevas o necesitás headers distintos, editá estos archivos y push.

---

## 8. Checklist antes de compartir la URL

- [ ] `https://multicompra.pages.dev` abre el catálogo (`index.html`).
- [ ] El botón "Entrar al sistema" lleva al login.
- [ ] Los 3 usuarios demo (Carolina, Shirley, Diego) redirigen a cada pantalla sin error.
- [ ] Toggle sol/luna funciona en todas las páginas.
- [ ] En mobile (DevTools 375×667) el dashboard de admin se ve bien.
- [ ] En desktop (1366×768) la planilla de OC se ve bien.

---

## Problemas comunes

**"404 al entrar a `/login`"**
Cloudflare Pages sirve archivos estáticos. Usá siempre las URLs con `.html` al final cuando enlaces desde fuera (ej. `login.html`, no `/login`). Los links internos de los mockups ya están así.

**"Los imports ES6 fallan con MIME type"**
El archivo `_headers` fuerza el Content-Type correcto. Si seguís viendo el error, verificá que `_headers` esté dentro de `mockups/` y que en el build config esté puesto `mockups` como output directory.

**"Quiero ver los logs del deploy"**
En Cloudflare Pages → proyecto → pestaña **Deployments** → click en un deploy → **View build log**.
