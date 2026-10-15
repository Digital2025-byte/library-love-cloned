-- Baggage segment prices are per 1 kg. The first version of
-- 20261015160000_create_baggage_segment_prices.sql (already run on the hosted
-- CMS database) named the column `price_usd`; that file now creates
-- `price_per_kg_usd` directly. This renames the column where the old version
-- ran, and is a no-op otherwise. The CHECK constraint follows the column.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'baggage_segment_prices'
      AND column_name = 'price_usd'
  ) THEN
    ALTER TABLE public.baggage_segment_prices RENAME COLUMN price_usd TO price_per_kg_usd;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.baggage_segment_prices'::regclass
      AND conname = 'baggage_segment_prices_price_usd_check'
  ) THEN
    ALTER TABLE public.baggage_segment_prices
      RENAME CONSTRAINT baggage_segment_prices_price_usd_check TO baggage_segment_prices_price_per_kg_usd_check;
  END IF;
END $$;

COMMENT ON TABLE public.baggage_segment_prices IS
  'Baggage price per 1 kg (USD) per directed flight segment, edited in the admin Baggage Calculator.';

COMMENT ON COLUMN public.baggage_segment_prices.price_per_kg_usd IS
  'Price in USD for 1 kg of baggage on this segment.';

-- Let PostgREST pick up the renamed column right away.
NOTIFY pgrst, 'reload schema';
