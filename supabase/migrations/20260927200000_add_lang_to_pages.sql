-- Store the language a page is authored in.
--
-- Pages created from the cms2 admin ("Add new page") are single-language: the
-- admin picks English or Arabic. Components are already per-language
-- (`page_components.lang`), but the page row itself had no language, so the
-- choice could not be stored, shown in the pages table, or enforced.
--
--   lang = 'en' | 'ar'  → the page exists only in that language
--   lang IS NULL        → bilingual page (every page created before this
--                         migration: help, home, about-us, …) — unchanged
--
-- No backfill: existing pages stay NULL (bilingual), so nothing changes for
-- them on the public site or in the editor.

ALTER TABLE public.pages
  ADD COLUMN lang text NULL
  CHECK (lang IS NULL OR lang IN ('en', 'ar'));

COMMENT ON COLUMN public.pages.lang IS
  'Authoring language of a single-language page (en|ar). NULL = bilingual page.';

-- Integrity: a single-language page may only hold components in its own
-- language. Rejects linking an Arabic component to an English-only page (and
-- vice versa); bilingual (NULL) pages accept both.
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

CREATE TRIGGER page_components_enforce_page_lang
  BEFORE INSERT OR UPDATE OF page_id, lang ON public.page_components
  FOR EACH ROW EXECUTE FUNCTION public.enforce_page_component_lang();

-- And the reverse: a page can't be switched to a single language while it
-- still has components in the other one.
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

CREATE TRIGGER pages_enforce_lang_change
  BEFORE UPDATE OF lang ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_page_lang_change();

-- Rollback:
--   DROP TRIGGER IF EXISTS pages_enforce_lang_change ON public.pages;
--   DROP TRIGGER IF EXISTS page_components_enforce_page_lang ON public.page_components;
--   DROP FUNCTION IF EXISTS public.enforce_page_lang_change();
--   DROP FUNCTION IF EXISTS public.enforce_page_component_lang();
--   ALTER TABLE public.pages DROP COLUMN IF EXISTS lang;
