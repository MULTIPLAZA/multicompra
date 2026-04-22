# MultiCompra

PWA para gestionar Órdenes de Pedido (OP) y Órdenes de Compra (OC) de una cadena de 10 locales de accesorios de celulares + 1 depósito central. Satélite del sistema de gestión de stock del proveedor.

## Estado actual

**Fase: Diseño + Maquetas.** Todavía no hay código de aplicación. Estamos definiendo producto, UX y arquitectura antes de codear.

## Objetivo de negocio

Resolver el problema de que las cajeras de los 10 locales piden reposición sin criterio → stock muerto → costo innecesario. Introducir disciplina vía OP → OC → Compra, con un supervisor que decide y trazabilidad completa.

## Flujo

1. **OP (Orden de Pedido)** — cajera de un local, un día específico, con criterio externo.
2. **OC (Orden de Compra)** — supervisor agrupa OPs, edita cantidad a comprar, ve stock central vía API para decidir reponer desde central o comprar. Cierra → PDF/Excel/WhatsApp.
3. **Compra** — carga física del comprobante, precargada desde OC. Verificación de diferencias. Al confirmar, actualiza stock vía API.

## Stack

- **Frontend**: React + Vite + Supabase JS + Cloudflare Pages
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Integración externa**: API del proveedor que expone el SP `SPMultiCompra` de SQL Server
- **PWA**: instalable, offline mínimo

## 2 experiencias

- `/cajera` — solo cargar OPs, login Supabase, identificada por local
- `/supervisor` — verificar OPs, armar OCs, cargar y verificar Compras, reportes

## Estructura del repo

```
multicompra/
├── docs/
│   ├── contexto.md        (brief original del usuario)
│   └── decisiones.md      (log de decisiones de producto / UX / arquitectura)
├── mockups/               (HTML/CSS estáticos previos a codear React)
├── supabase/
│   ├── migrations/        (cuando arranquemos)
│   └── seed.sql
└── src/                   (código React — aún vacío)
```

## Sub-agentes del proyecto

- **MultiCompraProducto** — estados, reglas de negocio, roles, edge cases
- **MultiCompraUX** — estructura de app, wireframes, mockups HTML/CSS
- **MultiCompraArquitecto** — schema Supabase, integración SP, caché, auth

## Próximo paso

El agente de UX propone la estructura de la app (rutas + árbol de pantallas + layouts) para validar con el usuario, y después arranca por la pantalla más crítica: **edición de OC del supervisor**.
