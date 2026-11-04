BEGIN;
CREATE SCHEMA IF NOT EXISTS crunchify_preview;
REVOKE ALL ON SCHEMA crunchify_preview FROM PUBLIC;
CREATE TABLE IF NOT EXISTS crunchify_preview.products (
  slug text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Fruit', 'Vegetable'))
);
CREATE TABLE IF NOT EXISTS crunchify_preview.inquiries (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL CHECK (kind IN ('wholesale', 'partner')),
  details jsonb NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  internal_note text NOT NULL DEFAULT '',
  sender_email_status text NOT NULL DEFAULT 'pending',
  company_email_status text NOT NULL DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS crunchify_preview.rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL,
  window_start timestamptz NOT NULL
);
REVOKE ALL ON ALL TABLES IN SCHEMA crunchify_preview FROM PUBLIC;
ALTER TABLE crunchify_preview.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE crunchify_preview.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crunchify_preview.rate_limits ENABLE ROW LEVEL SECURITY;
INSERT INTO crunchify_preview.products (slug, name, category) VALUES
  ('banana-crunch', 'Banana Crunch', 'Fruit'),
  ('jackfruit-crunch', 'Jackfruit Crunch', 'Fruit'),
  ('apple-crunch', 'Apple Crunch', 'Fruit'),
  ('broccoli-crunch', 'Broccoli Crunch', 'Vegetable')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;

COMMIT;
