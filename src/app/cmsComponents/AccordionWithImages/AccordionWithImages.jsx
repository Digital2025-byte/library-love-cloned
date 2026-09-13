"use client";

import AccordionImagesHeader from "./components/AccordionImagesHeader";
import AccordionImagesItem from "./components/AccordionImagesItem";
import AccordionImagesPanel from "./components/AccordionImagesPanel";
import { useAccordionImages } from "./hooks/useAccordionImages";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getAccordionImagesContent } from "./utils/helpers";
import {
  ITEM_GAP_CLASS,
  resolveAccordionImagesStyle,
} from "./utils/style";

export default function AccordionWithImages({ data, style }) {
  const resolved = resolveAccordionImagesStyle(style);
  const { title, description, links, items } = getAccordionImagesContent(data);
  const { openIndex, panelIndex, containerRef, setItemRef, toggleAccordion } =
    useAccordionImages(items);
  const gapClass = ITEM_GAP_CLASS[resolved.itemGap] ?? ITEM_GAP_CLASS.tight;
  const showLinks = resolved.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(items, links)
    : items.map((item) => ({
        titleParts: [{ type: "text", value: item.title || "" }],
        bodyParts: [{ type: "text", value: item.content || "" }],
      }));

  return (
    <>
      {resolved.showTitleDescription || resolved.showDescription ? (
        <AccordionImagesHeader
          title={resolved.showTitleDescription ? title : ""}
          description={description}
          links={links}
          linkStyle={resolved}
          showLinks={showLinks}
          align={resolved.titleAlign}
          titleColor={resolved.titleColor}
          descriptionColor={resolved.descriptionColor}
          titleFontWeight={resolved.titleFontWeight}
          descriptionFontWeight={resolved.descriptionFontWeight}
          showDescription={resolved.showDescription}
          showTitleBorder={resolved.showTitleBorder}
        />
      ) : null}

      <section
        className={`flex flex-col gap-6 py-2 sm:gap-8 lg:flex-row lg:gap-12 lg:py-4 ${
          resolved.imagePosition === "left" ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="flex w-full flex-col lg:w-1/2">
          <div
            ref={containerRef}
            className="relative flex max-h-112 flex-1 flex-col overflow-y-auto sm:max-h-128 lg:max-h-none"
          >
            <div className={`flex w-full flex-col ${gapClass}`}>
              {items.map((item, index) => (
                <AccordionImagesItem
                  key={index}
                  item={item}
                  titleParts={itemLinkParts[index]?.titleParts}
                  bodyParts={itemLinkParts[index]?.bodyParts}
                  isOpen={openIndex === index}
                  onToggle={() => toggleAccordion(index)}
                  itemRef={(element) => setItemRef(index, element)}
                  look={resolved.itemLook}
                  background={resolved.itemBg}
                  radius={resolved.itemRadius}
                  padding={resolved.itemPadding}
                  showDivider={resolved.showItemDivider}
                  titleColor={resolved.itemTitleColor}
                  openColor={resolved.itemOpenColor}
                  bodyColor={resolved.itemBodyColor}
                  titleFontWeight={resolved.itemTitleFontWeight}
                  bodyFontWeight={resolved.itemBodyFontWeight}
                  toggleBg={resolved.toggleBg}
                  toggleBorder={resolved.toggleBorder}
                  toggleIcon={resolved.toggleIcon}
                  linkStyle={resolved}
                  showLinks={showLinks}
                />
              ))}
            </div>
          </div>
        </div>

        {resolved.showImagePanel ? (
          <div className="hidden w-full items-center justify-center sm:flex lg:w-1/2">
            <AccordionImagesPanel
              items={items}
              activeIndex={panelIndex}
              radius={resolved.imageRadius}
              background={resolved.imageBg}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
