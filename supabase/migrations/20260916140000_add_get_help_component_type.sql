-- Register the "get-help" component type so create-component's FK
-- (components.type → component_types.id) is satisfied.
-- Apply on the CMS Supabase project (ref: xbqrfakpcisqunyugrqt).
INSERT INTO public.component_types (id, label)
VALUES ('get-help', 'Get Help')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
