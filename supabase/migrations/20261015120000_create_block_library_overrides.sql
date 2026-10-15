-- Custom name / preview image for a component in the cms2 "Add a component"
-- library. One row per component type (section id); an empty value keeps the
-- built-in default. Only the library list reads this — blocks already on pages
-- keep their own content and labels.
-- Read by any CMS client, writes limited to CMS admins (public.is_admin()).

CREATE TABLE IF NOT EXISTS public.block_library_overrides (
  section_id text PRIMARY KEY CHECK (
    section_id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(section_id) <= 80
  ),
  label text NOT NULL DEFAULT '' CHECK (char_length(label) <= 80),
  preview_url text NOT NULL DEFAULT '' CHECK (char_length(preview_url) <= 1024),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.block_library_overrides IS
  'Custom name / preview image per component type in the cms2 Add-component library (pages unaffected).';

GRANT SELECT ON public.block_library_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.block_library_overrides TO authenticated;
GRANT ALL ON public.block_library_overrides TO service_role;
ALTER TABLE public.block_library_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block library overrides are readable" ON public.block_library_overrides;
CREATE POLICY "Block library overrides are readable" ON public.block_library_overrides
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins insert block library overrides" ON public.block_library_overrides;
CREATE POLICY "Admins insert block library overrides" ON public.block_library_overrides
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update block library overrides" ON public.block_library_overrides;
CREATE POLICY "Admins update block library overrides" ON public.block_library_overrides
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete block library overrides" ON public.block_library_overrides;
CREATE POLICY "Admins delete block library overrides" ON public.block_library_overrides
  FOR DELETE TO authenticated
  USING (public.is_admin());
