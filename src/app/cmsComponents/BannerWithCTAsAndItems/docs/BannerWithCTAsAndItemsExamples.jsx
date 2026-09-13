"use client";

import { useEffect, useState } from "react";
import { BannerWithCTAsAndItemsSection } from "@/app/cmsComponents/BannerWithCTAsAndItems";
import BannerWithCTAsAndItemsPropsForm from "@/app/cmsComponents/BannerWithCTAsAndItems/docs/BannerWithCTAsAndItemsPropsForm";
import {
  getBannerWithCTAsAndItemsEditorContent,
  wrapBannerWithCTAsAndItemsContent,
} from "@/app/cmsComponents/BannerWithCTAsAndItems/utils/helpers";
import { DEFAULT_BANNER_WITH_CTAS_STYLE } from "@/app/cmsComponents/BannerWithCTAsAndItems/utils/style";
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
  const content = getBannerWithCTAsAndItemsEditorContent(
    data,
    lang,
    "gb"
  );
  const primary = toEditorLink(content.primaryHref);
  const secondary = toEditorLink(content.secondaryHref);

  return {
    ...content,
    primaryHref: primary.href,
    primaryLinkType: primary.type,
    secondaryHref: secondary.href,
    secondaryLinkType: secondary.type,
  };
}

export default function BannerWithCTAsAndItemsExamples({
  ctx,
  name = "BannerWithCTAsAndItems",
}) {
  const { lang, dir, bannerWithCTAsAndItemsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_BANNER_WITH_CTAS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(bannerWithCTAsAndItemsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(bannerWithCTAsAndItemsData, lang));
  }, [bannerWithCTAsAndItemsData, lang]);

  return (
    <div>
      <BannerWithCTAsAndItemsSection
        lang={lang}
        dir={dir}
        data={wrapBannerWithCTAsAndItemsContent(content, lang)}
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
              onClick={() =>
                console.log("BannerWithCTAsAndItems", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <BannerWithCTAsAndItemsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(bannerWithCTAsAndItemsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
