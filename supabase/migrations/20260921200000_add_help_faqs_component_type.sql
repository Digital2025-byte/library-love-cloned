-- Register the Help FAQs nested explorer so components of this type
-- satisfy the components.type foreign key (components_type_fkey).
-- page-hero, search-console, get-help, and live-chat-banner are already registered.
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-faqs-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES
  ('help-faqs', 'Help FAQs')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
