BEGIN;
CREATE TABLE IF NOT EXISTS crunchify_private.admin_sessions (
  token_hash text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON crunchify_private.admin_sessions (expires_at);
REVOKE ALL ON crunchify_private.admin_sessions FROM PUBLIC;

CREATE TABLE IF NOT EXISTS crunchify_preview.admin_sessions (
  token_hash text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON crunchify_preview.admin_sessions (expires_at);
REVOKE ALL ON crunchify_preview.admin_sessions FROM PUBLIC;

GRANT SELECT, INSERT, DELETE ON crunchify_private.admin_sessions TO crunchify_production_app;
GRANT SELECT ON crunchify_private.admin_sessions TO crunchify_backup_app;
GRANT SELECT, INSERT, DELETE ON crunchify_preview.admin_sessions TO crunchify_preview_app;
ALTER TABLE crunchify_preview.admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY preview_session_read ON crunchify_preview.admin_sessions FOR SELECT TO crunchify_preview_app USING (true);
CREATE POLICY preview_session_insert ON crunchify_preview.admin_sessions FOR INSERT TO crunchify_preview_app WITH CHECK (true);
CREATE POLICY preview_session_delete ON crunchify_preview.admin_sessions FOR DELETE TO crunchify_preview_app USING (true);
COMMIT;
