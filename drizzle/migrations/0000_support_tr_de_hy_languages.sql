-- Enable Turkish (tr), German (de) and Armenian (hy) alongside English (en)
-- and Arabic (ar) everywhere a language code is constrained.
--
-- Existing rows are untouched: every stored value is still allowed.

-- pages.lang did not exist yet on the live database (the repo migration
-- 20260927200000_add_lang_to_pages was never applied). Add it here, nullable
-- (NULL = bilingual page), allowing all five locales from the start.
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS lang text NULL
  CHECK (lang IS NULL OR lang IN ('en', 'ar', 'tr', 'de', 'hy'));

COMMENT ON COLUMN public.pages.lang IS
  'Authoring language of a single-language page (en|ar|tr|de|hy). NULL = bilingual page.';

-- Integrity triggers from the same repo migration: a single-language page may
-- only hold components in its own language, and a page cannot be switched to
-- a single language while it still has components in another. Both compare
-- against the page's own lang value dynamically, so they work for tr/de/hy
-- unchanged.
CREATE OR REPLACE FUNCTION public.enforce_page_component_lang()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  page_lang text;
BEGIN
  SELECT lang INTO page_lang FROM public.pages WHERE id = NEW.page_id;
  IF page_lang IS NOT NULL AND NEW.lang <> page_lang THEN
    RAISE EXCEPTION
      'Page % is %-only; cannot add a % component', NEW.page_id, page_lang, NEW.lang
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS page_components_enforce_page_lang ON public.page_components;
CREATE TRIGGER page_components_enforce_page_lang
  BEFORE INSERT OR UPDATE OF page_id, lang ON public.page_components
  FOR EACH ROW EXECUTE FUNCTION public.enforce_page_component_lang();

CREATE OR REPLACE FUNCTION public.enforce_page_lang_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.lang IS NOT NULL
     AND NEW.lang IS DISTINCT FROM OLD.lang
     AND EXISTS (
       SELECT 1 FROM public.page_components
       WHERE page_id = NEW.id AND lang <> NEW.lang
     ) THEN
    RAISE EXCEPTION
      'Page % still has components in another language; cannot make it %-only',
      NEW.slug, NEW.lang
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pages_enforce_lang_change ON public.pages;
CREATE TRIGGER pages_enforce_lang_change
  BEFORE UPDATE OF lang ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_page_lang_change();

-- page_components.lang: widen the existing en/ar check to all five locales.
ALTER TABLE public.page_components
  DROP CONSTRAINT IF EXISTS page_components_lang_check;
ALTER TABLE public.page_components
  ADD CONSTRAINT page_components_lang_check
  CHECK (lang IN ('en', 'ar', 'tr', 'de', 'hy'));

-- site_header.lang (UNIQUE constraint preserved)
ALTER TABLE public.site_header
  DROP CONSTRAINT IF EXISTS site_header_lang_check;
ALTER TABLE public.site_header
  ADD CONSTRAINT site_header_lang_check
  CHECK (lang IN ('en', 'ar', 'tr', 'de', 'hy'));

-- site_footer.lang (UNIQUE constraint preserved)
ALTER TABLE public.site_footer
  DROP CONSTRAINT IF EXISTS site_footer_lang_check;
ALTER TABLE public.site_footer
  ADD CONSTRAINT site_footer_lang_check
  CHECK (lang IN ('en', 'ar', 'tr', 'de', 'hy'));

-- pos_list.languages: arrays may contain any of the five supported codes.
ALTER TABLE public.pos_list
  DROP CONSTRAINT IF EXISTS pos_list_languages_check;
ALTER TABLE public.pos_list
  ADD CONSTRAINT pos_list_languages_check
  CHECK (cardinality(languages) > 0 AND languages <@ ARRAY['en', 'ar', 'tr', 'de', 'hy']);