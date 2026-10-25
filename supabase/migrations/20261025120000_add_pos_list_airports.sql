-- Airports per POS (country). The Excess Baggage Calculator lists every
-- airport of the active POS rows in its From / To dropdowns, and the baggage
-- quote API (GET /api/public/baggage-prices/quote) maps a POS code to its
-- airports from here (main airport first). Managed in the admin at /cms2/pos.
--
-- Item shape: { "code": "DAM", "nameEn": "Damascus", "nameAr": "دمشق" }
-- (IATA code, upper case). An airport belongs to one POS only — the API
-- checks that on save.

ALTER TABLE public.pos_list
  ADD COLUMN IF NOT EXISTS airports jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.pos_list DROP CONSTRAINT IF EXISTS pos_list_airports_is_array;
ALTER TABLE public.pos_list
  ADD CONSTRAINT pos_list_airports_is_array CHECK (jsonb_typeof(airports) = 'array');

-- Seed the network's airports (replaces the hard-coded POS_AIRPORTS map in
-- cms/src/lib/baggage-prices.ts). Only rows that have none yet, so re-running
-- never overwrites the admin's edits.
UPDATE public.pos_list AS p
SET airports = v.airports
FROM (
  VALUES
    ('sy', '[{"code":"DAM","nameEn":"Damascus","nameAr":"دمشق"},{"code":"ALP","nameEn":"Aleppo","nameAr":"حلب"}]'::jsonb),
    ('ae', '[{"code":"DXB","nameEn":"Dubai","nameAr":"دبي"},{"code":"SHJ","nameEn":"Sharjah","nameAr":"الشارقة"},{"code":"AUH","nameEn":"Abu Dhabi","nameAr":"أبوظبي"}]'::jsonb),
    ('kw', '[{"code":"KWI","nameEn":"Kuwait","nameAr":"الكويت"}]'::jsonb),
    ('iq', '[{"code":"BGW","nameEn":"Baghdad","nameAr":"بغداد"},{"code":"EBL","nameEn":"Erbil","nameAr":"أربيل"}]'::jsonb),
    ('om', '[{"code":"MCT","nameEn":"Muscat","nameAr":"مسقط"}]'::jsonb),
    ('tr', '[{"code":"SAW","nameEn":"Istanbul","nameAr":"إسطنبول"}]'::jsonb),
    ('ly', '[{"code":"MJI","nameEn":"Tripoli","nameAr":"طرابلس"}]'::jsonb),
    ('am', '[{"code":"EVN","nameEn":"Yerevan","nameAr":"يريفان"}]'::jsonb)
) AS v(code, airports)
WHERE p.code = v.code
  AND p.airports = '[]'::jsonb;
