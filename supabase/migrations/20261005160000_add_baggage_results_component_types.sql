-- Baggage Calculator results (Figma 40814:22701): route summary, allowance
-- breakdown panels and additional-baggage cards.
INSERT INTO public.component_types (id, label)
VALUES
  ('baggage-route-summary', 'Baggage Route Summary'),
  ('baggage-allowance-breakdown', 'Baggage Allowance Breakdown'),
  ('baggage-addons', 'Baggage Add-ons')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
