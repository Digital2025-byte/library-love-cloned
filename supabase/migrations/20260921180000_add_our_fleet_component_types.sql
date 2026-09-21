-- Register Our Fleet component types so components of these types
-- satisfy the components.type foreign key (components_type_fkey).
-- page-media-hero and seat-journey are already registered.
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-our-fleet-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES
  ('fleet-explore', 'Fleet Explore'),
  ('media-cards', 'Media Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
