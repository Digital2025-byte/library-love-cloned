"use client";

import { useEffect, useState } from "react";
import { SectionWithAnimatedImagesSection } from "@/app/cmsComponents/SectionWithAnimatedImages";
import SectionWithAnimatedImagesPropsForm from "@/app/cmsComponents/SectionWithAnimatedImages/docs/SectionWithAnimatedImagesPropsForm";
import {
  getSectionWithAnimatedImagesEditorContent,
  wrapSectionWithAnimatedImagesContent,
} from "@/app/cmsComponents/SectionWithAnimatedImages/utils/helpers";
import { DEFAULT_ANIMATED_IMAGES_STYLE } from "@/app/cmsComponents/SectionWithAnimatedImages/utils/style";
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
  const content = getSectionWithAnimatedImagesEditorContent(data, lang);
  const link = toEditorLink(content.ctaHref);

  return {
    ...content,
    ctaHref: link.href,
    ctaLinkType: link.type,
  };
}

export default function SectionWithAnimatedImagesExamples({
  ctx,
  name = "SectionWithAnimatedImages",
}) {
  const { lang, dir, sectionWithAnimatedImagesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_ANIMATED_IMAGES_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(sectionWithAnimatedImagesData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(sectionWithAnimatedImagesData, lang));
  }, [sectionWithAnimatedImagesData, lang]);

  return (
    <div>
      <SectionWithAnimatedImagesSection
        lang={lang}
        dir={dir}
        data={wrapSectionWithAnimatedImagesContent(content, lang)}
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
                console.log("SectionWithAnimatedImages", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <SectionWithAnimatedImagesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(
            sectionWithAnimatedImagesData,
            lang
          )}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
