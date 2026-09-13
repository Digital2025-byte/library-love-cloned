import Image from "next/image";
import Button from "@/components/ui/Button";
import { getThemeColorCss } from "@/styles/themeColors";
import { getFontWeightValue } from "@/styles/fontWeight";
import SubSectionBlock from "./SubSectionBlock";
import SubSectionsHeader from "./SubSectionsHeader";
import { isUsableImageSrc } from "../utils/helpers";
import {
  DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
  OVERLAY_RADIUS_CLASS,
} from "../utils/style";

export default function SubSectionsMobile({
  lang = "en",
  sectionLabel,
  title,
  description,
  links = [],
  mainImage,
  mainImageAlt,
  overlayImage,
  overlayImageAlt,
  subSections = [],
  itemLinkParts = null,
  ctaButton,
  ctaHref,
  ctaIcon,
  cId,
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
}) {
  const canShowMain = style.showImages && isUsableImageSrc(mainImage);
  const canShowOverlay = style.showImages && isUsableImageSrc(overlayImage);
  const overlayRadius =
    OVERLAY_RADIUS_CLASS[style.imageRadius] ?? OVERLAY_RADIUS_CLASS.lg;
  const buttonBg = getThemeColorCss(style.buttonBg, "primary-1");
  const buttonText = getThemeColorCss(style.buttonText, "white");
  const visibleSections = (Array.isArray(subSections) ? subSections : []).filter(
    (item) => item?.title || item?.description
  );

  return (
    <div className="flex flex-col gap-8 lg:hidden">
      <SubSectionsHeader
        sectionLabel={sectionLabel}
        title={title}
        description={description}
        links={links}
        style={style}
      />

      {canShowMain || canShowOverlay ? (
        <div className="grid grid-cols-2 items-start gap-4 sm:gap-5">
          {canShowMain ? (
            <div
              className={`relative aspect-3/4 w-full overflow-hidden ${overlayRadius}`}
            >
              <Image
                src={mainImage}
                alt={mainImageAlt}
                fill
                priority
                quality={75}
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          ) : (
            <div />
          )}
          {canShowOverlay ? (
            <div
              className={`relative aspect-4/3 w-full overflow-hidden ${overlayRadius}`}
            >
              <Image
                src={overlayImage}
                alt={overlayImageAlt}
                fill
                quality={75}
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {style.showSubSections && visibleSections.length ? (
        <div className="grid grid-cols-2 items-start gap-4 sm:gap-5">
          {visibleSections.map((item, index) => (
            <SubSectionBlock
              key={`sub-mobile-${index}`}
              title={item.title}
              description={item.description}
              titleParts={itemLinkParts?.[index]?.titleParts}
              bodyParts={itemLinkParts?.[index]?.bodyParts}
              style={style}
            />
          ))}
        </div>
      ) : null}

      {style.showCta && ctaButton ? (
        <div className="w-full pt-2">
          <Button
            label={ctaButton}
            href={ctaHref || "#"}
            icon={ctaIcon}
            cId={cId}
            fullWidth
            style={{
              backgroundColor: buttonBg,
              borderColor: buttonBg,
              color: buttonText,
              fontWeight: getFontWeightValue(style.buttonTextFontWeight),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
