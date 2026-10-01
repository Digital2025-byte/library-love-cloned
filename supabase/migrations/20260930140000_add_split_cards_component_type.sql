-- Split Cards: a featured image-left card plus a grid, or a cream image pair.
INSERT INTO public.component_types (id, label)
VALUES ('split-cards', 'Split Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
