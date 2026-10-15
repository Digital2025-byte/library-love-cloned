-- Shared destination categories for Sights Grid and Destination Things to Do.
-- One row is one category (English + Arabic labels). Both components assign
-- items by slug and read the labels from this table.

CREATE TABLE IF NOT EXISTS public.destination_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 2 AND 40),
  label_en text NOT NULL CHECK (char_length(btrim(label_en)) BETWEEN 1 AND 80),
  label_ar text NOT NULL CHECK (char_length(btrim(label_ar)) BETWEEN 1 AND 80),
  icon text NOT NULL DEFAULT 'landmarks' CHECK (
    icon IN ('landmarks', 'religion', 'shopping', 'activities', 'nature', 'museums', 'mapPin', 'camera', 'mountains', 'storefront')
  ),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0 AND position <= 999),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS destination_categories_position_idx
  ON public.destination_categories (position, slug);

COMMENT ON TABLE public.destination_categories IS
  'Shared categories for Sights Grid pills and Destination Things to Do badges.';

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

INSERT INTO public.destination_categories (slug, label_en, label_ar, icon, position)
VALUES
  ('landmarks', 'Landmarks', 'المعالم', 'landmarks', 1),
  ('religion', 'Religion', 'دينية', 'religion', 2),
  ('shopping', 'Shopping', 'التسوّق', 'shopping', 3),
  ('activities', 'Activities', 'الأنشطة', 'activities', 4),
  ('nature', 'Nature', 'الطبيعة', 'nature', 5),
  ('museums', 'Museums', 'المتاحف', 'museums', 6)
ON CONFLICT (slug) DO NOTHING;
