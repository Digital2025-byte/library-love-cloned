-- Cham Miles registration page (/cham-miles): one full-screen block.
INSERT INTO public.component_types (id, label) VALUES
  ('cham-miles-register', 'Cham Miles Register')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('cham-miles', 'Cham Miles', 'Cham Miles loyalty sign-up page', 'published')
ON CONFLICT (slug) DO NOTHING;
