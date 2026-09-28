-- Cargo Service page blocks (Figma 39751:18126). Other blocks reuse page-media-hero,
-- cta-banner, faqs and info-accordion.
INSERT INTO public.component_types (id, label) VALUES
  ('cargo-shipment-types', 'Cargo Shipment Types'),
  ('cargo-info-cards', 'Cargo Info Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

INSERT INTO public.pages (slug, label, description, status)
VALUES ('cargo-service', 'Cargo Service', 'Fly Cham air cargo services', 'published')
ON CONFLICT (slug) DO NOTHING;
