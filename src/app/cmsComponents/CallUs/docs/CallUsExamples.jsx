"use client";

import { useEffect, useState } from "react";
import { CallUsSection } from "@/app/cmsComponents/CallUs";
import CallUsPropsForm from "@/app/cmsComponents/CallUs/docs/CallUsPropsForm";
import {
  getCallUsEditorContent,
  wrapCallUsContent,
} from "@/app/cmsComponents/CallUs/utils/helpers";
import { DEFAULT_CALL_US_STYLE } from "@/app/cmsComponents/CallUs/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getCallUsEditorContent(data, lang);
}

export default function CallUsExamples({ ctx, name = "CallUs" }) {
  const { lang, dir, callUsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CALL_US_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(callUsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(callUsData, lang));
  }, [callUsData, lang]);

  return (
    <div>
      <CallUsSection
        lang={lang}
        dir={dir}
        data={wrapCallUsContent(content, lang)}
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
              onClick={() => console.log("CallUs", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <CallUsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(callUsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
