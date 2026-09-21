-- Register the "seat-choose" and "seat-plan" component types so components of
-- these types satisfy the components.type foreign key (components_type_fkey).
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor or the auth+REST recipe in the cms2
-- docs).
INSERT INTO public.component_types (id, label)
VALUES
  ('seat-choose', 'Seat Choose'),
  ('seat-plan', 'Seat Plan')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
