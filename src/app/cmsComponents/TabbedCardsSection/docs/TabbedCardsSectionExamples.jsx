"use client";

import { useEffect, useState } from "react";
import { TabbedCardsSectionSection } from "@/app/cmsComponents/TabbedCardsSection";
import TabbedCardsSectionPropsForm from "@/app/cmsComponents/TabbedCardsSection/docs/TabbedCardsSectionPropsForm";
import {
  getTabbedCardsEditorContent,
  wrapTabbedCardsContent,
} from "@/app/cmsComponents/TabbedCardsSection/utils/helpers";
import { DEFAULT_TABBED_CARDS_STYLE } from "@/app/cmsComponents/TabbedCardsSection/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getTabbedCardsEditorContent(data, lang);
}

export default function TabbedCardsSectionExamples({
  ctx,
  name = "TabbedCardsSection",
}) {
  const { lang, dir, tabbedCardsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TABBED_CARDS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(tabbedCardsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(tabbedCardsData, lang));
  }, [tabbedCardsData, lang]);

  return (
    <div>
      <TabbedCardsSectionSection
        lang={lang}
        dir={dir}
        data={wrapTabbedCardsContent(content, lang)}
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
                console.log("TabbedCardsSection", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <TabbedCardsSectionPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(tabbedCardsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
