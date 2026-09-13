"use client";

import { useEffect, useState } from "react";
import { SplitWithImageSection } from "@/app/cmsComponents/SplitWithImage";
import SplitWithImagePropsForm from "@/app/cmsComponents/SplitWithImage/docs/SplitWithImagePropsForm";
import {
  getSplitWithImageEditorContent,
  wrapSplitWithImageContent,
} from "@/app/cmsComponents/SplitWithImage/utils/helpers";
import { DEFAULT_SPLIT_WITH_IMAGE_STYLE } from "@/app/cmsComponents/SplitWithImage/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getSplitWithImageEditorContent(data, lang);
}

export default function SplitWithImageExamples({
  ctx,
  name = "SplitWithImage",
}) {
  const { lang, dir, splitWithImageData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SPLIT_WITH_IMAGE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(splitWithImageData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(splitWithImageData, lang));
  }, [splitWithImageData, lang]);

  return (
    <div>
      <SplitWithImageSection
        lang={lang}
        dir={dir}
        data={wrapSplitWithImageContent(content, lang)}
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
              onClick={() => console.log("SplitWithImage", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <SplitWithImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(splitWithImageData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
