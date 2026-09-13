import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { buildLinkedTextParts } from "./core/build";
import { DEFAULT_BACKLINK_STYLE } from "./core/style";

/**
 * Renders plain text with optional phrase backlinks.
 * Pass either `links` (built here) or precomputed `parts`.
 */
export default function LinkedText({
  text,
  links,
  parts: partsProp,
  style = DEFAULT_BACKLINK_STYLE,
  enabled = true,
}) {
  const parts = Array.isArray(partsProp)
    ? partsProp
    : enabled && Array.isArray(links) && links.length
      ? buildLinkedTextParts(text, links)
      : [{ type: "text", value: text }];

  const linkColor = getThemeColorCss(style.linkColor, "primary-1");
  const linkHoverColor = getThemeColorCss(
    style.linkHoverColor || style.linkColor,
    "primary-2"
  );
  const linkWeight = getFontWeightValue(style.linkFontWeight, "semibold");
  const underline = style.linkUnderline || "always";

  return parts.map((part, index) => {
    if (part.type !== "link") {
      return <span key={`text-${index}`}>{part.value}</span>;
    }

    const isExternal = part.linkType === "external";
    const underlineClass =
      underline === "always"
        ? "underline underline-offset-2"
        : underline === "hover"
          ? "no-underline hover:underline hover:underline-offset-2"
          : "no-underline";

    const underlineStyle =
      underline === "always"
        ? { textDecorationLine: "underline", textUnderlineOffset: "2px" }
        : underline === "none"
          ? { textDecorationLine: "none" }
          : undefined;

    return (
      <a
        key={`link-${index}-${part.href}`}
        href={part.href}
        className={[
          "transition-colors",
          underlineClass,
          style.linkItalic ? "italic" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          color: linkColor,
          fontWeight: linkWeight,
          ...underlineStyle,
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.color = linkHoverColor;
          if (underline === "hover") {
            event.currentTarget.style.textDecorationLine = "underline";
            event.currentTarget.style.textUnderlineOffset = "2px";
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.color = linkColor;
          if (underline === "hover") {
            event.currentTarget.style.textDecorationLine = "none";
          }
        }}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {part.value}
      </a>
    );
  });
}
