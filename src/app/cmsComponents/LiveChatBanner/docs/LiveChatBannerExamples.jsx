"use client";

import { useEffect, useState } from "react";
import { LiveChatBannerSection } from "@/app/cmsComponents/LiveChatBanner";
import LiveChatBannerPropsForm from "@/app/cmsComponents/LiveChatBanner/docs/LiveChatBannerPropsForm";
import {
  getLiveChatBannerEditorContent,
  wrapLiveChatBannerContent,
} from "@/app/cmsComponents/LiveChatBanner/utils/helpers";
import { DEFAULT_LIVE_CHAT_BANNER_STYLE } from "@/app/cmsComponents/LiveChatBanner/utils/style";
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
  const content = getLiveChatBannerEditorContent(data, lang, "gb");
  const link = toEditorLink(content.buttonHref);
  return { ...content, buttonHref: link.href, buttonLinkType: link.type };
}

export default function LiveChatBannerExamples({
  ctx,
  name = "LiveChatBanner",
}) {
  const { lang, dir, liveChatBannerData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_LIVE_CHAT_BANNER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(liveChatBannerData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(liveChatBannerData, lang));
  }, [liveChatBannerData, lang]);

  return (
    <div>
      <LiveChatBannerSection
        lang={lang}
        dir={dir}
        data={wrapLiveChatBannerContent(content, lang)}
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
              onClick={() => console.log("LiveChatBanner", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <LiveChatBannerPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(liveChatBannerData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
