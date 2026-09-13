"use client";

import Link from "next/link";
import { StackIcon } from "@phosphor-icons/react";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import PageContentContainer from "@/components/layout/PageContentContainer";
import ComponentNav, { COMPONENT_NAV_ITEMS } from "@/components/ui/ComponentNav";
import IdeaNav from "./IdeaNav";

export default function CmsDemoChrome({
  sectionIds,
  overlay = true,
  children,
}) {
  const navItems = sectionIds
    ? COMPONENT_NAV_ITEMS.filter((item) => sectionIds.includes(item.id))
    : COMPONENT_NAV_ITEMS;

  return (
    <main className="relative">
      <div
        className={`${
          overlay
            ? "absolute inset-x-0 top-0 w-full overflow-visible pt-4"
            : "sticky top-0 overflow-visible border-b border-200 bg-background/95 py-3 backdrop-blur"
        } z-50`}
      >
        <PageContentContainer className="relative z-[60] flex items-center justify-between gap-2 overflow-visible sm:gap-3">
          <IdeaNav tone={overlay ? "light" : "dark"} />
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <Link
              href="/pages"
              className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${
                overlay
                  ? "bg-white/15 text-50 hover:bg-white/25"
                  : "bg-background text-700 hover:bg-100"
              }`}
            >
              <StackIcon size={18} weight="bold" aria-hidden />
              <span className="hidden sm:inline">Pages</span>
            </Link>
            <ComponentNav items={navItems} />
            <LanguageSwitcher />
          </div>
        </PageContentContainer>
      </div>
      {children}
    </main>
  );
}
