INSERT INTO public.component_types (id, label)
VALUES ('about-values', 'About Values')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
