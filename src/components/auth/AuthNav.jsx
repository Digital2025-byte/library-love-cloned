"use client";

import Link from "next/link";
import { SignInIcon, SignOutIcon } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import useAuthSession from "@/auth/useAuthSession";

export default function AuthNav({ overlay = false }) {
  const { user, ready } = useAuthSession();

  const tone = overlay
    ? "bg-white/15 text-50 hover:bg-white/25"
    : "bg-background text-700 hover:bg-100";

  if (!ready) {
    return null;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${tone}`}
      >
        <SignInIcon size={18} weight="bold" aria-hidden />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
      className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${tone}`}
    >
      <SignOutIcon size={18} weight="bold" aria-hidden />
      <span className="hidden max-w-[10rem] truncate sm:inline">
        {user.email || "Sign out"}
      </span>
    </button>
  );
}
