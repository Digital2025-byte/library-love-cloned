-- At the Airport page (Figma 39457:12163): image-top service cards.
-- Applied to the hosted CMS DB by cms/scripts/apply-at-the-airport-page.mjs.
INSERT INTO public.component_types (id, label)
VALUES ('airport-service-cards', 'Airport Service Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
