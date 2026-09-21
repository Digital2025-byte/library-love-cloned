-- Register the "travel-experience-cards" component type so components of this
-- type satisfy the components.type foreign key (components_type_fkey).
--
-- NOTE: a migration file here is NOT auto-applied to the hosted CMS DB. Apply it
-- to project xbqrfakpcisqunyugrqt (SQL editor, the auth+REST recipe in the cms2
-- docs, or `node cms/scripts/apply-travel-experience-cards-page.mjs`).
INSERT INTO public.component_types (id, label)
VALUES ('travel-experience-cards', 'Travel Experience Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
