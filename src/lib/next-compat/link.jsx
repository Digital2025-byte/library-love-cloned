import { Link as RouterLink } from "react-router-dom";

function resolveHref(href) {
  if (!href) {
    return "/";
  }

  if (typeof href === "string") {
    return href;
  }

  const pathname = href.pathname || "/";
  const search = href.query
    ? `?${new URLSearchParams(href.query).toString()}`
    : "";
  const hash = href.hash || "";
  return `${pathname}${search}${hash}`;
}

function isExternalHref(href) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export default function Link({
  href,
  children,
  replace,
  prefetch: _prefetch,
  scroll: _scroll,
  locale: _locale,
  ...rest
}) {
  const to = resolveHref(href);

  if (isExternalHref(to) || to.startsWith("#")) {
    return (
      <a href={to || "#"} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}
