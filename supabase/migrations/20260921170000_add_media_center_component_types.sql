-- Register remaining Media Center component types so components of these types
-- satisfy the components.type foreign key (components_type_fkey).
-- page-media-hero and magazine-banner are already registered.
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-media-center-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES
  ('page-intro', 'Page Intro'),
  ('latest-news', 'Latest News'),
  ('news-grid', 'News Grid'),
  ('media-contact-cards', 'Media Contact Cards'),
  ('media-newsletter-signup', 'Media Newsletter Signup')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
