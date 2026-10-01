-- Support Steps: title, description, and horizontal icon steps beside a photo.
INSERT INTO public.component_types (id, label)
VALUES ('support-steps', 'Support Steps')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
