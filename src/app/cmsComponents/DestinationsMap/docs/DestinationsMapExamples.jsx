"use client";

import { useEffect, useState } from "react";
import { DestinationsMapSection } from "@/app/cmsComponents/DestinationsMap";
import DestinationsMapPropsForm from "@/app/cmsComponents/DestinationsMap/docs/DestinationsMapPropsForm";
import {
  getDestinationsMapEditorContent,
  wrapDestinationsMapContent,
} from "@/app/cmsComponents/DestinationsMap/utils/helpers";
import { DEFAULT_DESTINATIONS_MAP_STYLE } from "@/app/cmsComponents/DestinationsMap/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getDestinationsMapEditorContent(data, lang);
}

export default function DestinationsMapExamples({
  ctx,
  name = "DestinationsMap",
}) {
  const { lang, dir, destinationsMapData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_DESTINATIONS_MAP_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(destinationsMapData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(destinationsMapData, lang));
  }, [destinationsMapData, lang]);

  return (
    <div>
      <DestinationsMapSection
        lang={lang}
        dir={dir}
        data={wrapDestinationsMapContent(content, lang)}
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
                console.log("DestinationsMap", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <DestinationsMapPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(destinationsMapData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
