-- Route map page (/our-destinations/route-map): one full-screen interactive
-- map block whose plane marker + destination photos are CMS images.
INSERT INTO public.component_types (id, label) VALUES
  ('route-map-explorer', 'Route Map Explorer')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('route-map', 'Route Map', 'Interactive flight route map', 'published')
ON CONFLICT (slug) DO NOTHING;
