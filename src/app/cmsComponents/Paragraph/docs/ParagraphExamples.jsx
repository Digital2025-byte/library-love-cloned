"use client";

import { useEffect, useState } from "react";
import { ParagraphSection } from "@/app/cmsComponents/Paragraph";
import ParagraphPropsForm from "@/app/cmsComponents/Paragraph/docs/ParagraphPropsForm";
import {
  getParagraphEditorContent,
  wrapParagraphContent,
} from "@/app/cmsComponents/Paragraph/utils/helpers";
import { DEFAULT_PARAGRAPH_STYLE } from "@/app/cmsComponents/Paragraph/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getParagraphEditorContent(data, lang);
}

export default function ParagraphExamples({ ctx, name = "Paragraph" }) {
  const { lang, dir, paragraphData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_PARAGRAPH_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(paragraphData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(paragraphData, lang));
  }, [paragraphData, lang]);

  return (
    <div>
      <ParagraphSection
        lang={lang}
        dir={dir}
        data={wrapParagraphContent(content, lang)}
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
              onClick={() => console.log("Paragraph", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <ParagraphPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(paragraphData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
