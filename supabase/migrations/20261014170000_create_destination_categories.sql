-- Destination categories shared by Sights Grid (filter pills + each sight's
-- category) and Destination Things to Do (each card's badge). One row is one
-- category with English + Arabic labels. Pages no longer embed their own
-- category/tag lists or badge text: an item stores the category slug and both
-- apps read labels/icons from this table.

CREATE TABLE IF NOT EXISTS public.destination_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 2 AND 40),
  label_en text NOT NULL CHECK (char_length(btrim(label_en)) BETWEEN 1 AND 80),
  label_ar text NOT NULL CHECK (char_length(btrim(label_ar)) BETWEEN 1 AND 80),
  icon text NOT NULL DEFAULT 'landmarks',
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0 AND position <= 999),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Icon: a Phosphor icon name ("MapPin", picked in the admin) or one of the
-- original curated keys ("landmarks", "mountains", ...). Dropped and re-added so
-- a table created by the first version of this file (which allowed only the 10
-- curated keys) gets the new rule too.
ALTER TABLE public.destination_categories
  DROP CONSTRAINT IF EXISTS destination_categories_icon_check;
ALTER TABLE public.destination_categories
  ADD CONSTRAINT destination_categories_icon_check CHECK (icon ~ '^[A-Za-z][A-Za-z0-9]{0,63}$');

CREATE INDEX IF NOT EXISTS destination_categories_position_idx
  ON public.destination_categories (position, slug);

COMMENT ON TABLE public.destination_categories IS
  'Destination categories: Sights Grid filter pills and the category assigned to each sight.';

GRANT SELECT ON public.destination_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_categories TO authenticated;
GRANT ALL ON public.destination_categories TO service_role;
ALTER TABLE public.destination_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Destination categories are public" ON public.destination_categories;
CREATE POLICY "Destination categories are public" ON public.destination_categories
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins insert destination categories" ON public.destination_categories;
CREATE POLICY "Admins insert destination categories" ON public.destination_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update destination categories" ON public.destination_categories;
CREATE POLICY "Admins update destination categories" ON public.destination_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete destination categories" ON public.destination_categories;
CREATE POLICY "Admins delete destination categories" ON public.destination_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 1–7: the categories the live Sights Grid used to embed (activities-and-
-- attractions, EN + AR), in the same order and with the same icons.
-- 8–16: the badges the live Things to Do cards used to store as text, with the
-- Arabic wording from the AR pages.
INSERT INTO public.destination_categories (slug, label_en, label_ar, icon, position)
VALUES
  ('nature', 'Nature', 'الطبيعة', 'mountains', 1),
  ('museums', 'Museums', 'المتاحف', 'museums', 2),
  ('activities', 'Activities', 'الأنشطة', 'activities', 3),
  ('shopping', 'Shopping', 'التسوّق', 'shopping', 4),
  ('religious-sites', 'Religious Sites', 'المواقع الدينية', 'religion', 5),
  ('landmarks', 'Landmarks', 'المعالم', 'landmarks', 6),
  ('islands', 'Islands', 'الجزر', 'nature', 7),
  ('visit', 'Visit', 'قم بزيارة', 'MapPin', 8),
  ('walk-through', 'Walk Through', 'تجول في', 'PersonSimpleWalk', 9),
  ('see', 'See', 'شاهد', 'Binoculars', 10),
  ('shop', 'Shop', 'تسوّق', 'ShoppingCart', 11),
  ('have-fun', 'Have Fun', 'استمتع في', 'Confetti', 12),
  ('experience', 'Experience', 'عِش المغامرة', 'Sparkle', 13),
  ('cruise', 'Cruise', 'رحلة بحرية', 'Boat', 14),
  ('hike', 'Hike', 'المشي والتسلّق', 'PersonSimpleHike', 15),
  ('hiking-and-skiing', 'Hiking and Skiing', 'المشي والتزلّج', 'PersonSimpleSki', 16)
ON CONFLICT (slug) DO NOTHING;

-- Move existing Sights Grid blocks onto the table: each item's legacy category
-- id ("Nature", "Religious Sites", "Island", old default "religion") becomes the
-- matching slug, and the embedded `categories` list is removed. Content is
-- either one body or a per-language map ({ en: {...}, ar: {...} }).
CREATE OR REPLACE FUNCTION pg_temp.destination_category_slug(legacy text, legacy_label text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT dc.slug
  FROM public.destination_categories AS dc
  WHERE dc.slug = btrim(lower(regexp_replace(btrim(legacy), '[^a-zA-Z0-9]+', '-', 'g')), '-')
     OR lower(dc.label_en) = lower(btrim(legacy))
     OR lower(dc.label_en) = lower(btrim(coalesce(legacy_label, '')))
     OR (lower(btrim(legacy)) = 'religion' AND dc.slug = 'religious-sites')
  ORDER BY dc.slug = btrim(lower(regexp_replace(btrim(legacy), '[^a-zA-Z0-9]+', '-', 'g')), '-') DESC, dc.position
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION pg_temp.migrate_sights_grid_body(body jsonb)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN jsonb_typeof(body) IS DISTINCT FROM 'object' THEN body
    WHEN jsonb_typeof(body -> 'items') IS DISTINCT FROM 'array' THEN body - 'categories'
    ELSE (body - 'categories') || jsonb_build_object('items', (
      SELECT coalesce(jsonb_agg(
        CASE
          WHEN jsonb_typeof(item) = 'object' AND coalesce(item ->> 'category', '') <> '' THEN
            jsonb_set(item, '{category}', to_jsonb(coalesce(
              pg_temp.destination_category_slug(
                item ->> 'category',
                (
                  SELECT cat ->> 'label'
                  FROM jsonb_array_elements(
                    CASE WHEN jsonb_typeof(body -> 'categories') = 'array' THEN body -> 'categories' ELSE '[]'::jsonb END
                  ) AS cat
                  WHERE cat ->> 'id' = item ->> 'category'
                  LIMIT 1
                )
              ),
              item ->> 'category'
            )))
          ELSE item
        END
        ORDER BY ord
      ), '[]'::jsonb)
      FROM jsonb_array_elements(body -> 'items') WITH ORDINALITY AS t(item, ord)
    ))
  END
$$;

UPDATE public.components AS c
SET
  content = CASE
    WHEN c.content ?| ARRAY['items', 'categories', 'title'] THEN pg_temp.migrate_sights_grid_body(c.content)
    ELSE (
      SELECT coalesce(jsonb_object_agg(l.key, pg_temp.migrate_sights_grid_body(l.value)), '{}'::jsonb)
      FROM jsonb_each(c.content) AS l
    )
  END,
  updated_at = now()
WHERE c.type = 'sights-grid'
  AND jsonb_typeof(c.content) = 'object';

-- Move existing Things to Do blocks onto the table: each card's badge text
-- ("Visit", "قم بزيارة", or English text left on an AR page) becomes `badgeId`
-- = the matching slug and the text is removed, along with the per-page `tags`
-- list. An AR badge whose wording matches no category (e.g. "استمتع") takes the
-- category of the card at the same position in the page's English block.
CREATE OR REPLACE FUNCTION pg_temp.destination_badge_slug(badge text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT dc.slug
  FROM public.destination_categories AS dc
  WHERE btrim(coalesce(badge, '')) <> ''
    AND (
      lower(dc.label_en) = lower(btrim(badge))
      OR dc.label_ar = btrim(badge)
      OR dc.slug = lower(btrim(badge))
    )
  ORDER BY dc.position
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION pg_temp.things_to_do_sibling_badge(component uuid, idx integer)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT sl.body -> 'items' -> idx ->> 'badge'
  FROM public.page_components AS pc
  JOIN public.page_components AS spc
    ON spc.page_id = pc.page_id
   AND spc.lang = 'en'
   AND spc.component_id <> pc.component_id
  JOIN public.components AS sc
    ON sc.id = spc.component_id
   AND sc.type = 'destination-things-to-do'
  CROSS JOIN LATERAL jsonb_each(sc.content) AS sl(lang, body)
  WHERE pc.component_id = component
    AND pc.lang <> 'en'
    AND jsonb_typeof(sl.body -> 'items') = 'array'
  ORDER BY abs(spc.position - pc.position), sl.lang = 'en' DESC
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION pg_temp.migrate_things_to_do_body(component uuid, body jsonb)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN jsonb_typeof(body) IS DISTINCT FROM 'object' THEN body
    WHEN jsonb_typeof(body -> 'items') IS DISTINCT FROM 'array' THEN body - 'tags'
    ELSE (body - 'tags') || jsonb_build_object('items', (
      SELECT coalesce(jsonb_agg(
        CASE
          WHEN jsonb_typeof(t.item) IS DISTINCT FROM 'object' THEN t.item
          WHEN btrim(coalesce(t.item ->> 'badge', '')) = '' THEN
            (t.item - 'badge') || jsonb_build_object(
              'badgeId', coalesce(pg_temp.destination_badge_slug(t.item ->> 'badgeId'), '')
            )
          WHEN m.slug IS NOT NULL THEN
            (t.item - 'badge') || jsonb_build_object('badgeId', m.slug)
          ELSE t.item
        END
        ORDER BY t.ord
      ), '[]'::jsonb)
      FROM jsonb_array_elements(body -> 'items') WITH ORDINALITY AS t(item, ord)
      LEFT JOIN LATERAL (
        SELECT coalesce(
          pg_temp.destination_badge_slug(t.item ->> 'badge'),
          pg_temp.destination_badge_slug(
            pg_temp.things_to_do_sibling_badge(component, (t.ord - 1)::integer)
          )
        ) AS slug
      ) AS m ON true
    ))
  END
$$;

UPDATE public.components AS c
SET
  content = CASE
    WHEN c.content ?| ARRAY['items', 'tags', 'title'] THEN pg_temp.migrate_things_to_do_body(c.id, c.content)
    ELSE (
      SELECT coalesce(jsonb_object_agg(l.key, pg_temp.migrate_things_to_do_body(c.id, l.value)), '{}'::jsonb)
      FROM jsonb_each(c.content) AS l
    )
  END,
  updated_at = now()
WHERE c.type = 'destination-things-to-do'
  AND jsonb_typeof(c.content) = 'object';
