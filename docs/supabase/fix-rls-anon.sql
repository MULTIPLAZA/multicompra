-- =============================================================================
-- Fix: permitir que el rol `anon` (la PWA sin Supabase Auth) pueda leer/escribir
-- mientras no integremos auth real con el ERP. La seguridad real vendrá cuando
-- migremos a Supabase Auth (probablemente con un Edge Function que valide
-- contra MULTICOMPRA_AUTH y emita un JWT).
--
-- Ejecutar en SQL Editor de Supabase. Reemplaza las políticas iniciales del
-- schema.sql que estaban limitadas a `authenticated`.
-- =============================================================================

do $$
declare
  t text;
  pol_old text;
  pol_new text;
begin
  for t in
    select unnest(array['usuarios_app','op','op_lineas','op_resoluciones',
                        'oc','oc_lineas','oc_ops','compras','compras_lineas',
                        'solicitudes_alta','borradores_op'])
  loop
    pol_old := t || '_auth_all';
    pol_new := t || '_anon_auth_all';
    -- Borrar política vieja si existe
    execute format('drop policy if exists %I on %I', pol_old, t);
    execute format('drop policy if exists %I on %I', pol_new, t);
    -- Crear nueva permisiva para anon + authenticated
    execute format(
      'create policy %I on %I for all to anon, authenticated using (true) with check (true)',
      pol_new, t
    );
  end loop;
end $$;

-- Verificación rápida (debería listar las 11 políticas nuevas):
select tablename, policyname, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('usuarios_app','op','op_lineas','op_resoluciones',
                    'oc','oc_lineas','oc_ops','compras','compras_lineas',
                    'solicitudes_alta','borradores_op')
order by tablename;
