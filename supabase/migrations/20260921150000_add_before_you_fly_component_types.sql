-- Register the "before-you-fly-services" and "journey-stage-next-steps"
-- component types so components of these types satisfy the components.type
-- foreign key (components_type_fkey).
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-before-you-fly-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES
  ('before-you-fly-services', 'Before You Fly Services'),
  ('journey-stage-next-steps', 'Journey Stage Next Steps')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
