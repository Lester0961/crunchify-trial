BEGIN;
CREATE ROLE crunchify_production_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
GRANT CONNECT ON DATABASE postgres TO crunchify_production_app;
GRANT USAGE ON SCHEMA crunchify_private TO crunchify_production_app;
GRANT SELECT ON crunchify_private.products TO crunchify_production_app;
GRANT SELECT, INSERT, UPDATE ON crunchify_private.inquiries, crunchify_private.rate_limits TO crunchify_production_app;

-- Temporary bootstrap function: only its owner can call it. Its random return
-- value is transferred directly into Vercel's sensitive environment storage.
CREATE FUNCTION crunchify_private.bootstrap_app_password() RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, extensions AS $$
DECLARE password_value text := encode(extensions.gen_random_bytes(32), 'hex');
BEGIN
  EXECUTE format('ALTER ROLE crunchify_production_app LOGIN PASSWORD %L', password_value);
  RETURN password_value;
END;
$$;
REVOKE ALL ON FUNCTION crunchify_private.bootstrap_app_password() FROM PUBLIC;
COMMIT;
