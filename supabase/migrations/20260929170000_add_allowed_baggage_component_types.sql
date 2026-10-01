-- Allowed Baggage page (Figma 40239:32515): the two new cms2 blocks.
-- Applied to the hosted CMS DB by cms/scripts/apply-allowed-baggage-page.mjs.
INSERT INTO public.component_types (id, label)
VALUES
  ('baggage-allowance', 'Baggage Allowance'),
  ('baggage-resource-cards', 'Baggage Resource Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
