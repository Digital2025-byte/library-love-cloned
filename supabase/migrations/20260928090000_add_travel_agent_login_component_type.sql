-- Travel Agent (B2B) login page: one full-screen block.
INSERT INTO public.component_types (id, label) VALUES
  ('travel-agent-login', 'Travel Agent Login')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('login-travel-agent', 'Travel Agent Login', 'B2B travel agent login page', 'published')
ON CONFLICT (slug) DO NOTHING;
