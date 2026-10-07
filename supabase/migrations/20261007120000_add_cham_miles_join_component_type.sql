-- Cham Miles join step (/cham-miles): one full-screen block that replaces
-- cham-miles-register (page swap: scripts/apply-cham-miles-join.mjs).
INSERT INTO public.component_types (id, label) VALUES
  ('cham-miles-join', 'Cham Miles Join')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
