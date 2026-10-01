-- Travel update detail page blocks (/travel-updates/<id>, Figma 40139:21964).
INSERT INTO public.component_types (id, label)
VALUES
  ('travel-update-hero', 'Travel Update Hero'),
  ('travel-update-detail', 'Travel Update Detail')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
