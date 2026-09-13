"use client";

import { useEffect, useState } from "react";
import { LegalInformationCardsSection } from "@/app/cmsComponents/LegalInformationCards";
import LegalInformationCardsPropsForm from "@/app/cmsComponents/LegalInformationCards/docs/LegalInformationCardsPropsForm";
import {
  getLegalInformationCardsEditorContent,
  wrapLegalInformationCardsContent,
} from "@/app/cmsComponents/LegalInformationCards/utils/helpers";
import { DEFAULT_LEGAL_INFORMATION_CARDS_STYLE } from "@/app/cmsComponents/LegalInformationCards/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLegalInformationCardsEditorContent(data, lang);
}

export default function LegalInformationCardsExamples({
  ctx,
  name = "LegalInformationCards",
}) {
  const { lang, dir, legalInformationCardsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LEGAL_INFORMATION_CARDS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(legalInformationCardsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(legalInformationCardsData, lang));
  }, [legalInformationCardsData, lang]);

  return (
    <div>
      <LegalInformationCardsSection
        lang={lang}
        dir={dir}
        data={wrapLegalInformationCardsContent(content, lang)}
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
                console.log("LegalInformationCards", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LegalInformationCardsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(legalInformationCardsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
