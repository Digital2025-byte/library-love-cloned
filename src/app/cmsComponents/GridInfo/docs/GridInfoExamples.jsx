"use client";

import { useEffect, useState } from "react";
import { GridInfoSection } from "@/app/cmsComponents/GridInfo";
import GridInfoPropsForm from "@/app/cmsComponents/GridInfo/docs/GridInfoPropsForm";
import {
  getGridInfoEditorContent,
  wrapGridInfoContent,
} from "@/app/cmsComponents/GridInfo/utils/helpers";
import { DEFAULT_GRID_INFO_STYLE } from "@/app/cmsComponents/GridInfo/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getGridInfoEditorContent(data, lang);
}

export default function GridInfoExamples({ ctx, name = "GridInfo" }) {
  const { lang, dir, gridInfoData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_GRID_INFO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(gridInfoData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(gridInfoData, lang));
  }, [gridInfoData, lang]);

  return (
    <div>
      <GridInfoSection
        lang={lang}
        dir={dir}
        data={wrapGridInfoContent(content, lang)}
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
              onClick={() => console.log("GridInfo", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <GridInfoPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(gridInfoData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
