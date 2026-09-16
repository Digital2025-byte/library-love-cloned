-- Register the "contact-channels" component type so components of this type can
-- be created. `components.type` has a FK to `component_types(id)`; without this
-- row, create-component fails the foreign-key constraint (HTTP 500).
INSERT INTO public.component_types (id, label) VALUES
  ('contact-channels', 'Contact Channels')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
