"use client";

import { useEffect, useState } from "react";
import { VerticalImageSliceTextSectionSection } from "@/app/cmsComponents/VerticalImageSliceTextSection";
import VerticalImageSliceTextSectionPropsForm from "@/app/cmsComponents/VerticalImageSliceTextSection/docs/VerticalImageSliceTextSectionPropsForm";
import {
  getVerticalImageSliceEditorContent,
  wrapVerticalImageSliceContent,
} from "@/app/cmsComponents/VerticalImageSliceTextSection/utils/helpers";
import { DEFAULT_VERTICAL_IMAGE_SLICE_STYLE } from "@/app/cmsComponents/VerticalImageSliceTextSection/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getVerticalImageSliceEditorContent(data, lang);
}

export default function VerticalImageSliceTextSectionExamples({
  ctx,
  name = "VerticalImageSliceTextSection",
}) {
  const { lang, dir, verticalImageSliceData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_VERTICAL_IMAGE_SLICE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(verticalImageSliceData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(verticalImageSliceData, lang));
  }, [verticalImageSliceData, lang]);

  return (
    <div>
      <VerticalImageSliceTextSectionSection
        lang={lang}
        dir={dir}
        data={wrapVerticalImageSliceContent(content, lang)}
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
                console.log("VerticalImageSliceTextSection", {
                  content,
                  style,
                })
              }
            />
          </InspectorFooter>
        }
      >
        <VerticalImageSliceTextSectionPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(verticalImageSliceData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
