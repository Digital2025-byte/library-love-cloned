-- Register the "responsibility-sections" component type so components of this
-- type satisfy the components.type foreign key (components_type_fkey).
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor or the auth+REST recipe in the cms2
-- docs).
INSERT INTO public.component_types (id, label)
VALUES ('responsibility-sections', 'Responsibility Sections')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
