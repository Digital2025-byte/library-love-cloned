import { CheckCircleIcon } from "@phosphor-icons/react";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { typography } from "@/styles/typography";
import { DEFAULT_BANNER_WITH_CTAS_STYLE, TITLE_ITEMS_CLASS } from "../utils/style";

export default function BannerWithCTAsAndItemsList({
  items = [],
  itemLinkParts = null,
  style = DEFAULT_BANNER_WITH_CTAS_STYLE,
  align = "left",
}) {
  if (!items.length) {
    return null;
  }

  const itemCss = getThemeColorCss(style.itemColor, "secondary-200");
  const itemsClass = TITLE_ITEMS_CLASS[align] ?? TITLE_ITEMS_CLASS.left;
  const showLinks = style.showLinks !== false;

  return (
    <ul
      className={`mt-5 flex list-none flex-col gap-3 p-0 sm:mt-6 sm:gap-3.5 ${itemsClass}`}
    >
      {items.map((item, index) => {
        const text = typeof item === "string" ? item : item?.text || "";
        return (
          <li
            key={`${text}-${index}`}
            className={`${typography.itemDescription} flex items-center gap-2.5 font-medium`}
            style={{ color: itemCss, fontWeight: getFontWeightValue(style.itemFontWeight) }}
          >
            <CheckCircleIcon
              size={24}
              weight="regular"
              className="shrink-0"
              style={{ color: itemCss, fontWeight: getFontWeightValue(style.itemFontWeight) }}
              aria-hidden
            />
            <span>
              <LinkedText
                text={text}
                parts={itemLinkParts?.[index]?.bodyParts}
                style={style}
                enabled={showLinks}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
