-- Travel Updates page blocks (Figma 40105:21075). Hero uses the existing page-media-hero.
INSERT INTO public.component_types (id, label) VALUES
  ('travel-updates-advisory', 'Travel Updates Advisory'),
  ('travel-updates-list', 'Travel Updates List')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('travel-updates', 'Travel Updates', 'Latest travel advisories and updates', 'published')
ON CONFLICT (slug) DO NOTHING;
