"use client";

import { useEffect, useState } from "react";
import { LocationDirectorySection } from "@/app/cmsComponents/LocationDirectory";
import LocationDirectoryPropsForm from "@/app/cmsComponents/LocationDirectory/docs/LocationDirectoryPropsForm";
import {
  getLocationDirectoryEditorContent,
  wrapLocationDirectoryContent,
} from "@/app/cmsComponents/LocationDirectory/utils/helpers";
import { DEFAULT_LOCATION_DIRECTORY_STYLE } from "@/app/cmsComponents/LocationDirectory/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLocationDirectoryEditorContent(data, lang);
}

export default function LocationDirectoryExamples({
  ctx,
  name = "LocationDirectory",
}) {
  const { lang, dir, locationDirectoryData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LOCATION_DIRECTORY_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(locationDirectoryData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(locationDirectoryData, lang));
  }, [locationDirectoryData, lang]);

  return (
    <div>
      <LocationDirectorySection
        lang={lang}
        dir={dir}
        data={wrapLocationDirectoryContent(content, lang)}
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
                console.log("LocationDirectory", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LocationDirectoryPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(locationDirectoryData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
