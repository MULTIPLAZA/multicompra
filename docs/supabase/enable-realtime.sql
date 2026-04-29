-- =============================================================================
-- Habilitar Realtime en las tablas que la PWA va a escuchar.
-- Esto permite que la supervisora vea OPs nuevas sin recargar la página.
--
-- Correr en SQL Editor de Supabase. Una sola vez.
-- =============================================================================

-- Asegurar que la publicación supabase_realtime existe
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Agregar las tablas a la publicación
alter publication supabase_realtime add table op;
alter publication supabase_realtime add table op_resoluciones;
alter publication supabase_realtime add table oc;
alter publication supabase_realtime add table solicitudes_alta;

-- Verificación: deberían aparecer las 4 tablas
select tablename from pg_publication_tables where pubname = 'supabase_realtime' order by tablename;
