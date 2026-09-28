INSERT INTO public.component_types (id, label)
VALUES ('booking-widget', 'Booking Widget')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
