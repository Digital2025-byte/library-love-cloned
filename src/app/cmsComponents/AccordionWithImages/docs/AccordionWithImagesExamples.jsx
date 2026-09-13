"use client";

import { useEffect, useState } from "react";
import { AccordionWithImagesSection } from "@/app/cmsComponents/AccordionWithImages";
import AccordionWithImagesPropsForm from "@/app/cmsComponents/AccordionWithImages/docs/AccordionWithImagesPropsForm";
import {
  getAccordionImagesEditorContent,
  wrapAccordionImagesContent,
} from "@/app/cmsComponents/AccordionWithImages/utils/helpers";
import { DEFAULT_ACCORDION_IMAGES_STYLE } from "@/app/cmsComponents/AccordionWithImages/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

export default function AccordionWithImagesExamples({
  ctx,
  name = "AccordionWithImages",
}) {
  const { lang, dir, accordionWithImagesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_ACCORDION_IMAGES_STYLE);
  const [content, setContent] = useState(() =>
    getAccordionImagesEditorContent(accordionWithImagesData)
  );

  useEffect(() => {
    setContent(getAccordionImagesEditorContent(accordionWithImagesData));
  }, [accordionWithImagesData]);

  return (
    <div>
      <AccordionWithImagesSection
        lang={lang}
        dir={dir}
        data={wrapAccordionImagesContent(content)}
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
                console.log("AccordionWithImages", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <AccordionWithImagesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={getAccordionImagesEditorContent(
            accordionWithImagesData
          )}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
