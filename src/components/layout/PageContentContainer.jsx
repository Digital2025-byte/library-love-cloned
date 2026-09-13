import { pageContentShell } from "@/styles/layout";

/**
 * Shared content container for non-full-bleed sections.
 * Unifies max-width + horizontal padding across all screens.
 */
export default function PageContentContainer({
  as: Tag = "div",
  lang,
  dir,
  className = "",
  children,
  ...rest
}) {
  const classes = [pageContentShell, className].filter(Boolean).join(" ");

  return (
    <Tag
      className={classes}
      {...(lang ? { lang } : {})}
      {...(dir ? { dir } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}
