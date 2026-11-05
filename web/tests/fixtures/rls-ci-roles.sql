-- Disposable CI database only. The password is a public synthetic test value.
CREATE ROLE crunchify_production_app LOGIN PASSWORD 'local-test-only' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
CREATE ROLE crunchify_backup_app LOGIN PASSWORD 'local-test-only' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
CREATE ROLE crunchify_rls_guest NOLOGIN NOSUPERUSER NOBYPASSRLS;
GRANT USAGE ON SCHEMA crunchify_private TO crunchify_production_app, crunchify_backup_app, crunchify_rls_guest;
GRANT SELECT ON crunchify_private.products TO crunchify_production_app;
GRANT SELECT, INSERT, UPDATE ON crunchify_private.inquiries, crunchify_private.rate_limits TO crunchify_production_app;
GRANT SELECT, INSERT ON crunchify_private.inquiry_history TO crunchify_production_app;
GRANT USAGE, SELECT ON SEQUENCE crunchify_private.inquiry_history_id_seq TO crunchify_production_app;
GRANT SELECT, INSERT, DELETE ON crunchify_private.admin_sessions TO crunchify_production_app;
GRANT SELECT ON ALL TABLES IN SCHEMA crunchify_private TO crunchify_backup_app, crunchify_rls_guest;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA crunchify_private TO crunchify_backup_app;
REVOKE ALL ON FUNCTION crunchify_private.record_inquiry_change() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION crunchify_private.record_inquiry_change() TO crunchify_production_app;
