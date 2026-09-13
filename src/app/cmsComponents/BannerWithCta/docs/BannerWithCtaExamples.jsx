"use client";

import { useEffect, useState } from "react";
import { BannerWithCtaSection } from "@/app/cmsComponents/BannerWithCta";
import BannerWithCtaPropsForm from "@/app/cmsComponents/BannerWithCta/docs/BannerWithCtaPropsForm";
import {
  getBannerWithCtaEditorContent,
  wrapBannerWithCtaContent,
} from "@/app/cmsComponents/BannerWithCta/utils/helpers";
import { DEFAULT_BANNER_WITH_CTA_STYLE } from "@/app/cmsComponents/BannerWithCta/utils/style";
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
  const content = getBannerWithCtaEditorContent(data, lang, "gb");
  const link = toEditorLink(content.buttonHref);

  return {
    ...content,
    buttonHref: link.href,
    buttonLinkType: link.type,
  };
}

export default function BannerWithCtaExamples({
  ctx,
  name = "BannerWithCta",
}) {
  const { lang, dir, bannerWithCtaData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_BANNER_WITH_CTA_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(bannerWithCtaData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(bannerWithCtaData, lang));
  }, [bannerWithCtaData, lang]);

  return (
    <div>
      <BannerWithCtaSection
        lang={lang}
        dir={dir}
        data={wrapBannerWithCtaContent(content, lang)}
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
              onClick={() => console.log("BannerWithCta", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <BannerWithCtaPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(bannerWithCtaData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
