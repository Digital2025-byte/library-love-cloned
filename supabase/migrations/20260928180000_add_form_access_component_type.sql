-- "Find your booking" form block of the request-a-form page
-- (/help/contact-us/forms/<formId>/request).
INSERT INTO public.component_types (id, label)
VALUES ('form-access', 'Form Access')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
