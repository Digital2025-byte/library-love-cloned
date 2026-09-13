"use client";

import { useEffect, useState } from "react";
import { LegalInformationHeroSection } from "@/app/cmsComponents/LegalInformationHero";
import LegalInformationHeroPropsForm from "@/app/cmsComponents/LegalInformationHero/docs/LegalInformationHeroPropsForm";
import {
  getLegalInformationHeroEditorContent,
  wrapLegalInformationHeroContent,
} from "@/app/cmsComponents/LegalInformationHero/utils/helpers";
import { DEFAULT_LEGAL_INFORMATION_HERO_STYLE } from "@/app/cmsComponents/LegalInformationHero/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLegalInformationHeroEditorContent(data, lang);
}

export default function LegalInformationHeroExamples({
  ctx,
  name = "LegalInformationHero",
}) {
  const { lang, dir, legalInformationHeroData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LEGAL_INFORMATION_HERO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(legalInformationHeroData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(legalInformationHeroData, lang));
  }, [legalInformationHeroData, lang]);

  return (
    <div>
      <LegalInformationHeroSection
        lang={lang}
        dir={dir}
        data={wrapLegalInformationHeroContent(content, lang)}
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
                console.log("LegalInformationHero", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LegalInformationHeroPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(legalInformationHeroData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
