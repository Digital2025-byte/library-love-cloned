"use client";

import { useEffect, useState } from "react";
import { MixedRightThreeImagesSection } from "@/app/cmsComponents/MixedRightThreeImages";
import MixedRightThreeImagesPropsForm from "@/app/cmsComponents/MixedRightThreeImages/docs/MixedRightThreeImagesPropsForm";
import {
  getMixedRightThreeImagesEditorContent,
  wrapMixedRightThreeImagesContent,
} from "@/app/cmsComponents/MixedRightThreeImages/utils/helpers";
import { DEFAULT_MIXED_THREE_IMAGES_STYLE } from "@/app/cmsComponents/MixedRightThreeImages/utils/style";
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
  const content = getMixedRightThreeImagesEditorContent(data, lang);
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

export default function MixedRightThreeImagesExamples({
  ctx,
  name = "MixedRightThreeImages",
}) {
  const { lang, dir, mixedRightThreeImagesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_MIXED_THREE_IMAGES_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(mixedRightThreeImagesData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(mixedRightThreeImagesData, lang));
  }, [mixedRightThreeImagesData, lang]);

  return (
    <div>
      <MixedRightThreeImagesSection
        lang={lang}
        dir={dir}
        data={wrapMixedRightThreeImagesContent(content, lang)}
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
                console.log("MixedRightThreeImages", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <MixedRightThreeImagesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(mixedRightThreeImagesData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
