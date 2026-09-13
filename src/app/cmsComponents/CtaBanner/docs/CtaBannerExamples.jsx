"use client";

import { useEffect, useState } from "react";
import { CtaBannerSection } from "@/app/cmsComponents/CtaBanner";
import CtaBannerPropsForm from "@/app/cmsComponents/CtaBanner/docs/CtaBannerPropsForm";
import {
  getCtaBannerEditorContent,
  wrapCtaBannerContent,
} from "@/app/cmsComponents/CtaBanner/utils/helpers";
import { DEFAULT_CTA_BANNER_STYLE } from "@/app/cmsComponents/CtaBanner/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  isExternalHref,
  isInternalPage,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorLink(href) {
  if (!href || href === "#") {
    return { type: "external", href: href || "" };
  }
  if (isExternalHref(href) || isInternalPage(href)) {
    return resolveEditorLink(href);
  }
  if (String(href).startsWith("/")) {
    return { type: "external", href };
  }
  return resolveEditorLink(href);
}

function toEditorContent(data, lang) {
  const content = getCtaBannerEditorContent(data, lang, "gb");
  const link = toEditorLink(content.buttonHref);
  return {
    ...content,
    buttonHref: link.href,
    buttonLinkType: link.type,
  };
}

export default function CtaBannerExamples({ ctx, name = "CtaBanner" }) {
  const { lang, dir, ctaBannerData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CTA_BANNER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(ctaBannerData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(ctaBannerData, lang));
  }, [ctaBannerData, lang]);

  return (
    <div>
      <CtaBannerSection
        lang={lang}
        dir={dir}
        data={wrapCtaBannerContent(content, lang)}
        style={style}
        posParams="gb"
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
              onClick={() => console.log("CtaBanner", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <CtaBannerPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(ctaBannerData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
