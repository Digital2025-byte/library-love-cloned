"use client";

import { useEffect, useState } from "react";
import { HeaderWithThreeImageSection } from "@/app/cmsComponents/HeaderWithThreeImage";
import HeaderWithThreeImagePropsForm from "@/app/cmsComponents/HeaderWithThreeImage/docs/HeaderWithThreeImagePropsForm";
import {
  getHeaderWithThreeImageEditorContent,
  wrapHeaderWithThreeImageContent,
} from "@/app/cmsComponents/HeaderWithThreeImage/utils/helpers";
import { DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE } from "@/app/cmsComponents/HeaderWithThreeImage/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getHeaderWithThreeImageEditorContent(data, lang);
}

export default function HeaderWithThreeImageExamples({
  ctx,
  name = "HeaderWithThreeImage",
}) {
  const { lang, dir, headerWithThreeImageData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_HEADER_WITH_THREE_IMAGE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(headerWithThreeImageData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(headerWithThreeImageData, lang));
  }, [headerWithThreeImageData, lang]);

  return (
    <div>
      <HeaderWithThreeImageSection
        lang={lang}
        dir={dir}
        data={wrapHeaderWithThreeImageContent(content, lang)}
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
                console.log("HeaderWithThreeImage", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <HeaderWithThreeImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(headerWithThreeImageData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
