import { Fragment } from "react";
import AnimatedCTAButton from "@/components/ui/AnimatedCTAButton";
import { withCampaignPath } from "@/utils/withCampaignPath";
import { getThemeColorCss } from "@/styles/themeColors";
import SubSectionBlock from "./SubSectionBlock";
import SubSectionsHeader from "./SubSectionsHeader";
import { DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE } from "../utils/style";

export default function SubSectionsContent({
  lang = "en",
  sectionLabel,
  title,
  description,
  links = [],
  subSections = [],
  itemLinkParts = null,
  ctaButton,
  ctaHref,
  cId,
  style = DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE,
}) {
  const buttonBg = getThemeColorCss(style.buttonBg, "primary-1");
  const buttonText = getThemeColorCss(style.buttonText, "white");
  const dividerColor = getThemeColorCss(style.dividerColor, "600");
  const visibleSections = (Array.isArray(subSections) ? subSections : []).filter(
    (item) => item?.title || item?.description
  );

  return (
    <div className="flex w-full flex-col justify-center gap-6 lg:w-[48%] lg:gap-8 ">
      <SubSectionsHeader
        sectionLabel={sectionLabel}
        title={title}
        description={description}
        links={links}
        style={style}
      />

      {style.showSubSections && visibleSections.length ? (
        <div className="flex flex-row flex-wrap gap-6 pt-2 lg:gap-8">
          {visibleSections.map((item, index) => (
            <Fragment key={`sub-${index}`}>
              {index > 0 ? (
                <div
                  className="w-px shrink-0 self-stretch"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${dividerColor} 40%, transparent)`,
                  }}
                />
              ) : null}
              <SubSectionBlock
                title={item.title}
                description={item.description}
                titleParts={itemLinkParts?.[index]?.titleParts}
                bodyParts={itemLinkParts?.[index]?.bodyParts}
                style={style}
              />
            </Fragment>
          ))}
        </div>
      ) : null}

      {style.showCta && ctaButton ? (
        <div className="min-h-12 w-fit overflow-visible">
          <AnimatedCTAButton
            lang={lang}
            label={ctaButton}
            href={withCampaignPath(ctaHref || "#", cId)}
            arrowColor={buttonText}
            textColor={buttonBg}
            bgColor={buttonBg}
            bgFillColor={buttonBg}
            textFillColor={buttonText}
            arrowFillColor={buttonText}
            mobileTextColor={buttonText}
            mobileArrowColor={buttonText}
            mobileBgColor={buttonBg}
          />
        </div>
      ) : null}
    </div>
  );
}
