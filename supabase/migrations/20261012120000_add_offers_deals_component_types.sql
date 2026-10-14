-- Offers & Deals page (Figma 40951:24297): flight deal cards with origin /
-- trip-type / class filters, and baggage & service deal cards with a live
-- countdown tag. Seeded by cms/scripts/apply-offers-and-deals-page.mjs.
INSERT INTO public.component_types (id, label)
VALUES
  ('flight-deals', 'Flight Deals'),
  ('service-deals', 'Service Deals')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
