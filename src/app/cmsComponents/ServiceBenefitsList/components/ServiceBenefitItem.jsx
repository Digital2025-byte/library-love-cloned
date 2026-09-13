import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { getIconByName } from "@/constants/Icons";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { DEFAULT_SERVICE_BENEFITS_STYLE } from "../utils/style";

export default function ServiceBenefitItem({
  title,
  description,
  titleParts,
  bodyParts,
  icon,
  style = DEFAULT_SERVICE_BENEFITS_STYLE,
}) {
  const Icon = getIconByName(icon) || getIconByName("Star");
  const showLinks = style.showLinks !== false;

  return (
    <div className="flex items-start gap-3 md:gap-3 lg:gap-4">
      {style.showIcons ? (
        <div
          className="mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:mt-3 md:h-11 md:w-11 lg:h-10 lg:w-10"
          style={{
            backgroundColor: getThemeColorCss(style.iconBg, "background"),
            color: getThemeColorCss(style.iconColor, "primary-1"),
          }}
        >
          {Icon ? <Icon className="h-5 w-5" weight="fill" size={20} /> : null}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        {title ? (
          <h3
            className={`${typography.itemTitle} font-semibold md:text-base lg:text-lg`}
            style={{ color: getThemeColorCss(style.itemTitleColor, "white"), fontWeight: getFontWeightValue(style.itemTitleFontWeight),
            }}
          >
            <LinkedText
              text={title}
              parts={titleParts}
              style={style}
              enabled={showLinks}
            />
          </h3>
        ) : null}
        {style.showDescription && description ? (
          <p
            className="mt-1 text-sm leading-relaxed md:text-sm md:leading-5 lg:text-base lg:leading-relaxed"
            style={{ color: getThemeColorCss(style.descriptionColor, "white"), fontWeight: getFontWeightValue(style.descriptionFontWeight),
              opacity: 0.9,
            }}
          >
            <LinkedText
              text={description}
              parts={bodyParts}
              style={style}
              enabled={showLinks}
            />
          </p>
        ) : null}
      </div>
    </div>
  );
}
