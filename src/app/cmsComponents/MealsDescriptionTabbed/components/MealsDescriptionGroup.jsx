import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import MealsDescriptionItem from "./MealsDescriptionItem";
import { DEFAULT_MEALS_TABBED_STYLE } from "../utils/style";

export default function MealsDescriptionGroup({
  group,
  groupIndex = 0,
  links = [],
  style = DEFAULT_MEALS_TABBED_STYLE,
}) {
  if (!group) {
    return null;
  }

  const items = Array.isArray(group.items) ? group.items : [];
  const titleCss = getThemeColorCss(style.groupTitleColor, "primary-1");
  const itemBgCss = getThemeColorCss(style.itemBg, "white");

  return (
    <div>
      {group.title ? (
        <div className="px-4 pb-1 pt-4" style={{ backgroundColor: itemBgCss }}>
          <h3
            className={`${typography.itemTitle} font-semibold wrap-break-word`}
            style={{ color: titleCss }}
          >
            {group.title}
          </h3>
        </div>
      ) : null}

      {items.map((item, itemIndex) => (
        <MealsDescriptionItem
          key={`${group.title || groupIndex}-${item.title || "item"}-${itemIndex}`}
          item={item}
          striped={itemIndex % 2 === 1}
          titleColor={style.groupItemTitleColor}
          links={links}
          style={style}
        />
      ))}
    </div>
  );
}
