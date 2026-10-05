-- Coming Soon page: one full-bleed block (photo + wash + title/description).
INSERT INTO public.component_types (id, label) VALUES
  ('coming-soon-hero', 'Coming Soon Hero')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('coming-soon', 'Coming Soon', 'Coming Soon page', 'published')
ON CONFLICT (slug) DO NOTHING;
