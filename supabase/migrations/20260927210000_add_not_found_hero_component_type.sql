-- The 404 page becomes a dynamic CMS page: one "not-found-hero" block on the
-- "not-found" page. new_fly_cham renders it for every missing URL (and falls
-- back to the same hero's built-in text if this page can't load).
INSERT INTO public.component_types (id, label) VALUES
  ('not-found-hero', 'Not Found Hero')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('not-found', 'Not Found (404)', 'Shown for every page that does not exist', 'published')
ON CONFLICT (slug) DO NOTHING;
