-- Offers (managed from the flychamadmin "Offers" module).
--
-- One row per offer. The admin app goes through the cms backend routes
-- /api/public/offers[/:id[/status]]; shape + per-type rules are validated
-- server-side in cms/src/lib/offers.ts and mirrored by the table CHECKs below.
--
--   type          destination | trip | baggage | seat | payment
--   trip_type     one_way | round_trip | multi_city   (only when type = 'trip')
--   details       jsonb, type-specific settings (see cms/src/lib/offers.ts)
--   discount_*    percentage (<= 100) or fixed amount (+ ISO currency)
--   expiry_type   time       → the offer ends at ends_at
--                 passengers → the offer ends once used_passengers reaches max_passengers
--   status        draft | active | inactive (admin-controlled). "scheduled" and
--                 "expired" are derived at read time from the dates / usage.
--
-- RLS: anon + authenticated read ACTIVE offers; admins (public.is_admin())
-- read everything and may insert / update / delete.

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9][A-Z0-9-]{2,31}$'),
  title_en text NOT NULL CHECK (char_length(btrim(title_en)) BETWEEN 2 AND 120),
  title_ar text NOT NULL CHECK (char_length(btrim(title_ar)) BETWEEN 2 AND 120),
  description_en text NULL CHECK (description_en IS NULL OR char_length(description_en) <= 1000),
  description_ar text NULL CHECK (description_ar IS NULL OR char_length(description_ar) <= 1000),

  type text NOT NULL CHECK (type IN ('destination', 'trip', 'baggage', 'seat', 'payment')),
  trip_type text NULL CHECK (trip_type IN ('one_way', 'round_trip', 'multi_city')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object'),

  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(12, 2) NOT NULL CHECK (discount_value > 0),
  currency text NULL CHECK (currency IS NULL OR currency ~ '^[A-Z]{3}$'),

  expiry_type text NOT NULL CHECK (expiry_type IN ('time', 'passengers')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NULL,
  max_passengers integer NULL CHECK (max_passengers IS NULL OR max_passengers > 0),
  used_passengers integer NOT NULL DEFAULT 0 CHECK (used_passengers >= 0),

  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- trip_type exists exactly for trip offers
  CONSTRAINT offers_trip_type_matches CHECK ((type = 'trip') = (trip_type IS NOT NULL)),
  -- percentage ≤ 100; a fixed amount needs a currency
  CONSTRAINT offers_discount_valid CHECK (
    (discount_type = 'percentage' AND discount_value <= 100 AND currency IS NULL)
    OR (discount_type = 'fixed' AND currency IS NOT NULL)
  ),
  -- exactly one expiry rule
  CONSTRAINT offers_expiry_valid CHECK (
    (expiry_type = 'time' AND ends_at IS NOT NULL AND ends_at > starts_at AND max_passengers IS NULL)
    OR (expiry_type = 'passengers' AND max_passengers IS NOT NULL AND ends_at IS NULL)
  ),
  CONSTRAINT offers_usage_within_limit CHECK (
    max_passengers IS NULL OR used_passengers <= max_passengers
  )
);

CREATE INDEX IF NOT EXISTS offers_type_idx ON public.offers (type);
CREATE INDEX IF NOT EXISTS offers_status_idx ON public.offers (status);
CREATE INDEX IF NOT EXISTS offers_created_at_idx ON public.offers (created_at DESC);

COMMENT ON TABLE public.offers IS
  'Commercial offers (destination / trip / baggage / seat / payment), see cms/src/lib/offers.ts.';
COMMENT ON COLUMN public.offers.details IS
  'Type-specific settings, validated by cms/src/lib/offers.ts (parseOfferInput).';
COMMENT ON COLUMN public.offers.used_passengers IS
  'Passengers that already used the offer; moved only by public.consume_offer_passengers().';

GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Stamp audit columns (auth.uid() is NULL for migrations / service-role writes).
CREATE OR REPLACE FUNCTION public.offers_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at = now();
    NEW.created_by = auth.uid();
  ELSE
    NEW.created_at = OLD.created_at;
    NEW.created_by = OLD.created_by;
  END IF;
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.offers_touch() FROM PUBLIC;

DROP TRIGGER IF EXISTS offers_touch ON public.offers;
CREATE TRIGGER offers_touch
  BEFORE INSERT OR UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.offers_touch();

-- policies
DROP POLICY IF EXISTS "Active offers are public" ON public.offers;
CREATE POLICY "Active offers are public" ON public.offers
  FOR SELECT TO anon, authenticated
  USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins insert offers" ON public.offers;
CREATE POLICY "Admins insert offers" ON public.offers
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update offers" ON public.offers;
CREATE POLICY "Admins update offers" ON public.offers
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete offers" ON public.offers;
CREATE POLICY "Admins delete offers" ON public.offers
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Passenger-based expiry: the booking flow (trusted server, service role)
-- records usage atomically. Returns the passengers left (NULL = time-based
-- offer, unlimited seats); raises when the offer is not live or would overflow.
CREATE OR REPLACE FUNCTION public.consume_offer_passengers(p_offer_id uuid, p_passengers integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o public.offers%ROWTYPE;
BEGIN
  IF p_passengers IS NULL OR p_passengers < 1 THEN
    RAISE EXCEPTION 'p_passengers must be >= 1' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO o FROM public.offers WHERE id = p_offer_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer % not found', p_offer_id USING ERRCODE = 'P0002';
  END IF;
  IF o.status <> 'active' OR now() < o.starts_at
     OR (o.expiry_type = 'time' AND now() >= o.ends_at) THEN
    RAISE EXCEPTION 'Offer % is not live', o.code USING ERRCODE = 'P0001';
  END IF;

  IF o.expiry_type = 'passengers' THEN
    IF o.used_passengers + p_passengers > o.max_passengers THEN
      RAISE EXCEPTION 'Offer % has only % passenger(s) left', o.code,
        o.max_passengers - o.used_passengers USING ERRCODE = 'P0001';
    END IF;
    UPDATE public.offers SET used_passengers = used_passengers + p_passengers
      WHERE id = o.id;
    RETURN o.max_passengers - o.used_passengers - p_passengers;
  END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_offer_passengers(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_offer_passengers(uuid, integer) TO service_role;

-- seed: one example per offer type (and per trip type)
INSERT INTO public.offers (
  code, title_en, title_ar, description_en, description_ar,
  type, trip_type, details,
  discount_type, discount_value, currency,
  expiry_type, starts_at, ends_at, max_passengers, used_passengers, status
) VALUES
  ('DXB-SUMMER',
   'Summer in Dubai', 'صيف في دبي',
   'Save 20% on flights from Damascus to Dubai in Economy.',
   'وفّر 20% على الرحلات من دمشق إلى دبي على الدرجة السياحية.',
   'destination', NULL,
   '{"origin":"DAM","destination":"DXB","cabinClass":"economy"}',
   'percentage', 20, NULL,
   'time', '2026-10-01T00:00:00Z', '2026-12-31T23:59:59Z', NULL, 0, 'active'),

  ('OW-DAM-IST',
   'One-way to Istanbul', 'ذهاب فقط إلى إسطنبول',
   'USD 50 off one-way tickets Damascus → Istanbul for the first 100 passengers.',
   'خصم 50 دولاراً على تذاكر الذهاب فقط من دمشق إلى إسطنبول لأول 100 مسافر.',
   'trip', 'one_way',
   '{"cabinClass":"any","segments":[{"origin":"DAM","destination":"IST"}]}',
   'fixed', 50, 'USD',
   'passengers', '2026-10-01T00:00:00Z', NULL, 100, 12, 'active'),

  ('RT-DAM-CAI',
   'Cairo round trip', 'رحلة ذهاب وعودة إلى القاهرة',
   '15% off round trips between Damascus and Cairo.',
   'خصم 15% على رحلات الذهاب والعودة بين دمشق والقاهرة.',
   'trip', 'round_trip',
   '{"cabinClass":"economy","segments":[{"origin":"DAM","destination":"CAI"}]}',
   'percentage', 15, NULL,
   'time', '2026-11-01T00:00:00Z', '2027-02-28T23:59:59Z', NULL, 0, 'draft'),

  ('MC-GULF-TOUR',
   'Gulf multi-city tour', 'جولة خليجية متعددة المدن',
   'Fly Damascus → Dubai → Doha → Damascus and save 10%.',
   'سافر من دمشق إلى دبي ثم الدوحة وعد إلى دمشق ووفّر 10%.',
   'trip', 'multi_city',
   '{"cabinClass":"business","segments":[{"origin":"DAM","destination":"DXB"},{"origin":"DXB","destination":"DOH"},{"origin":"DOH","destination":"DAM"}]}',
   'percentage', 10, NULL,
   'passengers', '2026-10-01T00:00:00Z', NULL, 40, 0, 'active'),

  ('BAG-EXTRA10',
   'Extra 10 kg baggage', 'أمتعة إضافية 10 كغ',
   'Add 10 kg of checked baggage at 30% off.',
   'أضف 10 كغ من الأمتعة المسجلة بخصم 30%.',
   'baggage', NULL,
   '{"baggageType":"checked","weightKg":10}',
   'percentage', 30, NULL,
   'time', '2026-09-01T00:00:00Z', '2026-09-30T23:59:59Z', NULL, 0, 'active'),

  ('SEAT-LEGROOM',
   'Extra legroom seats', 'مقاعد بمساحة أرجل إضافية',
   'USD 15 off extra-legroom seat selection for the first 250 passengers.',
   'خصم 15 دولاراً على اختيار مقاعد بمساحة أرجل إضافية لأول 250 مسافراً.',
   'seat', NULL,
   '{"seatType":"extra_legroom","cabinClass":"economy"}',
   'fixed', 15, 'USD',
   'passengers', '2026-10-01T00:00:00Z', NULL, 250, 40, 'inactive'),

  ('PAY-VISA5',
   'Pay with Visa, save 5%', 'ادفع بفيزا ووفّر 5%',
   '5% off bookings over USD 200 paid with a Visa credit card.',
   'خصم 5% على الحجوزات التي تتجاوز 200 دولار عند الدفع ببطاقة فيزا الائتمانية.',
   'payment', NULL,
   '{"paymentMethod":"credit_card","cardScheme":"visa","minSpend":200}',
   'percentage', 5, NULL,
   'time', '2026-10-01T00:00:00Z', '2027-03-31T23:59:59Z', NULL, 0, 'active')
ON CONFLICT (code) DO NOTHING;
