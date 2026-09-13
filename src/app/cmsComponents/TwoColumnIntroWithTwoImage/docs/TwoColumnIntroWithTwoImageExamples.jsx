"use client";

import { useEffect, useState } from "react";
import { TwoColumnIntroWithTwoImageSection } from "@/app/cmsComponents/TwoColumnIntroWithTwoImage";
import TwoColumnIntroWithTwoImagePropsForm from "@/app/cmsComponents/TwoColumnIntroWithTwoImage/docs/TwoColumnIntroWithTwoImagePropsForm";
import {
  getTwoColumnIntroEditorContent,
  wrapTwoColumnIntroContent,
} from "@/app/cmsComponents/TwoColumnIntroWithTwoImage/utils/helpers";
import { DEFAULT_TWO_COLUMN_INTRO_STYLE } from "@/app/cmsComponents/TwoColumnIntroWithTwoImage/utils/style";
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
  const content = getTwoColumnIntroEditorContent(data, lang);
  const link = toEditorLink(content.ctaHref);

  return {
    ...content,
    ctaHref: link.href,
    ctaLinkType: link.type,
  };
}

export default function TwoColumnIntroWithTwoImageExamples({
  ctx,
  name = "TwoColumnIntroWithTwoImage",
}) {
  const { lang, dir, twoColumnIntroData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TWO_COLUMN_INTRO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(twoColumnIntroData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(twoColumnIntroData, lang));
  }, [twoColumnIntroData, lang]);

  return (
    <div>
      <TwoColumnIntroWithTwoImageSection
        lang={lang}
        dir={dir}
        data={wrapTwoColumnIntroContent(content, lang)}
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
                console.log("TwoColumnIntroWithTwoImage", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <TwoColumnIntroWithTwoImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(twoColumnIntroData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
