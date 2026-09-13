"use client";

import { useEffect, useState } from "react";
import { DestinationsCitiesSection } from "@/app/cmsComponents/DestinationsCities";
import DestinationsCitiesPropsForm from "@/app/cmsComponents/DestinationsCities/docs/DestinationsCitiesPropsForm";
import {
  getDestinationsCitiesEditorContent,
  wrapDestinationsCitiesContent,
} from "@/app/cmsComponents/DestinationsCities/utils/helpers";
import { DEFAULT_DESTINATIONS_CITIES_STYLE } from "@/app/cmsComponents/DestinationsCities/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getDestinationsCitiesEditorContent(data, lang);
}

export default function DestinationsCitiesExamples({
  ctx,
  name = "DestinationsCities",
}) {
  const { lang, dir, destinationsCitiesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_DESTINATIONS_CITIES_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(destinationsCitiesData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(destinationsCitiesData, lang));
  }, [destinationsCitiesData, lang]);

  return (
    <div>
      <DestinationsCitiesSection
        lang={lang}
        dir={dir}
        data={wrapDestinationsCitiesContent(content, lang)}
        style={style}
        posParams="gb"
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
                console.log("DestinationsCities", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <DestinationsCitiesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(destinationsCitiesData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
