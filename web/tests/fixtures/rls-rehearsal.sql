-- SYNTHETIC LOCAL REHEARSAL ONLY. This is not a production migration.
-- Requires the existing isolated test roles and crunchify_private test schema.
BEGIN;
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['products','inquiries','rate_limits','inquiry_history','admin_sessions'] LOOP
    EXECUTE format('ALTER TABLE crunchify_private.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('CREATE POLICY rehearsal_app_read ON crunchify_private.%I FOR SELECT TO crunchify_production_app USING (true)', table_name);
    EXECUTE format('CREATE POLICY rehearsal_backup_read ON crunchify_private.%I FOR SELECT TO crunchify_backup_app USING (true)', table_name);
  END LOOP;
  FOREACH table_name IN ARRAY ARRAY['inquiries','rate_limits','inquiry_history','admin_sessions'] LOOP
    EXECUTE format('CREATE POLICY rehearsal_app_insert ON crunchify_private.%I FOR INSERT TO crunchify_production_app WITH CHECK (true)', table_name);
  END LOOP;
  FOREACH table_name IN ARRAY ARRAY['inquiries','rate_limits'] LOOP
    EXECUTE format('CREATE POLICY rehearsal_app_update ON crunchify_private.%I FOR UPDATE TO crunchify_production_app USING (true) WITH CHECK (true)', table_name);
  END LOOP;
END;
$$;
CREATE POLICY rehearsal_session_delete ON crunchify_private.admin_sessions FOR DELETE TO crunchify_production_app USING (true);
COMMIT;
