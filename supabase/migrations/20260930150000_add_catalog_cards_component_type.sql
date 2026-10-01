-- Catalog Cards: centered header, rounded photos, and captions underneath.
INSERT INTO public.component_types (id, label)
VALUES ('catalog-cards', 'Catalog Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
