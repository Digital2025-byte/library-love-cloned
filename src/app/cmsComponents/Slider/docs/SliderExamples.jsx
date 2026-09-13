"use client";

import { useEffect, useState } from "react";
import { SliderSection } from "@/app/cmsComponents/Slider";
import SliderPropsForm from "@/app/cmsComponents/Slider/docs/SliderPropsForm";
import {
  getSliderEditorContent,
  wrapSliderContent,
} from "@/app/cmsComponents/Slider/utils/helpers";
import { DEFAULT_SLIDER_STYLE } from "@/app/cmsComponents/Slider/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  const content = getSliderEditorContent(data, lang);

  return {
    ...content,
    slides: content.slides.map((slide) => {
      const link = resolveEditorLink(slide.buttonHref);

      return {
        ...slide,
        buttonHref: link.href,
        buttonLinkType: link.type,
      };
    }),
  };
}

export default function SliderExamples({ ctx, name = "Slider" }) {
  const { lang, sliderData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SLIDER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(sliderData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(sliderData, lang));
  }, [sliderData, lang]);

  return (
    <div>
      <SliderSection
        lang={lang}
        data={wrapSliderContent(content, lang)}
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
              onClick={() => console.log("Slider", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <SliderPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(sliderData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
