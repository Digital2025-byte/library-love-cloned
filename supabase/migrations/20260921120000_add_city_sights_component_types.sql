-- Register the city-sights component types so components of these types can be
-- created. `components.type` has a FK to `component_types(id)`; without these
-- rows, create-component fails the foreign-key constraint (HTTP 500).
INSERT INTO public.component_types (id, label) VALUES
  ('sights-grid', 'Sights Grid'),
  ('magazine-banner', 'Magazine Banner'),
  ('newsletter-signup', 'Newsletter Signup')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
