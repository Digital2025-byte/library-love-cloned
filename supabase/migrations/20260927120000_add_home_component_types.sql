-- Home page CMS blocks (ported from new_fly_cham pages/home).
-- The hero uses the existing `page-media-hero`, the booking box the existing
-- `booking-widget` marker and the newsletter the existing `newsletter-signup`.
INSERT INTO public.component_types (id, label) VALUES
  ('home-plan-trip', 'Home Plan Trip'),
  ('home-extra-services', 'Home Extra Services'),
  ('home-travel-experience', 'Home Travel Experience'),
  ('home-cham-miles-banner', 'Home Cham Miles Banner'),
  ('home-about', 'Home About')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

-- The dynamic home page (public URL `/`, flat slug `home`).
INSERT INTO public.pages (slug, label, description, status)
VALUES ('home', 'Home', 'Fly Cham home page', 'published')
ON CONFLICT (slug) DO NOTHING;
