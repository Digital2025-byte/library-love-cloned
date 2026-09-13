"use client";

import { useEffect, useState } from "react";
import { ScrollCarouselSection } from "@/app/cmsComponents/ScrollCarousel";
import ScrollCarouselPropsForm from "@/app/cmsComponents/ScrollCarousel/docs/ScrollCarouselPropsForm";
import {
  getScrollCarouselEditorContent,
  wrapScrollCarouselContent,
} from "@/app/cmsComponents/ScrollCarousel/utils/helpers";
import { DEFAULT_SCROLL_CAROUSEL_STYLE } from "@/app/cmsComponents/ScrollCarousel/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(lang) {
  return getScrollCarouselEditorContent(undefined, lang);
}

export default function ScrollCarouselExamples({
  ctx,
  name = "ScrollCarousel",
}) {
  const { lang } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SCROLL_CAROUSEL_STYLE);
  const [content, setContent] = useState(() => toEditorContent(lang));

  useEffect(() => {
    setContent(toEditorContent(lang));
  }, [lang]);

  return (
    <div>
      <ScrollCarouselSection
        lang={lang}
        data={wrapScrollCarouselContent(content, lang)}
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
                console.log("ScrollCarousel", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <ScrollCarouselPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
