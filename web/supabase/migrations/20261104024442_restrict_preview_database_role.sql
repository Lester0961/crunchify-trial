BEGIN;
CREATE ROLE crunchify_preview_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
GRANT CONNECT ON DATABASE postgres TO crunchify_preview_app;
GRANT USAGE ON SCHEMA crunchify_preview TO crunchify_preview_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA crunchify_preview TO crunchify_preview_app;
CREATE POLICY preview_app_access ON crunchify_preview.products FOR ALL TO crunchify_preview_app USING (true) WITH CHECK (true);
CREATE POLICY preview_app_access ON crunchify_preview.inquiries FOR ALL TO crunchify_preview_app USING (true) WITH CHECK (true);
CREATE POLICY preview_app_access ON crunchify_preview.rate_limits FOR ALL TO crunchify_preview_app USING (true) WITH CHECK (true);

-- Temporary bootstrap function: only its owner can call it. Its random return
-- value is transferred directly into Vercel's sensitive environment storage.
CREATE FUNCTION crunchify_preview.bootstrap_app_password() RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, extensions AS $$
DECLARE password_value text := encode(extensions.gen_random_bytes(32), 'hex');
BEGIN
  EXECUTE format('ALTER ROLE crunchify_preview_app LOGIN PASSWORD %L', password_value);
  RETURN password_value;
END;
$$;
REVOKE ALL ON FUNCTION crunchify_preview.bootstrap_app_password() FROM PUBLIC;
COMMIT;
