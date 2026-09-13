"use client";

import { useEffect, useState } from "react";
import { AccordionWithContentSection } from "@/app/cmsComponents/AccordionWithContent";
import AccordionWithContentPropsForm from "@/app/cmsComponents/AccordionWithContent/docs/AccordionWithContentPropsForm";
import {
  getAccordionEditorContent,
  wrapAccordionContent,
} from "@/app/cmsComponents/AccordionWithContent/utils/helpers";
import { DEFAULT_ACCORDION_STYLE } from "@/app/cmsComponents/AccordionWithContent/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data) {
  const content = getAccordionEditorContent(data);
  const link = resolveEditorLink(content.buttonHref);

  return {
    ...content,
    buttonLinkType: link.type,
    buttonHref: link.href,
  };
}

export default function AccordionWithContentExamples({
  ctx,
  name = "AccordionWithContent",
}) {
  const { lang, dir, accordionData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_ACCORDION_STYLE);
  const [content, setContent] = useState(() => toEditorContent(accordionData));

  useEffect(() => {
    setContent(toEditorContent(accordionData));
  }, [accordionData]);

  return (
    <div>
      <AccordionWithContentSection
        lang={lang}
        dir={dir}
        data={wrapAccordionContent(content)}
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
                console.log("AccordionWithContent", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <AccordionWithContentPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(accordionData)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
