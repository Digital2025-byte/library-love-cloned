-- Baggage price per flight segment, set in the admin's "Offers & Baggage
-- Calculator" module (/offers-and-baggage/baggage-calculator). One row is one
-- directed segment (origin → destination airport, IATA codes) with its price
-- for 1 kg of baggage in USD; DAM → DXB and DXB → DAM are priced separately.
-- Public read (the site's baggage calculator can read it with the publishable
-- key), writes limited to CMS admins (public.is_admin()).

CREATE TABLE IF NOT EXISTS public.baggage_segment_prices (
  origin text NOT NULL CHECK (origin ~ '^[A-Z]{3}$'),
  destination text NOT NULL CHECK (destination ~ '^[A-Z]{3}$'),
  price_per_kg_usd numeric(10, 2) NOT NULL CHECK (price_per_kg_usd >= 0 AND price_per_kg_usd <= 100000),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (origin, destination),
  CONSTRAINT baggage_segment_prices_distinct_airports CHECK (origin <> destination)
);

COMMENT ON TABLE public.baggage_segment_prices IS
  'Baggage price per 1 kg (USD) per directed flight segment, edited in the admin Baggage Calculator.';

COMMENT ON COLUMN public.baggage_segment_prices.price_per_kg_usd IS
  'Price in USD for 1 kg of baggage on this segment.';

GRANT SELECT ON public.baggage_segment_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.baggage_segment_prices TO authenticated;
GRANT ALL ON public.baggage_segment_prices TO service_role;
ALTER TABLE public.baggage_segment_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Baggage segment prices are public" ON public.baggage_segment_prices;
CREATE POLICY "Baggage segment prices are public" ON public.baggage_segment_prices
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins insert baggage segment prices" ON public.baggage_segment_prices;
CREATE POLICY "Admins insert baggage segment prices" ON public.baggage_segment_prices
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update baggage segment prices" ON public.baggage_segment_prices;
CREATE POLICY "Admins update baggage segment prices" ON public.baggage_segment_prices
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete baggage segment prices" ON public.baggage_segment_prices;
CREATE POLICY "Admins delete baggage segment prices" ON public.baggage_segment_prices
  FOR DELETE TO authenticated
  USING (public.is_admin());
