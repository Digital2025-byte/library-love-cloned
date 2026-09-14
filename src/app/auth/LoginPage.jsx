"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import CmsDemoChrome from "@/components/demo/CmsDemoChrome";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { typography } from "@/styles/typography";
import { supabase } from "@/integrations/supabase/client";
import { loginSchema } from "@/auth/loginSchema";

const fieldClass =
  "mt-1 w-full rounded-lg border border-200 bg-background px-3 py-2 text-sm text-main outline-none transition-colors focus:border-primary-1";

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        helpers.setStatus(error.message);
        helpers.setSubmitting(false);
        return;
      }

      const { error: roleError } = await supabase.rpc("ensure_first_admin");
      if (roleError) {
        console.warn("[auth] ensure_first_admin:", roleError.message);
      }

      helpers.setSubmitting(false);
      router.push("/pages");
    },
  });

  return (
    <CmsDemoChrome overlay={false} sectionIds={[]}>
      <PageContentContainer className="py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-200 bg-background p-6 shadow-sm">
          <h1 className={`${typography.pageTitle} font-semibold text-main`}>
            Sign in
          </h1>
          <p className={`${typography.body} mt-2 text-700`}>
            Use your CMS account to add and edit page components.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <label className="block">
              <span className={`${typography.caption} font-medium text-700`}>
                Email
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={fieldClass}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <span className={`${typography.caption} mt-1 block text-red-600`}>
                  {formik.errors.email}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className={`${typography.caption} font-medium text-700`}>
                Password
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <span className={`${typography.caption} mt-1 block text-red-600`}>
                  {formik.errors.password}
                </span>
              ) : null}
            </label>

            {formik.status ? (
              <p role="alert" className={`${typography.caption} text-red-600`}>
                {formik.status}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`${typography.button} inline-flex items-center justify-center rounded-lg bg-primary-1 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-primary-2 disabled:opacity-60`}
            >
              {formik.isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </PageContentContainer>
    </CmsDemoChrome>
  );
}
