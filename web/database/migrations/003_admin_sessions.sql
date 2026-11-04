BEGIN;
CREATE TABLE IF NOT EXISTS crunchify_private.admin_sessions (
  token_hash text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON crunchify_private.admin_sessions (expires_at);
REVOKE ALL ON crunchify_private.admin_sessions FROM PUBLIC;
COMMIT;
