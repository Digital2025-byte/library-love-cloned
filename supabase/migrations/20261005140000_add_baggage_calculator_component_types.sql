-- Baggage Calculator page (Figma 40814:21591): new "baggage-calculator" form
-- card and "title-with-list" (Important Information) blocks.
INSERT INTO public.component_types (id, label)
VALUES
  ('baggage-calculator', 'Baggage Calculator'),
  ('title-with-list', 'Title With List')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
