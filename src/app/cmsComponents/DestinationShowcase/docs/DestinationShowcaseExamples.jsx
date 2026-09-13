"use client";

import { useEffect, useState } from "react";
import { DestinationShowcaseSection } from "@/app/cmsComponents/DestinationShowcase";
import DestinationShowcasePropsForm from "@/app/cmsComponents/DestinationShowcase/docs/DestinationShowcasePropsForm";
import {
  getDestinationShowcaseEditorContent,
  wrapDestinationShowcaseContent,
} from "@/app/cmsComponents/DestinationShowcase/utils/helpers";
import { DEFAULT_DESTINATION_SHOWCASE_STYLE } from "@/app/cmsComponents/DestinationShowcase/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  const content = getDestinationShowcaseEditorContent(data, lang, {
    posParams: "gb",
  });
  const link = resolveEditorLink(content.viewAllHref);

  return {
    ...content,
    viewAllHref: link.href,
    viewAllLinkType: link.type,
  };
}

export default function DestinationShowcaseExamples({
  ctx,
  name = "DestinationShowcase",
}) {
  const { lang, dir, destinationShowcaseData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_DESTINATION_SHOWCASE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(destinationShowcaseData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(destinationShowcaseData, lang));
  }, [destinationShowcaseData, lang]);

  return (
    <div>
      <DestinationShowcaseSection
        lang={lang}
        dir={dir}
        data={wrapDestinationShowcaseContent(content, lang)}
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
                console.log("DestinationShowcase", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <DestinationShowcasePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(destinationShowcaseData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
