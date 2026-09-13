import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";

export default function ReadAboutUsButton({
  lang = "en",
  label = "",
  href = "#",
  bgColor = "var(--color-primary-1)",
  textColor = "var(--color-background)",
  arrowColor = "var(--color-primary-1)",
  circleColor = "var(--color-background)",
}) {
  if (!label) {
    return null;
  }

  const ArrowIcon = lang === "ar" ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <Link
      href={href || "#"}
      className="flex w-full items-center justify-center gap-3 rounded-[10px] px-6 py-4 text-inherit no-underline"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: circleColor }}
      >
        <ArrowIcon className="h-3 w-3" style={{ color: arrowColor }} />
      </span>
      <span className={`${typography.button} whitespace-nowrap font-semibold`}>
        {label}
      </span>
    </Link>
  );
}
