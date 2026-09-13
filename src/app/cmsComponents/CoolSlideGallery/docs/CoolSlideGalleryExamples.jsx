"use client";

import { useEffect, useState } from "react";
import { CoolSlideGallerySection } from "@/app/cmsComponents/CoolSlideGallery";
import CoolSlideGalleryPropsForm from "@/app/cmsComponents/CoolSlideGallery/docs/CoolSlideGalleryPropsForm";
import {
  getCoolSlideGalleryEditorContent,
  wrapCoolSlideGalleryContent,
} from "@/app/cmsComponents/CoolSlideGallery/utils/helpers";
import { DEFAULT_COOL_SLIDE_GALLERY_STYLE } from "@/app/cmsComponents/CoolSlideGallery/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(lang) {
  return getCoolSlideGalleryEditorContent(undefined, lang);
}

export default function CoolSlideGalleryExamples({
  ctx,
  name = "CoolSlideGallery",
}) {
  const { lang } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_COOL_SLIDE_GALLERY_STYLE);
  const [content, setContent] = useState(() => toEditorContent(lang));

  useEffect(() => {
    setContent(toEditorContent(lang));
  }, [lang]);

  return (
    <div>
      <CoolSlideGallerySection
        lang={lang}
        data={wrapCoolSlideGalleryContent(content, lang)}
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
                console.log("CoolSlideGallery", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <CoolSlideGalleryPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
