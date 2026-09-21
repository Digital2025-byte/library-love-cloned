-- Register the "marhaba-intro" and "explore-marhaba" component types so
-- components of these types satisfy the components.type foreign key
-- (components_type_fkey). page-media-hero is already registered.
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-traveler-magazine-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES
  ('marhaba-intro', 'Marhaba Intro'),
  ('explore-marhaba', 'Explore Marhaba')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
