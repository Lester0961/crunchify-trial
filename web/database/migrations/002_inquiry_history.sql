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
COMMIT;
