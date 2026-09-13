"use client";

import { useEffect, useState } from "react";
import { LegalBodyCookiesSection } from "@/app/cmsComponents/LegalBodyCookies";
import LegalBodyCookiesPropsForm from "@/app/cmsComponents/LegalBodyCookies/docs/LegalBodyCookiesPropsForm";
import {
  getLegalBodyCookiesEditorContent,
  wrapLegalBodyCookiesContent,
} from "@/app/cmsComponents/LegalBodyCookies/utils/helpers";
import { DEFAULT_LEGAL_BODY_COOKIES_STYLE } from "@/app/cmsComponents/LegalBodyCookies/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getLegalBodyCookiesEditorContent(data, lang);
}

export default function LegalBodyCookiesExamples({
  ctx,
  name = "LegalBodyCookies",
}) {
  const { lang, dir, legalBodyCookiesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LEGAL_BODY_COOKIES_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(legalBodyCookiesData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(legalBodyCookiesData, lang));
  }, [legalBodyCookiesData, lang]);

  return (
    <div>
      <LegalBodyCookiesSection
        lang={lang}
        dir={dir}
        data={wrapLegalBodyCookiesContent(content, lang)}
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
                console.log("LegalBodyCookies", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <LegalBodyCookiesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(legalBodyCookiesData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
