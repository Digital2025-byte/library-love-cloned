-- Business Center page (Figma 39658:121). Reuses breadcrumbs, page-media-hero,
-- home-travel-experience (services cards) and promo-banner (enquiry banner);
-- only the Quick Access row is a new block type.
INSERT INTO public.component_types (id, label) VALUES
  ('business-quick-access', 'Business Quick Access')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

-- Short-lived types replaced by home-travel-experience / promo-banner.
DELETE FROM public.component_types WHERE id IN ('business-services', 'business-enquiry');

INSERT INTO public.pages (slug, label, description, status)
VALUES ('business-center', 'Business Center', 'Business resources, partnership opportunities and integration support', 'published')
ON CONFLICT (slug) DO NOTHING;
