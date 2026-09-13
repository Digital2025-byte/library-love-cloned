"use client";

import { useEffect, useState } from "react";
import { ThreeDSliderSection } from "@/app/cmsComponents/ThreeDSlider";
import ThreeDSliderPropsForm from "@/app/cmsComponents/ThreeDSlider/docs/ThreeDSliderPropsForm";
import {
  getThreeDSliderEditorContent,
  wrapThreeDSliderContent,
} from "@/app/cmsComponents/ThreeDSlider/utils/helpers";
import { DEFAULT_THREE_D_SLIDER_STYLE } from "@/app/cmsComponents/ThreeDSlider/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(lang) {
  return getThreeDSliderEditorContent(undefined, lang);
}

export default function ThreeDSliderExamples({ ctx, name = "ThreeDSlider" }) {
  const { lang } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_THREE_D_SLIDER_STYLE);
  const [content, setContent] = useState(() => toEditorContent(lang));

  useEffect(() => {
    setContent(toEditorContent(lang));
  }, [lang]);

  return (
    <div>
      <ThreeDSliderSection
        lang={lang}
        data={wrapThreeDSliderContent(content, lang)}
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
              onClick={() => console.log("ThreeDSlider", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <ThreeDSliderPropsForm
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
