"use client";

import { useEffect, useState } from "react";
import { CarouselItemSection } from "@/app/cmsComponents/CarouselItem";
import CarouselItemPropsForm from "@/app/cmsComponents/CarouselItem/docs/CarouselItemPropsForm";
import {
  getCarouselItemEditorContent,
  wrapCarouselItemContent,
} from "@/app/cmsComponents/CarouselItem/utils/helpers";
import { DEFAULT_CAROUSEL_ITEM_STYLE } from "@/app/cmsComponents/CarouselItem/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  const content = getCarouselItemEditorContent(data, lang);

  return {
    ...content,
    items: (content.items || []).map((item) => {
      const link = resolveEditorLink(item.buttonHref);

      return {
        ...item,
        buttonHref: link.href,
        buttonLinkType: link.type,
      };
    }),
  };
}

export default function CarouselItemExamples({
  ctx,
  name = "CarouselItem",
}) {
  const { lang, dir, carouselItemData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CAROUSEL_ITEM_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(carouselItemData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(carouselItemData, lang));
  }, [carouselItemData, lang]);

  return (
    <div>
      <CarouselItemSection
        lang={lang}
        dir={dir}
        data={wrapCarouselItemContent(content, lang)}
        posParams="gb"
        style={style}
      />

      <Drawer
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        onOpen={drawer.open}
        triggerRef={drawer.triggerRef}
        panelRef={drawer.panelRef}
        titleId={drawer.titleId}
        title={name}
        footer={
          <InspectorFooter>
            <InspectorSubmitButton
              onClick={() => console.log("CarouselItem", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <CarouselItemPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(carouselItemData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
