"use client";

import { useEffect, useState } from "react";
import { ServiceBenefitsListSection } from "@/app/cmsComponents/ServiceBenefitsList";
import ServiceBenefitsListPropsForm from "@/app/cmsComponents/ServiceBenefitsList/docs/ServiceBenefitsListPropsForm";
import {
  getServiceBenefitsEditorContent,
  wrapServiceBenefitsContent,
} from "@/app/cmsComponents/ServiceBenefitsList/utils/helpers";
import { DEFAULT_SERVICE_BENEFITS_STYLE } from "@/app/cmsComponents/ServiceBenefitsList/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getServiceBenefitsEditorContent(data, lang);
}

export default function ServiceBenefitsListExamples({
  ctx,
  name = "ServiceBenefitsList",
}) {
  const { lang, dir, serviceBenefitsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SERVICE_BENEFITS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(serviceBenefitsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(serviceBenefitsData, lang));
  }, [serviceBenefitsData, lang]);

  return (
    <div>
      <ServiceBenefitsListSection
        lang={lang}
        dir={dir}
        data={wrapServiceBenefitsContent(content, lang)}
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
                console.log("ServiceBenefitsList", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <ServiceBenefitsListPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(serviceBenefitsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
