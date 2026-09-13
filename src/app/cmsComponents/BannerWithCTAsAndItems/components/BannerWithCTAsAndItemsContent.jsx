import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import {
  buildItemBacklinkParts,
  LinkedText,
} from "@/app/cmsComponents/shared/backlinks";
import {
  DEFAULT_BANNER_WITH_CTAS_STYLE,
  TITLE_ALIGN_CLASS,
  TITLE_ITEMS_CLASS,
} from "../utils/style";
import BannerWithCTAsAndItemsButtons from "./BannerWithCTAsAndItemsButtons";
import BannerWithCTAsAndItemsList from "./BannerWithCTAsAndItemsList";

export default function BannerWithCTAsAndItemsContent({
  content,
  style = DEFAULT_BANNER_WITH_CTAS_STYLE,
  cId,
}) {
  const title = content.title;
  const description = content.description;
  const links = content.links || [];
  const showHeading = style.showTitle && title;
  const showCopy = style.showDescription && description;
  const showItems = style.showItems && Array.isArray(content.items) && content.items.length > 0;
  const showButtons =
    (style.showPrimaryButton && content.primaryLabel) ||
    (style.showSecondaryButton && content.secondaryLabel);
  const showLinks = style.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(content.items || [], links, { bodyKey: "text" })
    : null;

  if (!showHeading && !showCopy && !showItems && !showButtons) {
    return null;
  }

  const alignKey =
    style.titleAlign in TITLE_ALIGN_CLASS ? style.titleAlign : "left";
  const alignClass = TITLE_ALIGN_CLASS[alignKey];
  const itemsClass = TITLE_ITEMS_CLASS[alignKey];

  return (
    <div
      className={`flex w-full max-w-xl flex-col py-10 sm:py-12 lg:py-14 ${alignClass} ${itemsClass}`}
    >
      {showHeading ? (
        <h1
          className={`${typography.sectionTitle} font-semibold leading-tight`}
          style={{ color: getThemeColorCss(style.titleColor, "white"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {title}
        </h1>
      ) : null}

      {showCopy ? (
        <p
          className={`${typography.sectionDescription} mt-3 leading-relaxed sm:mt-4`}
          style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
        >
          <LinkedText
            text={description}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}

      {showItems ? (
        <BannerWithCTAsAndItemsList
          items={content.items}
          itemLinkParts={itemLinkParts}
          style={style}
          align={alignKey}
        />
      ) : null}

      <BannerWithCTAsAndItemsButtons
        primaryLabel={style.showPrimaryButton ? content.primaryLabel : ""}
        primaryHref={content.primaryHref}
        secondaryLabel={style.showSecondaryButton ? content.secondaryLabel : ""}
        secondaryHref={content.secondaryHref}
        style={style}
        align={alignKey}
        cId={cId}
      />
    </div>
  );
}
