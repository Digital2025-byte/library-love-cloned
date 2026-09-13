"use client";

import { useEffect, useState } from "react";
import { MapInfoSection } from "@/app/cmsComponents/MapInfo";
import MapInfoPropsForm from "@/app/cmsComponents/MapInfo/docs/MapInfoPropsForm";
import {
  getMapInfoEditorContent,
  wrapMapInfoContent,
} from "@/app/cmsComponents/MapInfo/utils/helpers";
import { DEFAULT_MAP_INFO_STYLE } from "@/app/cmsComponents/MapInfo/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getMapInfoEditorContent(data, lang);
}

export default function MapInfoExamples({ ctx, name = "MapInfo" }) {
  const { lang, dir, mapInfoData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_MAP_INFO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(mapInfoData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(mapInfoData, lang));
  }, [mapInfoData, lang]);

  return (
    <div>
      <MapInfoSection
        lang={lang}
        dir={dir}
        data={wrapMapInfoContent(content, lang)}
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
              onClick={() => console.log("MapInfo", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <MapInfoPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(mapInfoData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
