import Link from "next/link";
import { getIconByName } from "@/constants/Icons";
import { typography } from "@/styles/typography";
import { withCampaignPath } from "@/utils/withCampaignPath";

const VARIANT_CLASSES = {
  primary:
    "border-1 border-primary-2 bg-primary-2 text-white hover:opacity-90",
  secondary:
    "border-1 border-white bg-transparent text-white hover:bg-white/10",
  outline:
    "border-1 border-primary-2 bg-transparent text-primary-2 hover:bg-primary-2/10",
};

/**
 * Shared CMS CTA button — solid primary-2 by default, optional icon.
 *
 * @param {Object} props
 * @param {string} [props.label] - Button label (or pass children)
 * @param {string} [props.href] - When set, renders as a link
 * @param {string|import("react").ReactNode} [props.icon] - Icon name from Icons map, or a React node
 * @param {"start"|"end"} [props.iconPosition="end"]
 * @param {"primary"|"secondary"|"outline"} [props.variant="primary"]
 * @param {string|number} [props.cId] - Campaign id for withCampaignPath
 * @param {boolean} [props.external] - Open link in a new tab
 * @param {boolean} [props.fullWidth]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {import("react").ButtonHTMLAttributes<HTMLButtonElement>["type"]} [props.type="button"]
 * @param {import("react").MouseEventHandler} [props.onClick]
 */
export default function Button({
  label,
  href,
  icon,
  iconPosition = "end",
  variant = "primary",
  cId,
  external = false,
  fullWidth = false,
  className = "",
  children,
  type = "button",
  onClick,
  ...rest
}) {
  const text = children ?? label;
  if (!text) {
    return null;
  }

  const IconComponent =
    typeof icon === "string" ? getIconByName(icon) : null;
  const iconNode =
    typeof icon === "string"
      ? IconComponent
        ? <IconComponent size={20} weight="regular" aria-hidden />
        : null
      : icon || null;

  const classes = [
    typography.button,
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-opacity sm:px-8",
    fullWidth ? "w-full" : "",
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {iconNode && iconPosition === "start" ? iconNode : null}
      <span>{text}</span>
      {iconNode && iconPosition === "end" ? iconNode : null}
    </>
  );

  if (href) {
    const resolvedHref = withCampaignPath(href, cId);
    const isExternal =
      external ||
      /^https?:\/\//i.test(String(href)) ||
      String(href).startsWith("mailto:") ||
      String(href).startsWith("tel:");

    return (
      <Link
        href={resolvedHref || "#"}
        className={classes}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onClick={onClick}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
