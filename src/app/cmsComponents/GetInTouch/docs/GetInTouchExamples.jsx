"use client";

import { useEffect, useState } from "react";
import { GetInTouchSection } from "@/app/cmsComponents/GetInTouch";
import GetInTouchPropsForm from "@/app/cmsComponents/GetInTouch/docs/GetInTouchPropsForm";
import {
  getGetInTouchEditorContent,
  wrapGetInTouchContent,
} from "@/app/cmsComponents/GetInTouch/utils/helpers";
import { DEFAULT_GET_IN_TOUCH_STYLE } from "@/app/cmsComponents/GetInTouch/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getGetInTouchEditorContent(data, lang);
}

export default function GetInTouchExamples({ ctx, name = "GetInTouch" }) {
  const { lang, dir, getInTouchData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_GET_IN_TOUCH_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(getInTouchData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(getInTouchData, lang));
  }, [getInTouchData, lang]);

  return (
    <div>
      <GetInTouchSection
        lang={lang}
        dir={dir}
        data={wrapGetInTouchContent(content, lang)}
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
              onClick={() => console.log("GetInTouch", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <GetInTouchPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(getInTouchData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
