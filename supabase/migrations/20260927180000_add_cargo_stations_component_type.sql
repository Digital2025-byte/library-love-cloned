-- Cargo Stations page (Figma 39813:30084): new explorer block; the request row reuses
-- seat-journey and the cargo guide reuses promo-banner.
INSERT INTO public.component_types (id, label) VALUES
  ('cargo-stations-explorer', 'Cargo Stations Explorer')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('cargo-stations', 'Cargo Stations', 'Fly Cham cargo stations and delivery points', 'published')
ON CONFLICT (slug) DO NOTHING;
