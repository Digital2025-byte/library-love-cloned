"use client";

import { useEffect, useState } from "react";
import { FaqExplorerSection } from "@/app/cmsComponents/FaqExplorer";
import FaqExplorerPropsForm from "@/app/cmsComponents/FaqExplorer/docs/FaqExplorerPropsForm";
import {
  getFaqExplorerEditorContent,
  wrapFaqExplorerContent,
} from "@/app/cmsComponents/FaqExplorer/utils/helpers";
import { DEFAULT_FAQ_EXPLORER_STYLE } from "@/app/cmsComponents/FaqExplorer/utils/style";
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
  const content = getFaqExplorerEditorContent(data, lang);
  const link = toEditorLink(content.browseHref);
  return { ...content, browseHref: link.href, browseLinkType: link.type };
}

export default function FaqExplorerExamples({ ctx, name = "FaqExplorer" }) {
  const { lang, dir, faqExplorerData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FAQ_EXPLORER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(faqExplorerData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(faqExplorerData, lang));
  }, [faqExplorerData, lang]);

  return (
    <div>
      <FaqExplorerSection
        lang={lang}
        dir={dir}
        data={wrapFaqExplorerContent(content, lang)}
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
              onClick={() => console.log("FaqExplorer", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <FaqExplorerPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(faqExplorerData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
