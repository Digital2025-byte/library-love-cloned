import AccordionImagesToggle from "./AccordionImagesToggle";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { ITEM_PADDING_CLASS, ITEM_RADIUS_CLASS } from "../utils/style";

export default function AccordionImagesItem({
  item,
  titleParts,
  bodyParts,
  isOpen,
  onToggle,
  itemRef,
  look = "filled",
  background = "background",
  radius = "none",
  padding = "tight",
  showDivider = true,
  titleColor = "800",
  openColor = "primary-1",
  bodyColor = "700",
  titleFontWeight = "semibold",
  bodyFontWeight = "normal",
  toggleBg = "primary-1",
  toggleBorder = "secondary-1",
  toggleIcon = "white",
  linkStyle,
  showLinks = true,
}) {
  const radiusClass = ITEM_RADIUS_CLASS[radius] ?? ITEM_RADIUS_CLASS.none;
  const paddingClass = ITEM_PADDING_CLASS[padding] ?? ITEM_PADDING_CLASS.tight;
  const lookClass =
    look === "outline"
      ? "border border-200 bg-transparent"
      : showDivider
        ? "border-b border-200"
        : "";
  const titleCss = getThemeColorCss(isOpen ? openColor : titleColor, "800");
  const bodyCss = getThemeColorCss(bodyColor, "700");

  return (
    <div
      ref={itemRef}
      className={`w-full cursor-pointer overflow-hidden transition-all duration-700 ease-in-out [&_*]:cursor-pointer ${lookClass} ${radiusClass}`}
      style={
        look === "filled"
          ? { backgroundColor: getThemeColorCss(background, "background") }
          : undefined
      }
      onClick={onToggle}
    >
      <div
        className={`flex items-start gap-3 sm:gap-4 ${paddingClass} ${
          isOpen ? "opacity-100" : "opacity-50"
        }`}
      >
        <div className="min-w-0 flex-1">
          <h3
            className={`${typography.itemTitle} mb-2 font-medium leading-snug`}
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

          <div
            className={`grid transition-all duration-700 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p
                className={`${typography.itemDescription} pt-2 leading-relaxed`}
                style={{
                  color: bodyCss,
                  fontWeight: getFontWeightValue(bodyFontWeight),
                }}
              >
                <LinkedText
                  text={item.content}
                  parts={bodyParts}
                  style={linkStyle}
                  enabled={showLinks}
                />
              </p>
            </div>
          </div>
        </div>

        <AccordionImagesToggle
          isOpen={isOpen}
          onToggle={onToggle}
          background={toggleBg}
          border={toggleBorder}
          icon={toggleIcon}
        />
      </div>
    </div>
  );
}
