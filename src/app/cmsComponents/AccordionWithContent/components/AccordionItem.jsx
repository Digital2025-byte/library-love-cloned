import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { ITEM_PADDING_CLASS, ITEM_RADIUS_CLASS } from "../utils/style";

export default function AccordionItem({
  item,
  titleParts,
  bodyParts,
  isOpen,
  onToggle,
  look = "filled",
  showBackground = true,
  background = "white",
  radius = "lg",
  padding = "default",
  titleColor = "800",
  openColor = "primary-1",
  bodyColor = "700",
  titleFontWeight = "semibold",
  bodyFontWeight = "normal",
  linkStyle,
  showLinks = true,
}) {
  const radiusClass = ITEM_RADIUS_CLASS[radius] ?? ITEM_RADIUS_CLASS.lg;
  const paddingClass = ITEM_PADDING_CLASS[padding] ?? ITEM_PADDING_CLASS.default;
  const lookClass = look === "outline" ? "border border-200 bg-transparent" : "";
  const titleCss = getThemeColorCss(isOpen ? openColor : titleColor, "800");
  const iconCss = isOpen ? titleCss : getThemeColorCss("500", "500");
  const bodyCss = getThemeColorCss(bodyColor, "700");

  return (
    <div
      className={`cursor-pointer **:cursor-pointer ${lookClass} ${radiusClass} ${paddingClass}`}
      style={
        look === "filled" && showBackground
          ? { backgroundColor: getThemeColorCss(background, "white") }
          : undefined
      }
      onClick={onToggle}
    >
      <button
        type="button"
        className="flex min-h-11 w-full cursor-pointer items-start justify-between gap-3 text-start sm:min-h-0 sm:items-center sm:gap-4"
      >
        <h3
          className={`${typography.itemTitle} font-medium leading-snug`}
          style={{
            color: titleCss,
            fontWeight: getFontWeightValue(titleFontWeight),
          }}
        >
          {showLinks ? (
            <LinkedText
              text={item.title}
              parts={titleParts}
              style={linkStyle}
              enabled={showLinks}
            />
          ) : (
            item.title
          )}
        </h3>
        {isOpen ? (
          <CaretUpIcon
            className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-5 sm:w-5"
            style={{ color: iconCss }}
            weight="bold"
          />
        ) : (
          <CaretDownIcon
            className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-5 sm:w-5"
            style={{ color: iconCss }}
            weight="bold"
          />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "mt-2 max-h-125 opacity-100 sm:mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p
          className={`${typography.itemDescription} pr-6 leading-relaxed whitespace-pre-line sm:pr-8`}
          style={{
            color: bodyCss,
            fontWeight: getFontWeightValue(bodyFontWeight),
          }}
        >
          <LinkedText
            text={item.description}
            parts={bodyParts}
            style={linkStyle}
            enabled={showLinks}
          />
        </p>
      </div>
    </div>
  );
}
