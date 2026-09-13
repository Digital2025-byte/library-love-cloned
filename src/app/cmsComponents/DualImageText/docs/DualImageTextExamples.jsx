"use client";

import { useEffect, useState } from "react";
import { DualImageTextSection } from "@/app/cmsComponents/DualImageText";
import DualImageTextPropsForm from "@/app/cmsComponents/DualImageText/docs/DualImageTextPropsForm";
import {
  getDualImageTextEditorContent,
  wrapDualImageTextContent,
} from "@/app/cmsComponents/DualImageText/utils/helpers";
import { DEFAULT_DUAL_IMAGE_TEXT_STYLE } from "@/app/cmsComponents/DualImageText/utils/style";
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
  const content = getDualImageTextEditorContent(data, lang);
  const explore = toEditorLink(content.exploreHref);

  return {
    ...content,
    exploreHref: explore.href,
    exploreLinkType: explore.type,
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

export default function DualImageTextExamples({
  ctx,
  name = "DualImageText",
}) {
  const { lang, dir, dualImageTextData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_DUAL_IMAGE_TEXT_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(dualImageTextData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(dualImageTextData, lang));
  }, [dualImageTextData, lang]);

  return (
    <div>
      <DualImageTextSection
        lang={lang}
        dir={dir}
        data={wrapDualImageTextContent(content, lang)}
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
              onClick={() => console.log("DualImageText", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <DualImageTextPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(dualImageTextData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
