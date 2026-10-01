-- Service Benefits: photo banner with a title and icon-circle benefit columns.
INSERT INTO public.component_types (id, label)
VALUES ('service-benefits', 'Service Benefits')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
