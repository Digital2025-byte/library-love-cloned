import { CaretRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getJourneyIcon } from "../utils/constants";
import { DEFAULT_JOURNEY_SECTION_STYLE } from "../utils/style";

export default function JourneyStep({
  step,
  style = DEFAULT_JOURNEY_SECTION_STYLE,
}) {
  const Icon = getJourneyIcon(step.icon);
  const linkCss = getThemeColorCss(style.linkColor, "primary-1");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {style.showIcon ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: getThemeColorCss(style.iconBg, "100") }}
          >
            <Icon
              size={20}
              weight="regular"
              aria-hidden
              style={{ color: getThemeColorCss(style.iconColor, "700") }}
            />
          </div>
        ) : null}
        <span
          className={`${typography.itemTitle}`}
          style={{
            color: getThemeColorCss(style.stepTitleColor, "700"),
            fontWeight: getFontWeightValue(style.stepTitleFontWeight),
          }}
        >
          {step.title}
        </span>
      </div>
      <ul
        className={`m-0 flex list-none flex-col gap-2.5 md:gap-3 ${
          style.showIcon ? "ps-[52px]" : "ps-0"
        }`}
      >
        {step.links.map((link, index) => (
          <li key={`${link.text}-${index}`}>
            <a
              href={link.href || "#"}
              className={`${typography.itemDescription} inline-flex items-center gap-1 font-medium no-underline hover:underline`}
              style={{ color: linkCss }}
            >
              {link.text}
              <CaretRightIcon
                size={12}
                weight="bold"
                className="shrink-0 rtl:-scale-x-100"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
