-- Register the "landmark-feature" component type so components of this type can
-- be created. `components.type` has a FK to `component_types(id)`; without this
-- row, create-component fails the foreign-key constraint (HTTP 500).
INSERT INTO public.component_types (id, label) VALUES
  ('landmark-feature', 'Landmark Feature')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
