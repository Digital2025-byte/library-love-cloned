-- Offers & Deals booking box (Figma 40951:24421 / 40954:91233): the new
-- "booking-search" block, rendered by new_fly_cham on the live booking engine.
INSERT INTO public.component_types (id, label)
VALUES ('booking-search', 'Booking Search')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
