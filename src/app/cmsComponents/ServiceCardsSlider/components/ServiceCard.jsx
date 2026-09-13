import Image from "next/image";
import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { isUsableImageSrc } from "../utils/helpers";
import { CARD_PADDING_CLASS, CARD_RADIUS_CLASS } from "../utils/style";

export default function ServiceCard({
  service,
  titleParts,
  bodyParts,
  isRtl = false,
  style,
}) {
  if (!service) {
    return null;
  }

  const { title, description, imageUrl, imageAlt, href } = service;
  const ArrowIcon = isRtl ? CaretLeftIcon : CaretRightIcon;
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const paddingClass =
    CARD_PADDING_CLASS[style.cardPadding] ?? CARD_PADDING_CLASS.default;
  const canShowImage = style.showIcon && isUsableImageSrc(imageUrl);
  const showLinks = style.showLinks !== false;

  const card = (
    <article
      className={`group flex h-full items-center gap-3 shadow-sm transition sm:gap-4 ${radiusClass} ${paddingClass}`}
      style={{ backgroundColor: getThemeColorCss(style.cardBg, "white") }}
    >
      {style.showIcon ? (
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
          <span
            className="absolute inset-[6%] rounded-[42%_58%_48%_52%/48%_42%_58%_52%]"
            style={{
              backgroundColor: style.iconBg
                ? getThemeColorCss(style.iconBg)
                : "#EEF4F7",
            }}
            aria-hidden
          />
          {canShowImage ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title || ""}
              fill
              className="relative z-10 object-contain object-center"
              sizes="80px"
            />
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        {style.showItemTitle && title ? (
          <h3
            className={`${typography.itemTitle} font-semibold`}
            style={{ color: getThemeColorCss(style.itemTitleColor, "secondary-2"), fontWeight: getFontWeightValue(style.itemTitleFontWeight) }}
          >
            <LinkedText
              text={title}
              parts={titleParts}
              style={style}
              enabled={showLinks}
            />
          </h3>
        ) : null}

        {style.showItemDescription && description ? (
          <p
            className={`${typography.caption} mt-1 line-clamp-3 leading-relaxed`}
            style={{ color: getThemeColorCss(style.itemBodyColor, "icon") }}
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

      {style.showArrow ? (
        <ArrowIcon
          size={18}
          weight="bold"
          className="shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          style={{ color: getThemeColorCss(style.arrowColor, "icon") }}
          aria-hidden
        />
      ) : null}
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary-1/40 ${radiusClass}`}
      >
        {card}
      </Link>
    );
  }

  return card;
}
