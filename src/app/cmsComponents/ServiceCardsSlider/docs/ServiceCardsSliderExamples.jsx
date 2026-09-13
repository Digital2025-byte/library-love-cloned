"use client";

import { useEffect, useState } from "react";
import { ServiceCardsSliderSection } from "@/app/cmsComponents/ServiceCardsSlider";
import ServiceCardsSliderPropsForm from "@/app/cmsComponents/ServiceCardsSlider/docs/ServiceCardsSliderPropsForm";
import {
  getServiceCardsSliderEditorContent,
  wrapServiceCardsSliderContent,
} from "@/app/cmsComponents/ServiceCardsSlider/utils/helpers";
import { DEFAULT_SERVICE_CARDS_STYLE } from "@/app/cmsComponents/ServiceCardsSlider/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  isExternalHref,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorLink(href) {
  if (!href) {
    return { type: "internal", href: "" };
  }

  if (isExternalHref(href)) {
    return { type: "external", href };
  }

  return { type: "internal", href };
}

function toEditorContent(data, lang) {
  const content = getServiceCardsSliderEditorContent(data, lang, "gb");

  return {
    ...content,
    items: (content.items || []).map((item) => {
      const link = toEditorLink(item.buttonHref);

      return {
        ...item,
        buttonHref: link.href,
        buttonLinkType: link.type,
      };
    }),
  };
}

export default function ServiceCardsSliderExamples({
  ctx,
  name = "ServiceCardsSlider",
}) {
  const { lang, dir, serviceCardsSliderData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SERVICE_CARDS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(serviceCardsSliderData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(serviceCardsSliderData, lang));
  }, [serviceCardsSliderData, lang]);

  return (
    <div>
      <ServiceCardsSliderSection
        lang={lang}
        dir={dir}
        data={wrapServiceCardsSliderContent(content, lang)}
        posParams="gb"
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
                console.log("ServiceCardsSlider", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <ServiceCardsSliderPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(serviceCardsSliderData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
