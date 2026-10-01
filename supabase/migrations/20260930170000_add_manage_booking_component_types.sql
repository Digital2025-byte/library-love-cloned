-- Booking Lookup and Overlay Cards for manage-booking.
INSERT INTO public.component_types (id, label)
VALUES
  ('booking-lookup', 'Booking Lookup'),
  ('overlay-cards', 'Overlay Cards')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
