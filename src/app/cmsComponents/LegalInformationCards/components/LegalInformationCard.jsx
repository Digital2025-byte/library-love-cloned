import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";
import { typography } from "@/styles/typography";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import { withCampaignPath } from "@/utils/withCampaignPath";
import { getLegalHref, getLegalIcon } from "../utils/helpers";
import {
  CARD_RADIUS_CLASS,
  DEFAULT_LEGAL_INFORMATION_CARDS_STYLE,
} from "../utils/style";

export default function LegalInformationCard({
  card,
  bodyParts,
  lang = "en",
  posParams = "gb",
  cId,
  style = DEFAULT_LEGAL_INFORMATION_CARDS_STYLE,
}) {
  const Icon = getLegalIcon(card.icon);
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeftIcon : ArrowRightIcon;
  const href = withCampaignPath(
    getLegalHref(posParams, lang, card.slug),
    cId
  );
  const radiusClass =
    CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg;
  const showLinks = style.showLinks !== false;

  return (
    <article
      className={`flex h-full flex-col p-6 md:p-8 ${radiusClass}`}
      style={{
        backgroundColor: style.showCardBg
          ? getThemeColorCss(style.cardBg, "primary-1")
          : "transparent",
      }}
    >
      {style.showIcon ? (
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
          style={{ backgroundColor: getThemeColorCss(style.iconBg, "50") }}
        >
          <Icon
            size={36}
            weight="regular"
            aria-hidden
            style={{ color: getThemeColorCss(style.iconColor, "primary-1") }}
          />
        </div>
      ) : null}

      {style.showTitle ? (
        <h3
          className={`${typography.itemTitle} mb-3 font-semibold`}
          style={{ color: getThemeColorCss(style.titleColor, "primary-2"), fontWeight: getFontWeightValue(style.titleFontWeight) }}
        >
          {card.title}
        </h3>
      ) : null}

      {style.showDescription ? (
        <p
          className={`${typography.itemDescription} mb-6 flex-1`}
          style={{ color: getThemeColorCss(style.descriptionColor, "50"), fontWeight: getFontWeightValue(style.descriptionFontWeight) }}
        >
          <LinkedText
            text={card.description}
            parts={bodyParts}
            style={style}
            enabled={showLinks}
          />
        </p>
      ) : null}

      {style.showCta ? (
        <Link
          href={href || "#"}
          className={`${typography.button} group mt-auto inline-flex items-center gap-2 transition-all hover:gap-3`}
          style={{ color: getThemeColorCss(style.ctaColor, "50") }}
        >
          <span>{card.ctaLabel}</span>
          <ArrowIcon
            size={20}
            className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </Link>
      ) : null}
    </article>
  );
}
