-- Dynamic site footer (one document per language).
--
-- The public site (new_fly_cham) renders its footer from this document and
-- the cms2 admin edits it; both go through the cms backend routes
-- /api/public/get-footer and /api/public/update-footer. Shape + limits are
-- validated server-side in cms/src/lib/site-footer.ts (FooterDocument).
--
--   data     jsonb   the FooterDocument (schemaVersion 1)
--   version  integer optimistic-concurrency counter (update ... where version = ?)
--
-- RLS: readable by anon + authenticated; INSERT/UPDATE for admins only
-- (public.is_admin()); no DELETE policy.
--
-- Seed: both rows (en, ar) reproduce today's static footer exactly. Generated
-- from default-footer.json — do not hand-edit the JSON below.

CREATE TABLE IF NOT EXISTS public.site_footer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang text NOT NULL UNIQUE CHECK (lang IN ('en', 'ar')),
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.site_footer IS
  'Dynamic site footer document per language (FooterDocument, see cms/src/lib/site-footer.ts).';
COMMENT ON COLUMN public.site_footer.version IS
  'Optimistic concurrency counter; bumped by every successful update.';

GRANT SELECT ON public.site_footer TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_footer TO authenticated;
GRANT ALL ON public.site_footer TO service_role;
ALTER TABLE public.site_footer ENABLE ROW LEVEL SECURITY;

-- Keep updated_at current and stamp the editor (auth.uid() is NULL for
-- migrations / service-role writes).
CREATE OR REPLACE FUNCTION public.site_footer_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.site_footer_touch() FROM PUBLIC;

DROP TRIGGER IF EXISTS site_footer_touch ON public.site_footer;
CREATE TRIGGER site_footer_touch
  BEFORE INSERT OR UPDATE ON public.site_footer
  FOR EACH ROW EXECUTE FUNCTION public.site_footer_touch();

-- policies
DROP POLICY IF EXISTS "Site footer is public" ON public.site_footer;
CREATE POLICY "Site footer is public" ON public.site_footer
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins insert site footer" ON public.site_footer;
CREATE POLICY "Admins insert site footer" ON public.site_footer
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update site footer" ON public.site_footer;
CREATE POLICY "Admins update site footer" ON public.site_footer
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- seed (generated from default-footer.json)
INSERT INTO public.site_footer (lang, data, version) VALUES
  ('en', $footer_seed${"schemaVersion":1,"brand":{"logoUrl":"https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout/logo.webp","logoAlt":"Fly Cham","logoHref":"/","followText":"Follow and share your experience with us","patternUrl":"https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout/footer-pattern.webp"},"social":[{"id":"whatsapp","icon":"WhatsappLogo","label":"WhatsApp","href":"#","showOnMobile":true},{"id":"instagram","icon":"InstagramLogo","label":"Instagram","href":"#","showOnMobile":true},{"id":"facebook","icon":"FacebookLogo","label":"Facebook","href":"#","showOnMobile":true},{"id":"telegram","icon":"TelegramLogo","label":"Telegram","href":"#","showOnMobile":true},{"id":"tiktok","icon":"TiktokLogo","label":"TikTok","href":"#","showOnMobile":false},{"id":"youtube","icon":"YoutubeLogo","label":"YouTube","href":"#","showOnMobile":false},{"id":"x","icon":"XLogo","label":"X","href":"#","showOnMobile":false},{"id":"linkedin","icon":"LinkedinLogo","label":"LinkedIn","href":"#","showOnMobile":false}],"columns":[{"id":"about","title":"About","href":"/about-us","group":1,"links":[{"id":"about","label":"About Fly Cham","href":"/about-us","external":false,"highlight":false},{"id":"responsibility","label":"Our Responsibility","href":"/our-responsibility","external":false,"highlight":false},{"id":"fleet","label":"Our Fleet","href":"/our-fleet","external":false,"highlight":false},{"id":"careers","label":"Careers","href":"https://careers.flycham.com/sy/en","external":true,"highlight":false}]},{"id":"book","title":"Book Flights","href":"/","group":2,"links":[{"id":"searchFlights","label":"Search a Flights","href":"/","external":false,"highlight":false},{"id":"flightSchedule","label":"Flight Schedule","href":"/coming-soon","external":false,"highlight":false},{"id":"flightStatus","label":"Flight Status","href":"/help","external":false,"highlight":false}]},{"id":"whereWeFly","title":"Where We Fly","href":"/our-destinations","group":3,"links":[{"id":"destinations","label":"Our Destinations","href":"/our-destinations","external":false,"highlight":false},{"id":"activities","label":"Activities and Attractions","href":"/our-destinations/city-sights","external":false,"highlight":false}]},{"id":"experience","title":"Travel Experience","href":"/travel-experience","group":4,"links":[{"id":"beforeYouFly","label":"Before You Fly","href":"/travel-experience/before-you-fly","external":false,"highlight":false},{"id":"atAirport","label":"At the Airport","href":"/travel-experience/at-the-airport","external":false,"highlight":false},{"id":"onboard","label":"Onboard","href":"/travel-experience/onboard","external":false,"highlight":false},{"id":"afterTravel","label":"After Travel","href":"/travel-experience/after-travel","external":false,"highlight":false}]},{"id":"help","title":"Help","href":"/help","group":1,"links":[{"id":"helpCenter","label":"Help Center","href":"/help","external":false,"highlight":false},{"id":"contactUs","label":"Contact Us","href":"/help/contact-us","external":false,"highlight":false},{"id":"offices","label":"Sales Offices","href":"/help/contact-us/our-offices","external":false,"highlight":false},{"id":"gsa","label":"General Sales Agents","href":"/help/contact-us/our-gsa","external":false,"highlight":false},{"id":"forms","label":"Forms Requests","href":"/help/contact-us/forms","external":false,"highlight":false},{"id":"travelUpdates","label":"Travel Updates","href":"/travel-updates","external":false,"highlight":false},{"id":"faqs","label":"FAQs","href":"/help/faqs","external":false,"highlight":false}]},{"id":"business","title":"Business","href":"/business-center","group":2,"links":[{"id":"businessCenter","label":"Business Center","href":"/business-center","external":false,"highlight":false},{"id":"b2b","label":"B2B Platform","href":"/login-travel-agent","external":false,"highlight":false},{"id":"developers","label":"Developer Integrations","href":"/coming-soon","external":false,"highlight":false},{"id":"partner","label":"Become a Partner","href":"/help/contact-us/forms","external":false,"highlight":false}]},{"id":"media","title":"Media & News","href":"/media-center","group":3,"links":[{"id":"mediaCenter","label":"Media center","href":"/media-center","external":false,"highlight":false},{"id":"recentNews","label":"Recent News","href":"/recent-news","external":false,"highlight":false},{"id":"magazine","label":"Marhaba Magazine","href":"/travel-experience/traveler-magazine","external":false,"highlight":false}]}],"legal":{"copyright":"© All Rights Reserved. Fly Cham 2025","links":[{"id":"sitemap","label":"Site Map","href":"/coming-soon","showOnMobile":false},{"id":"terms","label":"Website Terms and Conditions","href":"/legal/terms-and-conditions","showOnMobile":true},{"id":"privacy","label":"Privacy Policy","href":"/legal/privacy-policy","showOnMobile":true},{"id":"cookies","label":"Cookies Policy","href":"/legal/cookies","showOnMobile":true},{"id":"bookingTerms","label":"Bookings Terms and Conditions","href":"/legal/booking-terms-and-conditions","showOnMobile":true}]},"style":{"bg":"primary-1","showPattern":true,"columnTitleColor":"secondary","columnTitleColorHover":"50","columnTitleFontWeight":"semibold","mobileTitleColor":"50","mobileTitleColorHover":"secondary","mobileTitleFontWeight":"semibold","linkColor":"50","linkColorHover":"secondary","linkFontWeight":"normal","highlightColor":"secondary","followTextColor":"50","socialColor":"50","socialColorHover":"primary-2","legalColor":"50","legalColorHover":"primary-2","dividerColor":"50"}}$footer_seed$::jsonb, 1),
  ('ar', $footer_seed${"schemaVersion":1,"brand":{"logoUrl":"https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout/logo.webp","logoAlt":"Fly Cham","logoHref":"/","followText":"تابعنا وشارك تجربتك معنا","patternUrl":"https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout/footer-pattern.webp"},"social":[{"id":"whatsapp","icon":"WhatsappLogo","label":"واتساب","href":"#","showOnMobile":true},{"id":"instagram","icon":"InstagramLogo","label":"إنستغرام","href":"#","showOnMobile":true},{"id":"facebook","icon":"FacebookLogo","label":"فيسبوك","href":"#","showOnMobile":true},{"id":"telegram","icon":"TelegramLogo","label":"تيليغرام","href":"#","showOnMobile":true},{"id":"tiktok","icon":"TiktokLogo","label":"تيك توك","href":"#","showOnMobile":false},{"id":"youtube","icon":"YoutubeLogo","label":"يوتيوب","href":"#","showOnMobile":false},{"id":"x","icon":"XLogo","label":"إكس","href":"#","showOnMobile":false},{"id":"linkedin","icon":"LinkedinLogo","label":"لينكد إن","href":"#","showOnMobile":false}],"columns":[{"id":"about","title":"عن فلاي شام","href":"/about-us","group":1,"links":[{"id":"about","label":"عن فلاي شام","href":"/about-us","external":false,"highlight":false},{"id":"responsibility","label":"مسؤوليتنا","href":"/our-responsibility","external":false,"highlight":false},{"id":"fleet","label":"أسطولنا","href":"/our-fleet","external":false,"highlight":false},{"id":"careers","label":"الوظائف","href":"https://careers.flycham.com/sy/en","external":true,"highlight":false}]},{"id":"book","title":"حجز الرحلات","href":"/","group":2,"links":[{"id":"searchFlights","label":"ابحث عن رحلات","href":"/","external":false,"highlight":false},{"id":"flightSchedule","label":"جدول الرحلات","href":"/coming-soon","external":false,"highlight":false},{"id":"flightStatus","label":"حالة الرحلة","href":"/help","external":false,"highlight":false}]},{"id":"whereWeFly","title":"وجهاتنا","href":"/our-destinations","group":3,"links":[{"id":"destinations","label":"وجهاتنا","href":"/our-destinations","external":false,"highlight":false},{"id":"activities","label":"الأنشطة والمعالم","href":"/our-destinations/city-sights","external":false,"highlight":false}]},{"id":"experience","title":"تجربة السفر","href":"/travel-experience","group":4,"links":[{"id":"beforeYouFly","label":"قبل السفر","href":"/travel-experience/before-you-fly","external":false,"highlight":false},{"id":"atAirport","label":"في المطار","href":"/travel-experience/at-the-airport","external":false,"highlight":false},{"id":"onboard","label":"على متن الطائرة","href":"/travel-experience/onboard","external":false,"highlight":false},{"id":"afterTravel","label":"بعد السفر","href":"/travel-experience/after-travel","external":false,"highlight":false}]},{"id":"help","title":"المساعدة","href":"/help","group":1,"links":[{"id":"helpCenter","label":"مركز المساعدة","href":"/help","external":false,"highlight":false},{"id":"contactUs","label":"اتصل بنا","href":"/help/contact-us","external":false,"highlight":false},{"id":"offices","label":"مكاتب المبيعات","href":"/help/contact-us/our-offices","external":false,"highlight":false},{"id":"gsa","label":"وكلاء المبيعات العامون","href":"/help/contact-us/our-gsa","external":false,"highlight":false},{"id":"forms","label":"طلبات النماذج","href":"/help/contact-us/forms","external":false,"highlight":false},{"id":"travelUpdates","label":"تحديثات السفر","href":"/travel-updates","external":false,"highlight":false},{"id":"faqs","label":"الأسئلة الشائعة","href":"/help/faqs","external":false,"highlight":false}]},{"id":"business","title":"الأعمال","href":"/business-center","group":2,"links":[{"id":"businessCenter","label":"مركز الأعمال","href":"/business-center","external":false,"highlight":false},{"id":"b2b","label":"منصة الأعمال B2B","href":"/login-travel-agent","external":false,"highlight":false},{"id":"developers","label":"تكاملات المطورين","href":"/coming-soon","external":false,"highlight":false},{"id":"partner","label":"كن شريكاً","href":"/help/contact-us/forms","external":false,"highlight":false}]},{"id":"media","title":"الإعلام والأخبار","href":"/media-center","group":3,"links":[{"id":"mediaCenter","label":"المركز الإعلامي","href":"/media-center","external":false,"highlight":false},{"id":"recentNews","label":"أحدث الأخبار","href":"/recent-news","external":false,"highlight":false},{"id":"magazine","label":"مجلة مرحبا","href":"/travel-experience/traveler-magazine","external":false,"highlight":false}]}],"legal":{"copyright":"© جميع الحقوق محفوظة. فلاي شام 2025","links":[{"id":"sitemap","label":"خريطة الموقع","href":"/coming-soon","showOnMobile":false},{"id":"terms","label":"شروط وأحكام الموقع","href":"/legal/terms-and-conditions","showOnMobile":true},{"id":"privacy","label":"سياسة الخصوصية","href":"/legal/privacy-policy","showOnMobile":true},{"id":"cookies","label":"سياسة ملفات تعريف الارتباط","href":"/legal/cookies","showOnMobile":true},{"id":"bookingTerms","label":"شروط وأحكام الحجز","href":"/legal/booking-terms-and-conditions","showOnMobile":true}]},"style":{"bg":"primary-1","showPattern":true,"columnTitleColor":"secondary","columnTitleColorHover":"50","columnTitleFontWeight":"semibold","mobileTitleColor":"50","mobileTitleColorHover":"secondary","mobileTitleFontWeight":"semibold","linkColor":"50","linkColorHover":"secondary","linkFontWeight":"normal","highlightColor":"secondary","followTextColor":"50","socialColor":"50","socialColorHover":"primary-2","legalColor":"50","legalColorHover":"primary-2","dividerColor":"50"}}$footer_seed$::jsonb, 1)
ON CONFLICT (lang) DO NOTHING;
