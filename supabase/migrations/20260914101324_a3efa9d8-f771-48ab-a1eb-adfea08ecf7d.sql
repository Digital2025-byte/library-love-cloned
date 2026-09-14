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