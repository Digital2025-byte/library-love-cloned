-- "Destination and Things to Do Images" media bucket (id: destination-images).
-- A second library beside cms-media: public read (images load on the site),
-- writes limited to CMS admins (public.is_admin()). Filled by
-- cms/scripts/sync-destination-images.mjs; browsed from the admin Insert Media
-- modal ("Destination and Things to Do Images" library).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'destination-images',
  'destination-images',
  true,
  5242880, -- 5 MB per object (images are ≤ 400 KB; _names.json is small)
  ARRAY['image/webp', 'image/png', 'image/jpeg', 'image/gif', 'image/avif', 'image/svg+xml', 'application/json']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "destination-images public read" ON storage.objects;
CREATE POLICY "destination-images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'destination-images');

DROP POLICY IF EXISTS "destination-images admin insert" ON storage.objects;
CREATE POLICY "destination-images admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'destination-images' AND public.is_admin());

DROP POLICY IF EXISTS "destination-images admin update" ON storage.objects;
CREATE POLICY "destination-images admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'destination-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'destination-images' AND public.is_admin());

DROP POLICY IF EXISTS "destination-images admin delete" ON storage.objects;
CREATE POLICY "destination-images admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'destination-images' AND public.is_admin());
