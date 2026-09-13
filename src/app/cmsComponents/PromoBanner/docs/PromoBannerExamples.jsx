"use client";

import { useEffect, useState } from "react";
import { PromoBannerSection } from "@/app/cmsComponents/PromoBanner";
import PromoBannerPropsForm from "@/app/cmsComponents/PromoBanner/docs/PromoBannerPropsForm";
import {
  getPromoBannerEditorContent,
  wrapPromoBannerContent,
} from "@/app/cmsComponents/PromoBanner/utils/helpers";
import { DEFAULT_PROMO_BANNER_STYLE } from "@/app/cmsComponents/PromoBanner/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getPromoBannerEditorContent(data, lang);
}

export default function PromoBannerExamples({ ctx, name = "PromoBanner" }) {
  const { lang, dir, promoBannerData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_PROMO_BANNER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(promoBannerData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(promoBannerData, lang));
  }, [promoBannerData, lang]);

  return (
    <div>
      <PromoBannerSection
        lang={lang}
        dir={dir}
        data={wrapPromoBannerContent(content, lang)}
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
              onClick={() => console.log("PromoBanner", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <PromoBannerPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(promoBannerData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
