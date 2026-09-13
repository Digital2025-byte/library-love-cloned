"use client";

import AccordionButton from "./components/AccordionButton";
import AccordionHeader from "./components/AccordionHeader";
import AccordionItem from "./components/AccordionItem";
import { useAccordion } from "./hooks/useAccordion";
import { buildItemBacklinkParts } from "@/app/cmsComponents/shared/backlinks";
import { getAccordionContent } from "./utils/helpers";
import { ITEM_GAP_CLASS, resolveAccordionStyle } from "./utils/style";

export default function AccordionWithContent({ data, style }) {
  const resolved = resolveAccordionStyle(style);
  const { title, description, links, buttonLabel, buttonHref, items } =
    getAccordionContent(data);
  const { isOpen, toggleAccordion } = useAccordion();
  const gapClass = ITEM_GAP_CLASS[resolved.itemGap] ?? ITEM_GAP_CLASS.default;
  const showLinks = resolved.showLinks !== false;
  const itemLinkParts = showLinks
    ? buildItemBacklinkParts(items, links)
    : items.map((item) => ({
        titleParts: [{ type: "text", value: item.title || "" }],
        bodyParts: [{ type: "text", value: item.description || "" }],
      }));

  return (
    <>
      {resolved.showTitleDescription || resolved.showDescription ? (
        <AccordionHeader
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
        />
      ) : null}

      <div className={`flex flex-col ${gapClass}`}>
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            titleParts={itemLinkParts[index]?.titleParts}
            bodyParts={itemLinkParts[index]?.bodyParts}
            isOpen={isOpen(index)}
            onToggle={() => toggleAccordion(index)}
            look={resolved.itemLook}
            showBackground={resolved.showItemBg}
            background={resolved.itemBg}
            radius={resolved.itemRadius}
            padding={resolved.itemPadding}
            titleColor={resolved.itemTitleColor}
            openColor={resolved.itemOpenColor}
            bodyColor={resolved.itemBodyColor}
            titleFontWeight={resolved.itemTitleFontWeight}
            bodyFontWeight={resolved.itemBodyFontWeight}
            linkStyle={resolved}
            showLinks={showLinks}
          />
        ))}
      </div>

      {resolved.showButton ? (
        <AccordionButton
          label={buttonLabel}
          href={buttonHref}
          position={resolved.buttonPosition}
          variant={resolved.buttonVariant}
          width={resolved.buttonWidth}
        />
      ) : null}
    </>
  );
}
