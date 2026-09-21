-- Register Legal Document and Legal More Info so components of these types
-- satisfy the components.type foreign key (components_type_fkey).
-- page-media-hero is already registered.
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- via `node cms/scripts/apply-legal-documents-page.mjs`.
INSERT INTO public.component_types (id, label)
VALUES
  ('legal-document', 'Legal Document'),
  ('legal-more-info', 'Legal More Info')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
