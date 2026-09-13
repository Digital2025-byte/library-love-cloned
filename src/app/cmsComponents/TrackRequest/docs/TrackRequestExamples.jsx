"use client";

import { useEffect, useState } from "react";
import { TrackRequestSection } from "@/app/cmsComponents/TrackRequest";
import TrackRequestPropsForm from "@/app/cmsComponents/TrackRequest/docs/TrackRequestPropsForm";
import {
  getTrackRequestEditorContent,
  wrapTrackRequestContent,
} from "@/app/cmsComponents/TrackRequest/utils/helpers";
import { DEFAULT_TRACK_REQUEST_STYLE } from "@/app/cmsComponents/TrackRequest/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getTrackRequestEditorContent(data, lang);
}

export default function TrackRequestExamples({ ctx, name = "TrackRequest" }) {
  const { lang, dir, trackRequestData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TRACK_REQUEST_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(trackRequestData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(trackRequestData, lang));
  }, [trackRequestData, lang]);

  return (
    <div>
      <TrackRequestSection
        lang={lang}
        dir={dir}
        data={wrapTrackRequestContent(content, lang)}
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
              onClick={() => console.log("TrackRequest", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <TrackRequestPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(trackRequestData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
