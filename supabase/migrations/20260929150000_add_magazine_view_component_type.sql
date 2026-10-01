-- Register the Magazine View component type so components of this type
-- satisfy the components.type foreign key (components_type_fkey).
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB.
-- Apply it with `node cms/scripts/apply-magazine-view-page.mjs`.
INSERT INTO public.component_types (id, label)
VALUES
  ('magazine-view', 'Magazine View')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
