-- Make a page's component set language-specific.
--
-- Until now a `page_components` link was shared across languages: English and
-- Arabic rendered the SAME set of components, differing only by each
-- component's per-language `content`/`style` map. This ties every link to one
-- language, so a page's English and Arabic versions can hold different
-- components — and creating or deleting a component on one language no longer
-- affects the other.

ALTER TABLE public.page_components
  ADD COLUMN lang text NOT NULL DEFAULT 'en'
  CHECK (lang IN ('en', 'ar'));

-- Existing links become the English set. Duplicate each one (and a copy of its
-- component) for Arabic so every page keeps its current content in BOTH
-- languages; the two copies are fully independent from here on.
DO $$
DECLARE
  r RECORD;
  new_component_id uuid;
BEGIN
  FOR r IN
    SELECT pc.page_id,
           pc.position,
           c.type,
           c.position AS component_position,
           c.style,
           c.content
    FROM public.page_components pc
    JOIN public.components c ON c.id = pc.component_id
    WHERE pc.lang = 'en'
  LOOP
    INSERT INTO public.components (type, position, style, content)
    VALUES (r.type, r.component_position, r.style, r.content)
    RETURNING id INTO new_component_id;

    INSERT INTO public.page_components (page_id, component_id, position, lang)
    VALUES (r.page_id, new_component_id, r.position, 'ar');
  END LOOP;
END $$;

-- Each component instance still belongs to a single link; keep the uniqueness
-- but scope it per language.
ALTER TABLE public.page_components
  DROP CONSTRAINT IF EXISTS page_components_page_id_component_id_key;
ALTER TABLE public.page_components
  ADD CONSTRAINT page_components_page_component_lang_key
  UNIQUE (page_id, component_id, lang);

-- Ordering is now per (page, language).
DROP INDEX IF EXISTS public.page_components_page_position_idx;
CREATE INDEX page_components_page_lang_position_idx
  ON public.page_components (page_id, lang, position);
