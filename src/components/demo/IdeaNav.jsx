"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CaretDownIcon,
  CaretRightIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";
import { COMPONENT_NAV_ITEMS } from "@/components/ui/ComponentNav";
import { getDocsHref, IDEA_GROUPS } from "./ideaGroups";

const HOME = { href: "/", label: "Home" };

function getSectionLabel(id) {
  return COMPONENT_NAV_ITEMS.find((item) => item.id === id)?.label || id;
}

function useOutsideDismiss(open, onClose, rootRef) {
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, rootRef]);
}

function linkClass(isActive, isLight) {
  return `shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-1 text-white"
      : isLight
        ? "text-50 hover:bg-white/10"
        : "text-700 hover:bg-100"
  }`;
}

function isGroupActive(pathname, group) {
  const href = `/ideas/${group.slug}`;
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    group.sectionIds.some((id) => pathname === getDocsHref(id))
  );
}

/** Desktop flyout — hover / focus-within. */
function DesktopGroup({ group, pathname, isLight, openSlug, setOpenSlug }) {
  const href = `/ideas/${group.slug}`;
  const isActive = isGroupActive(pathname, group);
  const isOpen = openSlug === group.slug;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setOpenSlug(group.slug)}
      onMouseLeave={() => setOpenSlug(null)}
      onFocusCapture={() => setOpenSlug(group.slug)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpenSlug(null);
        }
      }}
    >
      <Link
        href={href}
        className={linkClass(isActive, isLight)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {group.label}
      </Link>

      {isOpen ? (
        <div
          role="menu"
          aria-label={group.label}
          className="absolute start-0 top-full z-[80] w-[min(92vw,16rem)] pt-1"
        >
          <div className="max-h-[min(70vh,24rem)] overflow-y-auto rounded-lg border border-200 bg-background py-1 shadow-lg">
            {group.sectionIds.map((id) => {
              const docsHref = getDocsHref(id);
              const itemActive = pathname === docsHref;

              return (
                <Link
                  key={id}
                  href={docsHref}
                  role="menuitem"
                  className={`block px-3 py-2 text-sm transition-colors ${
                    itemActive
                      ? "bg-primary-1/10 font-medium text-primary-1"
                      : "text-700 hover:bg-100 hover:text-primary-1"
                  }`}
                >
                  {getSectionLabel(id)}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Mobile sheet — Home + accordion groups (touch-friendly). */
function MobileMenu({ pathname, isLight }) {
  const rootRef = useRef(null);
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState(null);

  useOutsideDismiss(open, () => setOpen(false), rootRef);

  useEffect(() => {
    setOpen(false);
    setExpandedSlug(null);
  }, [pathname]);

  const anyActive =
    pathname === "/" ||
    IDEA_GROUPS.some((group) => isGroupActive(pathname, group));

  return (
    <div ref={rootRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close ideas menu" : "Open ideas menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${
          open || anyActive
            ? "bg-primary-1 text-white"
            : isLight
              ? "bg-white/15 text-50 hover:bg-white/25"
              : "bg-background text-700 hover:bg-100"
        }`}
      >
        {open ? (
          <XIcon size={18} weight="bold" aria-hidden />
        ) : (
          <SquaresFourIcon size={18} weight="bold" aria-hidden />
        )}
        <span>Ideas</span>
        <CaretDownIcon
          size={14}
          weight="bold"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Component ideas"
          className="absolute start-0 top-full z-[80] mt-2 max-h-[min(75vh,32rem)] w-[min(92vw,20rem)] overflow-y-auto rounded-lg border border-200 bg-background py-1 shadow-lg"
        >
          <Link
            href={HOME.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`block px-3 py-2.5 text-sm transition-colors ${
              pathname === "/"
                ? "bg-primary-1/10 font-medium text-primary-1"
                : "text-700 hover:bg-100 hover:text-primary-1"
            }`}
          >
            {HOME.label}
          </Link>

          <div className="my-1 border-t border-200" />

          {IDEA_GROUPS.map((group) => {
            const href = `/ideas/${group.slug}`;
            const isActive = isGroupActive(pathname, group);
            const isExpanded = expandedSlug === group.slug;

            return (
              <div key={group.slug} className="border-b border-100 last:border-b-0">
                <div className="flex items-stretch">
                  <Link
                    href={href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`min-w-0 flex-1 px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "font-medium text-primary-1"
                        : "text-700 hover:bg-100 hover:text-primary-1"
                    }`}
                  >
                    {group.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.label}`}
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedSlug((current) =>
                        current === group.slug ? null : group.slug
                      )
                    }
                    className="flex w-10 shrink-0 items-center justify-center text-500 hover:bg-100 hover:text-primary-1"
                  >
                    <CaretRightIcon
                      size={16}
                      weight="bold"
                      className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      aria-hidden
                    />
                  </button>
                </div>

                {isExpanded ? (
                  <div className="bg-50/80 pb-1">
                    {group.sectionIds.map((id) => {
                      const docsHref = getDocsHref(id);
                      const itemActive = pathname === docsHref;

                      return (
                        <Link
                          key={id}
                          href={docsHref}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className={`block py-2 pe-3 ps-5 text-sm transition-colors ${
                            itemActive
                              ? "bg-primary-1/10 font-medium text-primary-1"
                              : "text-600 hover:bg-100 hover:text-primary-1"
                          }`}
                        >
                          {getSectionLabel(id)}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function IdeaNav({ tone = "light" }) {
  const pathname = usePathname() || "/";
  const isLight = tone === "light";
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <nav
      aria-label="Component ideas"
      className="flex min-w-0 flex-1 items-center gap-1 overflow-visible"
    >
      {/* Touch / small screens */}
      <MobileMenu pathname={pathname} isLight={isLight} />

      {/* Large screens — horizontal links + hover flyouts (overflow must stay visible) */}
      <div className="hidden min-w-0 flex-1 flex-wrap items-center gap-1 overflow-visible lg:flex">
        <Link href={HOME.href} className={linkClass(pathname === "/", isLight)}>
          {HOME.label}
        </Link>

        {IDEA_GROUPS.map((group) => (
          <DesktopGroup
            key={group.slug}
            group={group}
            pathname={pathname}
            isLight={isLight}
            openSlug={openSlug}
            setOpenSlug={setOpenSlug}
          />
        ))}
      </div>
    </nav>
  );
}
