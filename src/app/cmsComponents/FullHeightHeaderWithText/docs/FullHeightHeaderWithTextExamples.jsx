"use client";

import { useEffect, useState } from "react";
import { FullHeightHeaderWithTextSection } from "@/app/cmsComponents/FullHeightHeaderWithText";
import FullHeightHeaderWithTextPropsForm from "@/app/cmsComponents/FullHeightHeaderWithText/docs/FullHeightHeaderWithTextPropsForm";
import {
  getFullHeightHeaderWithTextEditorContent,
  wrapFullHeightHeaderWithTextContent,
} from "@/app/cmsComponents/FullHeightHeaderWithText/utils/helpers";
import { DEFAULT_FULL_HEIGHT_HEADER_STYLE } from "@/app/cmsComponents/FullHeightHeaderWithText/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  isExternalHref,
  isInternalPage,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorLink(href) {
  if (!href) {
    return resolveEditorLink(href);
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
  const content = getFullHeightHeaderWithTextEditorContent(data, lang, "gb");
  const link = toEditorLink(content.buttonHref);

  return {
    ...content,
    buttonHref: link.href,
    buttonLinkType: link.type,
  };
}

export default function FullHeightHeaderWithTextExamples({
  ctx,
  name = "FullHeightHeaderWithText",
}) {
  const { lang, dir, fullHeightHeaderWithTextData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FULL_HEIGHT_HEADER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(fullHeightHeaderWithTextData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(fullHeightHeaderWithTextData, lang));
  }, [fullHeightHeaderWithTextData, lang]);

  return (
    <div>
      <FullHeightHeaderWithTextSection
        lang={lang}
        dir={dir}
        data={wrapFullHeightHeaderWithTextContent(content, lang)}
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
                console.log("FullHeightHeaderWithText", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <FullHeightHeaderWithTextPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(fullHeightHeaderWithTextData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
