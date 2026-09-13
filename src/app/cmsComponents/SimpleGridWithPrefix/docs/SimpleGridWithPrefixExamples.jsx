"use client";

import { useEffect, useState } from "react";
import { SimpleGridWithPrefixSection } from "@/app/cmsComponents/SimpleGridWithPrefix";
import SimpleGridWithPrefixPropsForm from "@/app/cmsComponents/SimpleGridWithPrefix/docs/SimpleGridWithPrefixPropsForm";
import {
  getSimpleGridWithPrefixEditorContent,
  wrapSimpleGridWithPrefixContent,
} from "@/app/cmsComponents/SimpleGridWithPrefix/utils/helpers";
import { DEFAULT_SIMPLE_GRID_STYLE } from "@/app/cmsComponents/SimpleGridWithPrefix/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getSimpleGridWithPrefixEditorContent(data, lang);
}

export default function SimpleGridWithPrefixExamples({
  ctx,
  name = "SimpleGridWithPrefix",
}) {
  const { lang, dir, simpleGridWithPrefixData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SIMPLE_GRID_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(simpleGridWithPrefixData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(simpleGridWithPrefixData, lang));
  }, [simpleGridWithPrefixData, lang]);

  return (
    <div>
      <SimpleGridWithPrefixSection
        lang={lang}
        dir={dir}
        data={wrapSimpleGridWithPrefixContent(content, lang)}
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
                console.log("SimpleGridWithPrefix", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <SimpleGridWithPrefixPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(simpleGridWithPrefixData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
