-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  );
$$;

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- component types lookup
CREATE TABLE public.component_types (
  id text PRIMARY KEY,
  label text NOT NULL
);

GRANT SELECT ON public.component_types TO anon, authenticated;
GRANT ALL ON public.component_types TO service_role;
ALTER TABLE public.component_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Component types are readable by everyone" ON public.component_types
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage component types" ON public.component_types
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.component_types (id, label) VALUES
  ('page-hero', 'Page Hero'),
  ('search-console', 'Search Console'),
  ('help-categories', 'Help Categories'),
  ('cta-banner', 'CTA Banner'),
  ('journey-section', 'Journey Section'),
  ('live-chat-banner', 'Live Chat Banner'),
  ('get-in-touch', 'Get In Touch'),
  ('location-directory', 'Location Directory'),
  ('faq-explorer', 'FAQ Explorer'),
  ('forms-directory', 'Forms Directory'),
  ('track-request', 'Track Request'),
  ('contact-cards', 'Contact Cards'),
  ('promo-banner', 'Promo Banner'),
  ('office-directory', 'Office Directory');

-- pages
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER pages_set_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- components
CREATE TABLE public.components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type text NOT NULL REFERENCES public.component_types(id),
  position integer NOT NULL DEFAULT 0,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX components_page_id_position_idx ON public.components (page_id, position);

GRANT SELECT ON public.components TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.components TO authenticated;
GRANT ALL ON public.components TO service_role;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER components_set_updated_at
  BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- helper so component policies do not depend on pages RLS
CREATE OR REPLACE FUNCTION public.page_is_published(_page_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pages
    WHERE id = _page_id AND status = 'published'
  );
$$;

-- pages policies
CREATE POLICY "Published pages are public" ON public.pages
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins read all pages" ON public.pages
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins insert pages" ON public.pages
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update pages" ON public.pages
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete pages" ON public.pages
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- components policies
CREATE POLICY "Components of published pages are public" ON public.components
  FOR SELECT TO anon, authenticated
  USING (public.page_is_published(page_id));

CREATE POLICY "Admins read all components" ON public.components
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins insert components" ON public.components
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update components" ON public.components
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete components" ON public.components
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- seeds
INSERT INTO public.pages (slug, label, description, status) VALUES
  ('help', 'Help', 'Help center landing page', 'published'),
  ('contact-us', 'Contact Us', 'Contact channels and enquiry forms', 'published'),
  ('our-offices', 'Our Offices', 'Office directory', 'published'),
  ('our-gsa', 'Our GSA', 'General sales agents directory', 'published'),
  ('forms', 'Forms', 'Downloadable and online forms', 'published'),
  ('faqs', 'FAQs', 'Frequently asked questions', 'published');