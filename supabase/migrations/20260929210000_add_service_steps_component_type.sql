-- Oxygen Service page (Figma 40347:13592): new "service-steps" block
-- (image + text row with a numbered steps list and a CTA).
INSERT INTO public.component_types (id, label)
VALUES ('service-steps', 'Service Steps')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
