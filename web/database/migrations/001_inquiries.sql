BEGIN;
CREATE SCHEMA IF NOT EXISTS crunchify_private;
REVOKE ALL ON SCHEMA crunchify_private FROM PUBLIC;
CREATE TABLE IF NOT EXISTS crunchify_private.products (
  slug text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Fruit', 'Vegetable'))
);
CREATE TABLE IF NOT EXISTS crunchify_private.inquiries (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL CHECK (kind IN ('wholesale', 'partner')),
  details jsonb NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  internal_note text NOT NULL DEFAULT '',
  sender_email_status text NOT NULL DEFAULT 'pending',
  company_email_status text NOT NULL DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS crunchify_private.rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL,
  window_start timestamptz NOT NULL
);
REVOKE ALL ON ALL TABLES IN SCHEMA crunchify_private FROM PUBLIC;
COMMIT;
