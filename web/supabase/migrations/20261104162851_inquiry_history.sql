BEGIN;
CREATE TABLE IF NOT EXISTS crunchify_private.inquiry_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inquiry_id uuid NOT NULL REFERENCES crunchify_private.inquiries(id) ON DELETE CASCADE,
  changed_at timestamptz NOT NULL DEFAULT now(),
  actor text NOT NULL DEFAULT 'Shared admin account',
  old_status text NOT NULL,
  new_status text NOT NULL,
  old_note text NOT NULL,
  new_note text NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiry_history_inquiry_id_idx ON crunchify_private.inquiry_history (inquiry_id, changed_at DESC, id DESC);
REVOKE ALL ON crunchify_private.inquiry_history FROM PUBLIC;
CREATE OR REPLACE FUNCTION crunchify_private.record_inquiry_change() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.internal_note IS DISTINCT FROM NEW.internal_note THEN
    INSERT INTO crunchify_private.inquiry_history (inquiry_id, old_status, new_status, old_note, new_note)
    VALUES (NEW.id, OLD.status, NEW.status, OLD.internal_note, NEW.internal_note);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS inquiry_change_history ON crunchify_private.inquiries;
CREATE TRIGGER inquiry_change_history AFTER UPDATE OF status, internal_note ON crunchify_private.inquiries
FOR EACH ROW EXECUTE FUNCTION crunchify_private.record_inquiry_change();

CREATE TABLE IF NOT EXISTS crunchify_preview.inquiry_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inquiry_id uuid NOT NULL REFERENCES crunchify_preview.inquiries(id) ON DELETE CASCADE,
  changed_at timestamptz NOT NULL DEFAULT now(),
  actor text NOT NULL DEFAULT 'Shared admin account',
  old_status text NOT NULL,
  new_status text NOT NULL,
  old_note text NOT NULL,
  new_note text NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiry_history_inquiry_id_idx ON crunchify_preview.inquiry_history (inquiry_id, changed_at DESC, id DESC);
REVOKE ALL ON crunchify_preview.inquiry_history FROM PUBLIC;
CREATE OR REPLACE FUNCTION crunchify_preview.record_inquiry_change() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.internal_note IS DISTINCT FROM NEW.internal_note THEN
    INSERT INTO crunchify_preview.inquiry_history (inquiry_id, old_status, new_status, old_note, new_note)
    VALUES (NEW.id, OLD.status, NEW.status, OLD.internal_note, NEW.internal_note);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS inquiry_change_history ON crunchify_preview.inquiries;
CREATE TRIGGER inquiry_change_history AFTER UPDATE OF status, internal_note ON crunchify_preview.inquiries
FOR EACH ROW EXECUTE FUNCTION crunchify_preview.record_inquiry_change();

REVOKE ALL ON FUNCTION crunchify_private.record_inquiry_change() FROM PUBLIC;
REVOKE ALL ON FUNCTION crunchify_preview.record_inquiry_change() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION crunchify_private.record_inquiry_change() TO crunchify_production_app;
GRANT EXECUTE ON FUNCTION crunchify_preview.record_inquiry_change() TO crunchify_preview_app;
GRANT SELECT, INSERT ON crunchify_private.inquiry_history TO crunchify_production_app;
GRANT USAGE, SELECT ON SEQUENCE crunchify_private.inquiry_history_id_seq TO crunchify_production_app;
GRANT SELECT ON crunchify_private.inquiry_history TO crunchify_backup_app;
GRANT SELECT, INSERT ON crunchify_preview.inquiry_history TO crunchify_preview_app;
GRANT USAGE, SELECT ON SEQUENCE crunchify_preview.inquiry_history_id_seq TO crunchify_preview_app;
ALTER TABLE crunchify_preview.inquiry_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY preview_history_read ON crunchify_preview.inquiry_history FOR SELECT TO crunchify_preview_app USING (true);
CREATE POLICY preview_history_insert ON crunchify_preview.inquiry_history FOR INSERT TO crunchify_preview_app WITH CHECK (true);
COMMIT;
