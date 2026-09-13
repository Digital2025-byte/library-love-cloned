"use client";

import Link from "next/link";
import { ArrowRightIcon, FileIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import PageContentContainer from "@/components/layout/PageContentContainer";
import { PAGES } from "../pagesConfig";

/** Index of buildable pages. */
export default function PagesList() {
  return (
    <PageContentContainer className="py-10">
      <header className="mb-6">
        <h1 className={`${typography.pageTitle} font-semibold text-main`}>
          Pages
        </h1>
        <p className={`${typography.body} mt-1 text-700`}>
          Open a page to view its components, add new ones, or edit them.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/pages/${page.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-200 bg-background p-5 transition-colors hover:border-primary-1 hover:bg-primary-1/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-1/10 text-primary-1">
                <FileIcon size={22} weight="regular" aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className={`${typography.itemTitle} font-semibold text-main`}>
                  {page.label}
                </span>
                {page.description ? (
                  <span className={`${typography.caption} text-600`}>
                    {page.description}
                  </span>
                ) : null}
              </span>
              <span
                className={`${typography.caption} mt-auto inline-flex items-center gap-1 font-medium text-primary-1`}
              >
                {page.blocks.length} components
                <ArrowRightIcon
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContentContainer>
  );
}
