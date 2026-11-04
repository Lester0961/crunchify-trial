BEGIN;
CREATE ROLE crunchify_backup_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
GRANT CONNECT ON DATABASE postgres TO crunchify_backup_app;
GRANT USAGE ON SCHEMA crunchify_private TO crunchify_backup_app;
GRANT SELECT ON ALL TABLES IN SCHEMA crunchify_private TO crunchify_backup_app;

-- Owner-only, temporary bootstrap; the generated credential is protected locally.
CREATE FUNCTION crunchify_private.bootstrap_backup_password() RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, extensions AS $$
DECLARE password_value text := encode(extensions.gen_random_bytes(32), 'hex');
BEGIN
  EXECUTE format('ALTER ROLE crunchify_backup_app LOGIN PASSWORD %L', password_value);
  RETURN password_value;
END;
$$;
REVOKE ALL ON FUNCTION crunchify_private.bootstrap_backup_password() FROM PUBLIC;
COMMIT;
