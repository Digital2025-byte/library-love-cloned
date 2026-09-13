"use client";

import { useEffect, useState } from "react";
import { LegalBodyPrivacyPolicySection } from "@/app/cmsComponents/LegalBodyPrivacyPolicy";
import LegalBodyPrivacyPolicyPropsForm from "@/app/cmsComponents/LegalBodyPrivacyPolicy/docs/LegalBodyPrivacyPolicyPropsForm";
import {
  getLegalBodyPrivacyPolicyEditorContent,
  wrapLegalBodyPrivacyPolicyContent,
} from "@/app/cmsComponents/LegalBodyPrivacyPolicy/utils/helpers";
import { DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE } from "@/app/cmsComponents/LegalBodyPrivacyPolicy/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLegalBodyPrivacyPolicyEditorContent(data, lang);
}

export default function LegalBodyPrivacyPolicyExamples({
  ctx,
  name = "LegalBodyPrivacyPolicy",
}) {
  const { lang, dir, legalBodyPrivacyPolicyData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LEGAL_BODY_PRIVACY_POLICY_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(legalBodyPrivacyPolicyData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(legalBodyPrivacyPolicyData, lang));
  }, [legalBodyPrivacyPolicyData, lang]);

  return (
    <div>
      <LegalBodyPrivacyPolicySection
        lang={lang}
        dir={dir}
        data={wrapLegalBodyPrivacyPolicyContent(content, lang)}
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
                console.log("LegalBodyPrivacyPolicy", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LegalBodyPrivacyPolicyPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(legalBodyPrivacyPolicyData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
