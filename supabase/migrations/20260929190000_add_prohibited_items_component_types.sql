-- Prohibited Items page (Figma 40329:11857): the two new cms2 blocks.
-- Applied to the hosted CMS DB by cms/scripts/apply-prohibited-items-page.mjs.
INSERT INTO public.component_types (id, label)
VALUES
  ('prohibited-items-grid', 'Prohibited Items Grid'),
  ('instructions-card', 'Instructions Card')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
