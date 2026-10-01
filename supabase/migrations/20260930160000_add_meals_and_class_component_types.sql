-- Icon Tiles, Split Band, and Class Panel for meals-onboard and travel-classes.
INSERT INTO public.component_types (id, label)
VALUES
  ('icon-tiles', 'Icon Tiles'),
  ('split-band', 'Split Band'),
  ('class-panel', 'Class Panel')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
