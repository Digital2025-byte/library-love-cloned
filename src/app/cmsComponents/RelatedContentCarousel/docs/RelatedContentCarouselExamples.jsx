"use client";

import { useEffect, useState } from "react";
import { RelatedContentCarouselSection } from "@/app/cmsComponents/RelatedContentCarousel";
import RelatedContentCarouselPropsForm from "@/app/cmsComponents/RelatedContentCarousel/docs/RelatedContentCarouselPropsForm";
import {
  getRelatedContentCarouselEditorContent,
  wrapRelatedContentCarouselContent,
} from "@/app/cmsComponents/RelatedContentCarousel/utils/helpers";
import { DEFAULT_RELATED_CONTENT_STYLE } from "@/app/cmsComponents/RelatedContentCarousel/utils/style";
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
  const content = getRelatedContentCarouselEditorContent(data, lang, "gb");

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

export default function RelatedContentCarouselExamples({
  ctx,
  name = "RelatedContentCarousel",
}) {
  const { lang, dir, relatedContentCarouselData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_RELATED_CONTENT_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(relatedContentCarouselData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(relatedContentCarouselData, lang));
  }, [relatedContentCarouselData, lang]);

  return (
    <div>
      <RelatedContentCarouselSection
        lang={lang}
        dir={dir}
        data={wrapRelatedContentCarouselContent(content, lang)}
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
                console.log("RelatedContentCarousel", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <RelatedContentCarouselPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(relatedContentCarouselData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
