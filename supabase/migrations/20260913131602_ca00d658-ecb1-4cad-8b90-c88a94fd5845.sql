-- 1. Link table for the many-to-many relationship
CREATE TABLE public.page_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  component_id uuid NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, component_id)
);

CREATE INDEX page_components_page_position_idx
  ON public.page_components (page_id, position);
CREATE INDEX page_components_component_idx
  ON public.page_components (component_id);

GRANT SELECT ON public.page_components TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_components TO authenticated;
GRANT ALL ON public.page_components TO service_role;

ALTER TABLE public.page_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links of published pages are public"
  ON public.page_components FOR SELECT TO anon, authenticated
  USING (public.page_is_published(page_id));

CREATE POLICY "Admins read all links"
  ON public.page_components FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins insert links"
  ON public.page_components FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update links"
  ON public.page_components FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete links"
  ON public.page_components FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER page_components_set_updated_at
  BEFORE UPDATE ON public.page_components
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Backfill existing one-to-many links
INSERT INTO public.page_components (page_id, component_id, position)
SELECT page_id, id, position FROM public.components
ON CONFLICT (page_id, component_id) DO NOTHING;

-- 3. Component visibility now depends on the link table
CREATE OR REPLACE FUNCTION public.component_is_public(_component_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.page_components pc
    JOIN public.pages p ON p.id = pc.page_id
    WHERE pc.component_id = _component_id
      AND p.status = 'published'
  );
$$;

REVOKE ALL ON FUNCTION public.component_is_public(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.component_is_public(uuid) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Components of published pages are public" ON public.components;
CREATE POLICY "Components of published pages are public"
  ON public.components FOR SELECT TO anon, authenticated
  USING (public.component_is_public(id));

-- 4. Components are no longer owned by a single page
ALTER TABLE public.components DROP COLUMN page_id;