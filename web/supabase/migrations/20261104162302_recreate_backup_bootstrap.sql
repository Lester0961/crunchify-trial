CREATE FUNCTION crunchify_private.bootstrap_backup_password() RETURNS text
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, extensions AS $$
DECLARE password_value text := encode(extensions.gen_random_bytes(32), 'hex');
BEGIN
  EXECUTE format('ALTER ROLE crunchify_backup_app LOGIN PASSWORD %L', password_value);
  RETURN password_value;
END;
$$;
REVOKE ALL ON FUNCTION crunchify_private.bootstrap_backup_password() FROM PUBLIC;
