-- POS list (point of sale = the country picked in the website header).
-- One row per POS: URL code, names (en/ar), flag, booking currency, offered
-- languages. Read by the public site (GET /api/public/pos-list) for the header
-- country/region picker, the booking currency dropdowns and the /<pos>/ URLs;
-- managed in the admin at /cms2/pos.

CREATE TABLE IF NOT EXISTS public.pos_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[a-z]{2}$'),
  name_en text NOT NULL CHECK (char_length(name_en) BETWEEN 1 AND 80),
  name_ar text NOT NULL CHECK (char_length(name_ar) BETWEEN 1 AND 80),
  -- Empty = no flag (the site shows a globe, e.g. "Global").
  flag_url text NOT NULL DEFAULT '',
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  languages text[] NOT NULL DEFAULT ARRAY['en', 'ar']
    CHECK (cardinality(languages) > 0 AND languages <@ ARRAY['en', 'ar']),
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_list_position_idx ON public.pos_list (position, code);

DROP TRIGGER IF EXISTS pos_list_set_updated_at ON public.pos_list;
CREATE TRIGGER pos_list_set_updated_at
  BEFORE UPDATE ON public.pos_list
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.pos_list ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.pos_list TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pos_list TO authenticated;
GRANT ALL ON public.pos_list TO service_role;

DROP POLICY IF EXISTS "pos_list public read" ON public.pos_list;
CREATE POLICY "pos_list public read"
  ON public.pos_list FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pos_list admin write" ON public.pos_list;
CREATE POLICY "pos_list admin write"
  ON public.pos_list FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed: the 10 POS the site shipped with (flags in the cms-media bucket).
INSERT INTO public.pos_list (code, name_en, name_ar, flag_url, currency, languages, position)
VALUES
  ('sy', 'Syria', 'سوريا', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/sy.svg', 'SYP', ARRAY['en','ar'], 1),
  ('ae', 'United Arab Emirates', 'الإمارات العربية المتحدة', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/ae.svg', 'AED', ARRAY['en','ar'], 2),
  ('kw', 'Kuwait', 'الكويت', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/kw.svg', 'KWD', ARRAY['en','ar'], 3),
  ('iq', 'Iraq', 'العراق', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/iq.svg', 'IQD', ARRAY['en','ar'], 4),
  ('om', 'Oman', 'عُمان', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/om.svg', 'OMR', ARRAY['en','ar'], 5),
  ('tr', 'Turkey', 'تركيا', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/tr.svg', 'TRY', ARRAY['en','ar'], 6),
  ('ly', 'Libya', 'ليبيا', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/ly.svg', 'LYD', ARRAY['en','ar'], 7),
  ('sa', 'Saudi Arabia', 'المملكة العربية السعودية', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/sa.svg', 'SAR', ARRAY['en','ar'], 8),
  ('am', 'Armenia', 'أرمينيا', 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags/am.svg', 'AMD', ARRAY['en'], 9),
  ('gl', 'Global', 'عالمي', '', 'USD', ARRAY['en','ar'], 10)
ON CONFLICT (code) DO NOTHING;
