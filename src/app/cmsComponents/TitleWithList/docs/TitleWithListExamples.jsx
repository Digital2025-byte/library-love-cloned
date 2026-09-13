"use client";

import { useEffect, useState } from "react";
import { TitleWithListSection } from "@/app/cmsComponents/TitleWithList";
import TitleWithListPropsForm from "@/app/cmsComponents/TitleWithList/docs/TitleWithListPropsForm";
import {
  getTitleWithListEditorContent,
  wrapTitleWithListContent,
} from "@/app/cmsComponents/TitleWithList/utils/helpers";
import { DEFAULT_TITLE_WITH_LIST_STYLE } from "@/app/cmsComponents/TitleWithList/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getTitleWithListEditorContent(data, lang);
}

export default function TitleWithListExamples({
  ctx,
  name = "TitleWithList",
}) {
  const { lang, dir, titleWithListData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TITLE_WITH_LIST_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(titleWithListData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(titleWithListData, lang));
  }, [titleWithListData, lang]);

  return (
    <div>
      <TitleWithListSection
        lang={lang}
        dir={dir}
        data={wrapTitleWithListContent(content, lang)}
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
                console.log("TitleWithList", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <TitleWithListPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(titleWithListData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
