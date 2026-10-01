-- Offer Cards: square photo cards with title, description, optional icon and link.
INSERT INTO public.component_types (id, label)
VALUES ('offer-cards', 'Offer Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
