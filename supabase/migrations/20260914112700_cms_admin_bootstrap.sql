-- Seed a local CMS admin Auth user and grant the admin role.
-- Email signups are disabled on this project, so the user is inserted into auth schema.

CREATE OR REPLACE FUNCTION public.ensure_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE role = 'admin'::public.app_role
  ) THEN
    RETURN public.is_admin();
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_first_admin() TO authenticated;

DO $$
DECLARE
  uid uuid := '11111111-1111-4111-8111-111111111111';
  user_email text := 'admin@flycham.local';
  hashed text;
BEGIN
  hashed := extensions.crypt('FlyChamAdmin!2026', extensions.gen_salt('bf'));

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = uid OR lower(email) = lower(user_email)) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uid,
      'authenticated',
      'authenticated',
      user_email,
      hashed,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      uid,
      uid::text,
      jsonb_build_object('sub', uid::text, 'email', user_email, 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::public.app_role
  FROM auth.users
  WHERE lower(email) = lower(user_email)
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
