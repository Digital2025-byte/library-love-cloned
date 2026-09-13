"use client";

import { useEffect, useState } from "react";
import { TextWithBlobImageSection } from "@/app/cmsComponents/TextWithBlobImage";
import TextWithBlobImagePropsForm from "@/app/cmsComponents/TextWithBlobImage/docs/TextWithBlobImagePropsForm";
import {
  getTextWithBlobEditorContent,
  wrapTextWithBlobContent,
} from "@/app/cmsComponents/TextWithBlobImage/utils/helpers";
import { DEFAULT_TEXT_WITH_BLOB_STYLE } from "@/app/cmsComponents/TextWithBlobImage/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getTextWithBlobEditorContent(data, lang);
}

export default function TextWithBlobImageExamples({
  ctx,
  name = "TextWithBlobImage",
}) {
  const { lang, dir, textWithBlobData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TEXT_WITH_BLOB_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(textWithBlobData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(textWithBlobData, lang));
  }, [textWithBlobData, lang]);

  return (
    <div>
      <TextWithBlobImageSection
        lang={lang}
        dir={dir}
        data={wrapTextWithBlobContent(content, lang)}
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
                console.log("TextWithBlobImage", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <TextWithBlobImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(textWithBlobData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
