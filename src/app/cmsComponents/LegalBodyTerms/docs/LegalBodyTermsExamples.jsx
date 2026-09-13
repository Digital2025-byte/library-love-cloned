"use client";

import { useEffect, useState } from "react";
import { LegalBodyTermsSection } from "@/app/cmsComponents/LegalBodyTerms";
import LegalBodyTermsPropsForm from "@/app/cmsComponents/LegalBodyTerms/docs/LegalBodyTermsPropsForm";
import {
  getLegalBodyTermsEditorContent,
  wrapLegalBodyTermsContent,
} from "@/app/cmsComponents/LegalBodyTerms/utils/helpers";
import { DEFAULT_LEGAL_BODY_TERMS_STYLE } from "@/app/cmsComponents/LegalBodyTerms/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLegalBodyTermsEditorContent(data, lang);
}

export default function LegalBodyTermsExamples({
  ctx,
  name = "LegalBodyTerms",
}) {
  const { lang, dir, legalBodyTermsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LEGAL_BODY_TERMS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(legalBodyTermsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(legalBodyTermsData, lang));
  }, [legalBodyTermsData, lang]);

  return (
    <div>
      <LegalBodyTermsSection
        lang={lang}
        dir={dir}
        data={wrapLegalBodyTermsContent(content, lang)}
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
                console.log("LegalBodyTerms", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LegalBodyTermsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(legalBodyTermsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
