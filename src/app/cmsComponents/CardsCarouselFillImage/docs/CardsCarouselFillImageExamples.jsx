"use client";

import { useEffect, useState } from "react";
import { CardsCarouselFillImageSection } from "@/app/cmsComponents/CardsCarouselFillImage";
import CardsCarouselFillImagePropsForm from "@/app/cmsComponents/CardsCarouselFillImage/docs/CardsCarouselFillImagePropsForm";
import {
  getCardsCarouselFillImageEditorContent,
  wrapCardsCarouselFillImageContent,
} from "@/app/cmsComponents/CardsCarouselFillImage/utils/helpers";
import { DEFAULT_FILL_IMAGE_STYLE } from "@/app/cmsComponents/CardsCarouselFillImage/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  const content = getCardsCarouselFillImageEditorContent(data, lang, "gb");

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

export default function CardsCarouselFillImageExamples({
  ctx,
  name = "CardsCarouselFillImage",
}) {
  const { lang, dir, cardsCarouselFillImageData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FILL_IMAGE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(cardsCarouselFillImageData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(cardsCarouselFillImageData, lang));
  }, [cardsCarouselFillImageData, lang]);

  return (
    <div>
      <CardsCarouselFillImageSection
        lang={lang}
        dir={dir}
        data={wrapCardsCarouselFillImageContent(content, lang)}
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
              onClick={() =>
                console.log("CardsCarouselFillImage", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <CardsCarouselFillImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(cardsCarouselFillImageData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
