INSERT INTO crunchify_private.products (slug, name, category) VALUES
  ('banana-crunch', 'Banana Crunch', 'Fruit'),
  ('jackfruit-crunch', 'Jackfruit Crunch', 'Fruit'),
  ('apple-crunch', 'Apple Crunch', 'Fruit'),
  ('broccoli-crunch', 'Broccoli Crunch', 'Vegetable')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
