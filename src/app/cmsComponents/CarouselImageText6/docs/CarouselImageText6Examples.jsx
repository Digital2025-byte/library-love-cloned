"use client";

import { useEffect, useState } from "react";
import { CarouselImageText6Section } from "@/app/cmsComponents/CarouselImageText6";
import CarouselImageText6PropsForm from "@/app/cmsComponents/CarouselImageText6/docs/CarouselImageText6PropsForm";
import {
  getCarouselImageText6EditorContent,
  wrapCarouselImageText6Content,
} from "@/app/cmsComponents/CarouselImageText6/utils/helpers";
import { DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE } from "@/app/cmsComponents/CarouselImageText6/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

export default function CarouselImageText6Examples({
  ctx,
  name = "CarouselImageText6",
}) {
  const { lang, dir, carouselImageText6Data } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CAROUSEL_IMAGE_TEXT_STYLE);
  const [content, setContent] = useState(() =>
    getCarouselImageText6EditorContent(carouselImageText6Data, lang)
  );

  useEffect(() => {
    setContent(getCarouselImageText6EditorContent(carouselImageText6Data, lang));
  }, [carouselImageText6Data, lang]);

  return (
    <div>
      <CarouselImageText6Section
        lang={lang}
        dir={dir}
        data={wrapCarouselImageText6Content(content, lang)}
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
                console.log("CarouselImageText6", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <CarouselImageText6PropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={getCarouselImageText6EditorContent(
            carouselImageText6Data,
            lang
          )}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
