"use client";

import { useEffect, useState } from "react";
import { SplitTextOnlySection } from "@/app/cmsComponents/SplitTextOnly";
import SplitTextOnlyPropsForm from "@/app/cmsComponents/SplitTextOnly/docs/SplitTextOnlyPropsForm";
import {
  getSplitTextOnlyEditorContent,
  wrapSplitTextOnlyContent,
} from "@/app/cmsComponents/SplitTextOnly/utils/helpers";
import { DEFAULT_SPLIT_TEXT_ONLY_STYLE } from "@/app/cmsComponents/SplitTextOnly/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getSplitTextOnlyEditorContent(data, lang);
}

export default function SplitTextOnlyExamples({
  ctx,
  name = "SplitTextOnly",
}) {
  const { lang, dir, splitTextOnlyData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SPLIT_TEXT_ONLY_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(splitTextOnlyData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(splitTextOnlyData, lang));
  }, [splitTextOnlyData, lang]);

  return (
    <div>
      <SplitTextOnlySection
        lang={lang}
        dir={dir}
        data={wrapSplitTextOnlyContent(content, lang)}
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
              onClick={() => console.log("SplitTextOnly", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <SplitTextOnlyPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(splitTextOnlyData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
