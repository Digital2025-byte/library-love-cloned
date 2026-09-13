import DualImageTextBlock from "./DualImageTextBlock";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { DEFAULT_EXTRA_IMAGE_POSITION } from "../utils/helpers";
import { DEFAULT_DUAL_IMAGE_TEXT_STYLE } from "../utils/style";

export default function DualImageTextContent({
  items = [],
  firstSection = null,
  showFirstSection = false,
  links = [],
  extraImageUrl = "",
  extraImageAlt = "",
  extraImagePositions = [],
  exploreButtonLabel = "Explore more",
  exploreButtonHref = "explore",
  cId,
  style = DEFAULT_DUAL_IMAGE_TEXT_STYLE,
}) {
  const first = items[0] || {};
  const second = items[1] || {};
  const firstPosition =
    extraImagePositions[0] ?? DEFAULT_EXTRA_IMAGE_POSITION;
  const secondPosition =
    extraImagePositions[1] ?? DEFAULT_EXTRA_IMAGE_POSITION;
  const showLinks = style.showLinks !== false;
  const linkItems = [
    ...(showFirstSection && firstSection ? [firstSection] : []),
    first,
    second,
  ];
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(linkItems, links)
    : null;
  let partsIndex = 0;
  const firstSectionParts =
    showFirstSection && firstSection
      ? itemLinkParts?.[partsIndex++]
      : null;
  const firstParts = itemLinkParts?.[partsIndex++];
  const secondParts = itemLinkParts?.[partsIndex++];

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-16 xl:gap-20">
      {showFirstSection && firstSection ? (
        <DualImageTextBlock
          item={firstSection}
          titleParts={firstSectionParts?.titleParts}
          bodyParts={firstSectionParts?.bodyParts}
          reverse
          priority
          extraImageUrl={extraImageUrl}
          extraImageAlt={extraImageAlt}
          extraImagePosition={firstPosition}
          exploreButtonLabel={exploreButtonLabel}
          exploreButtonHref={exploreButtonHref}
          cId={cId}
          style={{
            ...style,
            blueLayer: false,
            underlineFirstWord: false,
            showExploreButton: false,
            showExtraImage: false,
          }}
        />
      ) : null}

      <DualImageTextBlock
        item={first}
        titleParts={firstParts?.titleParts}
        bodyParts={firstParts?.bodyParts}
        reverse={false}
        priority={!showFirstSection}
        extraImageUrl={extraImageUrl}
        extraImageAlt={extraImageAlt}
        extraImagePosition={firstPosition}
        exploreButtonLabel={exploreButtonLabel}
        exploreButtonHref={exploreButtonHref}
        cId={cId}
        style={style}
      />
      <DualImageTextBlock
        item={second}
        titleParts={secondParts?.titleParts}
        bodyParts={secondParts?.bodyParts}
        reverse
        extraImageUrl={extraImageUrl}
        extraImageAlt={extraImageAlt}
        extraImagePosition={secondPosition}
        exploreButtonLabel={exploreButtonLabel}
        exploreButtonHref={exploreButtonHref}
        cId={cId}
        style={style}
      />
    </div>
  );
}
