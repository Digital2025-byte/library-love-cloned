-- Seven offer banner blocks (cms2 OfferBanner — one renderer, seven types).
INSERT INTO public.component_types (id, label)
VALUES
  ('offer-destination', 'Destination Offer'),
  ('offer-one-way', 'One-way Offer'),
  ('offer-round-trip', 'Round-trip Offer'),
  ('offer-multi-city', 'Multi-city Offer'),
  ('offer-baggage', 'Baggage Offer'),
  ('offer-seat', 'Seat Offer'),
  ('offer-payment-option', 'Payment Option Offer')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
