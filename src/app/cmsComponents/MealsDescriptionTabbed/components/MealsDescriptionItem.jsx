import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionItem({
  item,
  striped = false,
  titleColor = DEFAULT_MEALS_TABBED_STYLE.itemTitleColor,
  links = [],
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  const showTitle = style.showItemTitle !== false && Boolean(item?.title);
  const showDescription =
    style.showItemDescription !== false && Boolean(item?.description);
  const showLinks = style.showLinks !== false;

  if (!showTitle && !showDescription) {
    return null;
  }

  const stripeCss = getThemeColorCss(style.stripeColor, "primary-2");
  const itemBgCss = getThemeColorCss(style.itemBg, "white");
  const titleCss = getThemeColorCss(titleColor, "primary-1");
  const bodyCss = getThemeColorCss(style.itemBodyColor, "600");

  return (
    <div
      className="px-4 py-4"
      style={{
        backgroundColor: striped
          ? `color-mix(in srgb, ${stripeCss} 10%, transparent)`
          : itemBgCss,
      }}
    >
      {showTitle ? (
        <h4
          className={`${typography.itemDescription} font-medium wrap-break-word`}
          style={{ color: titleCss }}
        >
          {item.title}
        </h4>
      ) : null}
      {showDescription ? (
        <p
          className={`${typography.body} mt-1 leading-relaxed wrap-break-word`}
          style={{ color: bodyCss }}
        >
          <LinkedText
            text={item.description}
            links={links}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}
    </div>
  );
}
