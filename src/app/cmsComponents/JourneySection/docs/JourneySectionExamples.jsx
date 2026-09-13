"use client";

import { useEffect, useState } from "react";
import { JourneySectionSection } from "@/app/cmsComponents/JourneySection";
import JourneySectionPropsForm from "@/app/cmsComponents/JourneySection/docs/JourneySectionPropsForm";
import {
  getJourneySectionEditorContent,
  wrapJourneySectionContent,
} from "@/app/cmsComponents/JourneySection/utils/helpers";
import { DEFAULT_JOURNEY_SECTION_STYLE } from "@/app/cmsComponents/JourneySection/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getJourneySectionEditorContent(data, lang);
}

export default function JourneySectionExamples({
  ctx,
  name = "JourneySection",
}) {
  const { lang, dir, journeySectionData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_JOURNEY_SECTION_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(journeySectionData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(journeySectionData, lang));
  }, [journeySectionData, lang]);

  return (
    <div>
      <JourneySectionSection
        lang={lang}
        dir={dir}
        data={wrapJourneySectionContent(content, lang)}
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
              onClick={() => console.log("JourneySection", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <JourneySectionPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(journeySectionData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
