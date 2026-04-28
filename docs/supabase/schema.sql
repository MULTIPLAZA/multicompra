-- =============================================================================
-- MultiCompra — Schema de Supabase para persistir OPs, OCs y Compras.
-- =============================================================================
-- Diseño:
--   1) MultiCompra NO duplica catálogo de productos / proveedores / locales:
--      esos datos vienen del ERP del cliente (SpAdconApp). Se guardan IDs
--      como referencia (sin foreign keys cross-database).
--   2) MultiCompra SÍ es dueño de las OPs, OCs, Compras y sus historiales.
--   3) Las descripciones de productos/proveedores se guardan inline (snapshot)
--      para que el historial sea legible aunque el catálogo del ERP cambie.
--   4) RLS habilitada en todas las tablas. Auth: user_id viene del JWT de
--      Supabase Auth (cuando migremos del login custom al de Supabase).
--      Por ahora dejamos políticas permisivas para arrancar; refinamos después.
--
-- Ejecutar en SQL Editor de Supabase, en orden.
-- =============================================================================

-- Helpers comunes
create extension if not exists "uuid-ossp";

-- =============================================================================
-- USUARIOS — espejo de los usuarios del ERP que se loguearon a la app.
-- Se popula en el primer login real. No reemplaza la tabla del ERP.
-- =============================================================================
create table if not exists usuarios_app (
  id_erp           int primary key,                 -- id en la tabla del ERP
  usuario          text not null,                   -- login del ERP
  nombre           text not null,
  rol              text not null,                   -- 'cajera' | 'supervisor' | 'admin'
  activo           boolean default true,
  ultimo_login     timestamptz,
  creado_en        timestamptz default now()
);

create index if not exists idx_usuarios_app_rol on usuarios_app (rol);

-- =============================================================================
-- OP — Orden de Pedido (la cajera arma el pedido del local)
-- =============================================================================
create table if not exists op (
  id                  uuid primary key default uuid_generate_v4(),
  numero              text unique,                  -- ej: 'OP-loc-abc123' (legible)
  cajera_id_erp       int not null,
  cajera_nombre       text not null,                -- snapshot
  local_id            int not null,                 -- IDDeposito del ERP
  local_nombre        text not null,                -- snapshot
  sucursal_nombre     text,                         -- snapshot
  fecha_creacion      timestamptz not null default now(),
  fecha_envio         timestamptz,                  -- null mientras es borrador
  estado              text not null default 'borrador',
                                  -- 'borrador'|'enviada'|'aprobada'|'devuelta'|'en_oc'|'cerrada'|'anulada'
  es_excepcion        boolean default false,
  motivo_excepcion    text,
  productos_count     int default 0,                -- denormalizado para listados rápidos
  unidades_count      int default 0
);

create index if not exists idx_op_cajera on op (cajera_id_erp, fecha_envio desc);
create index if not exists idx_op_local on op (local_id, estado);
create index if not exists idx_op_estado on op (estado, fecha_envio desc);

-- =============================================================================
-- OP_LINEAS — productos pedidos en cada OP
-- =============================================================================
create table if not exists op_lineas (
  id                uuid primary key default uuid_generate_v4(),
  op_id             uuid not null references op(id) on delete cascade,
  producto_id_erp   int not null,                   -- IDItem en el ERP
  producto_codigo   text,                           -- snapshot
  producto_nombre   text not null,                  -- snapshot
  producto_costo    numeric(14,2) default 0,        -- snapshot
  producto_precio   numeric(14,2) default 0,        -- snapshot
  proveedor_id_erp  int,                            -- snapshot del último proveedor
  cantidad          int not null check (cantidad > 0),
  orden             int default 0
);

create index if not exists idx_oplineas_op on op_lineas (op_id);
create index if not exists idx_oplineas_producto on op_lineas (producto_id_erp);

-- =============================================================================
-- OP_RESOLUCIONES — decisiones del supervisor sobre cada OP
-- =============================================================================
create table if not exists op_resoluciones (
  id                  uuid primary key default uuid_generate_v4(),
  op_id               uuid not null references op(id) on delete cascade,
  estado              text not null,                -- 'aprobada'|'devuelta'|'en_oc'|'anulada'
  supervisor_id_erp   int not null,
  supervisor_nombre   text not null,                -- snapshot
  nota                text,                         -- requerido para 'devuelta'
  oc_id               uuid,                         -- si fue incluida en una OC
  fecha_resolucion    timestamptz not null default now()
);

create unique index if not exists idx_opresol_unica on op_resoluciones (op_id);
create index if not exists idx_opresol_estado on op_resoluciones (estado);

-- =============================================================================
-- OC — Orden de Compra (consolidación de varias OPs aprobadas)
-- =============================================================================
create table if not exists oc (
  id                   uuid primary key default uuid_generate_v4(),
  numero               text unique,                 -- ej: 'OC-loc-xyz789'
  proveedor_id_erp     int not null,
  proveedor_nombre     text not null,               -- snapshot
  proveedor_ruc        text,                        -- snapshot
  fecha_creacion       timestamptz not null default now(),
  fecha_envio          timestamptz,                 -- al confirmar envío al proveedor
  estado               text not null default 'abierta',
                                  -- 'abierta'|'enviada_a_proveedor'|'parcialmente_recibida'|'recibida'|'cerrada'|'cerrada_con_faltante'|'anulada'
  total_gs             numeric(14,2) default 0,
  productos_count      int default 0,
  unidades_count       int default 0,
  creada_por_id_erp    int not null,
  creada_por_nombre    text not null                -- snapshot
);

create index if not exists idx_oc_proveedor on oc (proveedor_id_erp, fecha_creacion desc);
create index if not exists idx_oc_estado on oc (estado, fecha_creacion desc);

-- =============================================================================
-- OC_LINEAS — productos consolidados a comprar al proveedor
-- =============================================================================
create table if not exists oc_lineas (
  id                  uuid primary key default uuid_generate_v4(),
  oc_id               uuid not null references oc(id) on delete cascade,
  producto_id_erp     int not null,
  producto_codigo     text,
  producto_nombre     text not null,
  cantidad_pedida     int not null check (cantidad_pedida > 0),
  cantidad_recibida   int default 0,
  costo_unitario      numeric(14,2) default 0,
  subtotal            numeric(14,2) default 0
);

create index if not exists idx_oclineas_oc on oc_lineas (oc_id);

-- =============================================================================
-- OC_OPS — relación N:N entre OC y las OPs que la compusieron
-- =============================================================================
create table if not exists oc_ops (
  oc_id   uuid not null references oc(id) on delete cascade,
  op_id   uuid not null references op(id) on delete restrict,
  primary key (oc_id, op_id)
);

create index if not exists idx_ocops_op on oc_ops (op_id);

-- =============================================================================
-- COMPRAS — registro de mercadería que llegó (cierre del ciclo)
-- =============================================================================
create table if not exists compras (
  id                       uuid primary key default uuid_generate_v4(),
  numero                   text unique,
  oc_id                    uuid not null references oc(id) on delete restrict,
  factura_proveedor        text,                    -- número de factura del proveedor
  fecha_recepcion          timestamptz not null default now(),
  recibida_por_id_erp      int not null,
  recibida_por_nombre      text not null,
  total_gs                 numeric(14,2) default 0,
  observaciones            text,
  estado                   text default 'verificando'
                                -- 'verificando'|'cerrada'|'cerrada_con_faltante'
);

create index if not exists idx_compras_oc on compras (oc_id);

-- =============================================================================
-- COMPRAS_LINEAS — verificación línea por línea (lo que llegó vs lo pedido)
-- =============================================================================
create table if not exists compras_lineas (
  id                       uuid primary key default uuid_generate_v4(),
  compra_id                uuid not null references compras(id) on delete cascade,
  oc_linea_id              uuid not null references oc_lineas(id),
  producto_id_erp          int not null,
  producto_codigo          text,
  producto_nombre          text not null,
  cantidad_pedida          int not null,
  cantidad_recibida        int not null,
  diferencia               int generated always as (cantidad_recibida - cantidad_pedida) stored,
  costo_unitario           numeric(14,2) default 0,
  nota                     text                     -- explicación si hay diferencia
);

create index if not exists idx_clineas_compra on compras_lineas (compra_id);

-- =============================================================================
-- SOLICITUDES_ALTA — productos nuevos que pide la cajera (no existen en catálogo)
-- =============================================================================
create table if not exists solicitudes_alta (
  id                       uuid primary key default uuid_generate_v4(),
  fecha                    timestamptz default now(),
  codigo                   text,                    -- código que escaneó
  descripcion              text not null,
  motivo                   text,
  categoria                text,
  proveedor_sugerido_id    int,
  cajera_id_erp            int not null,
  cajera_nombre            text not null,
  local_id                 int,
  local_nombre             text,
  estado                   text default 'pendiente',
                                -- 'pendiente'|'aprobada'|'rechazada'
  nota_supervisor          text,
  fecha_resolucion         timestamptz,
  supervisor_id_erp        int,
  supervisor_nombre        text
);

create index if not exists idx_solalta_estado on solicitudes_alta (estado, fecha desc);

-- =============================================================================
-- BORRADORES_OP — borradores en proceso (la cajera los guarda sin enviar)
-- =============================================================================
create table if not exists borradores_op (
  id                  uuid primary key default uuid_generate_v4(),
  cajera_id_erp       int not null,
  local_id            int not null,
  ultima_modificacion timestamptz default now(),
  contenido           jsonb not null               -- el draft completo
);

create unique index if not exists idx_borr_unica on borradores_op (cajera_id_erp, local_id);

-- =============================================================================
-- TRIGGER — actualizar contadores denormalizados de OP automáticamente
-- =============================================================================
create or replace function actualizar_contadores_op()
returns trigger as $$
begin
  update op
  set productos_count = (select count(*) from op_lineas where op_id = coalesce(new.op_id, old.op_id)),
      unidades_count = (select coalesce(sum(cantidad), 0) from op_lineas where op_id = coalesce(new.op_id, old.op_id))
  where id = coalesce(new.op_id, old.op_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_oplineas_contadores on op_lineas;
create trigger trg_oplineas_contadores
after insert or update or delete on op_lineas
for each row execute function actualizar_contadores_op();

-- Mismo trigger para OC
create or replace function actualizar_contadores_oc()
returns trigger as $$
begin
  update oc
  set productos_count = (select count(*) from oc_lineas where oc_id = coalesce(new.oc_id, old.oc_id)),
      unidades_count = (select coalesce(sum(cantidad_pedida), 0) from oc_lineas where oc_id = coalesce(new.oc_id, old.oc_id)),
      total_gs = (select coalesce(sum(subtotal), 0) from oc_lineas where oc_id = coalesce(new.oc_id, old.oc_id))
  where id = coalesce(new.oc_id, old.oc_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_oclineas_contadores on oc_lineas;
create trigger trg_oclineas_contadores
after insert or update or delete on oc_lineas
for each row execute function actualizar_contadores_oc();

-- =============================================================================
-- RLS — Row Level Security
-- =============================================================================
-- Por ahora arrancamos con políticas permisivas autenticadas y refinamos
-- cuando integremos Supabase Auth con el login del ERP. La idea futura:
--   - Cajeras: ven solo sus propias OPs y los productos pueden buscar.
--   - Supervisores: ven todas las OPs y OCs.
--   - Admin: ven todo.

alter table usuarios_app      enable row level security;
alter table op                enable row level security;
alter table op_lineas         enable row level security;
alter table op_resoluciones   enable row level security;
alter table oc                enable row level security;
alter table oc_lineas         enable row level security;
alter table oc_ops            enable row level security;
alter table compras           enable row level security;
alter table compras_lineas    enable row level security;
alter table solicitudes_alta  enable row level security;
alter table borradores_op     enable row level security;

-- Políticas iniciales — permitir todo a usuarios autenticados.
-- Refinar cuando tengamos Supabase Auth integrado con el ERP.
do $$
declare
  t text;
begin
  for t in
    select unnest(array['usuarios_app','op','op_lineas','op_resoluciones',
                        'oc','oc_lineas','oc_ops','compras','compras_lineas',
                        'solicitudes_alta','borradores_op'])
  loop
    execute format(
      'create policy %I_auth_all on %I for all to authenticated using (true) with check (true)',
      t || '_auth_all', t
    );
  end loop;
end $$;

-- =============================================================================
-- VIEW — historial de cajera con resolución del supervisor unida (denormalizada
--        para evitar joins repetitivos en el frontend)
-- =============================================================================
create or replace view v_op_con_resolucion as
select
  o.*,
  r.estado            as estado_resolucion,
  r.supervisor_nombre as supervisor_nombre,
  r.nota              as nota_supervisor,
  r.oc_id             as oc_resolucion,
  r.fecha_resolucion
from op o
left join op_resoluciones r on r.op_id = o.id;

-- =============================================================================
-- LISTO. Próximo paso: integrar shared/supabase.js con la URL y key del proyecto.
-- =============================================================================
