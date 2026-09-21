-- Register the "destinations-explore" component type so components of this type
-- can be created. `components.type` has a FK to `component_types(id)`; without
-- this row, create-component fails the foreign-key constraint (HTTP 500).
INSERT INTO public.component_types (id, label) VALUES
  ('destinations-explore', 'Destinations Explore')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
