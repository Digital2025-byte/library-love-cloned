"use client";

import SubSectionsContent from "./components/SubSectionsContent";
import SubSectionsMedia from "./components/SubSectionsMedia";
import SubSectionsMobile from "./components/SubSectionsMobile";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getTwoColumnWithSubSectionsContent } from "./utils/helpers";
import { resolveTwoColumnWithSubSectionsStyle } from "./utils/style";

export default function TwoColumnWithSubSections({ lang = "en", data, style }) {
  const resolvedStyle = resolveTwoColumnWithSubSectionsStyle(style);
  const content = getTwoColumnWithSubSectionsContent(data, lang);

  if (!content.hasContent) {
    return null;
  }

  const showLinks = resolvedStyle.showLinks !== false;
  const subSections = (content.subSections || []).filter(
    (item) => item?.title || item?.description
  );
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(subSections, content.links)
    : null;

  const shared = {
    lang,
    sectionLabel: content.sectionLabel,
    title: content.title,
    description: content.description,
    links: content.links,
    subSections,
    itemLinkParts,
    ctaButton: content.ctaButton,
    ctaHref: content.ctaHref,
    style: resolvedStyle,
  };

  return (
    <>
      <section className="hidden overflow-visible lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        {resolvedStyle.showImages ? (
          <SubSectionsMedia
            mainImage={content.mainImage}
            mainImageAlt={content.mainImageAlt}
            overlayImage={content.overlayImage}
            overlayImageAlt={content.overlayImageAlt}
            style={resolvedStyle}
          />
        ) : null}
        <SubSectionsContent {...shared} />
      </section>

      <SubSectionsMobile
        {...shared}
        mainImage={content.mainImage}
        mainImageAlt={content.mainImageAlt}
        overlayImage={content.overlayImage}
        overlayImageAlt={content.overlayImageAlt}
      />
    </>
  );
}
