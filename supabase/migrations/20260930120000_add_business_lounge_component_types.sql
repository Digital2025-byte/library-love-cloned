-- Feature Highlight: title, description, and icon features beside a photo.
INSERT INTO public.component_types (id, label)
VALUES ('feature-highlight', 'Feature Highlight')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;

-- Lounge Cards: scrolling overlay photo cards with a title, description, and icon link.
INSERT INTO public.component_types (id, label)
VALUES ('lounge-cards', 'Lounge Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
