"use client";

import { useEffect, useState } from "react";
import { PhotoTileGridSection } from "@/app/cmsComponents/PhotoTileGrid";
import PhotoTileGridPropsForm from "@/app/cmsComponents/PhotoTileGrid/docs/PhotoTileGridPropsForm";
import {
  getPhotoTileGridEditorContent,
  wrapPhotoTileGridContent,
} from "@/app/cmsComponents/PhotoTileGrid/utils/helpers";
import { DEFAULT_PHOTO_TILE_GRID_STYLE } from "@/app/cmsComponents/PhotoTileGrid/utils/style";
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
  const content = getPhotoTileGridEditorContent(data, lang);

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

export default function PhotoTileGridExamples({
  ctx,
  name = "PhotoTileGrid",
}) {
  const { lang, dir, photoTileGridData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_PHOTO_TILE_GRID_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(photoTileGridData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(photoTileGridData, lang));
  }, [photoTileGridData, lang]);

  return (
    <div>
      <PhotoTileGridSection
        lang={lang}
        dir={dir}
        data={wrapPhotoTileGridContent(content, lang)}
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
              onClick={() => console.log("PhotoTileGrid", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <PhotoTileGridPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(photoTileGridData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
