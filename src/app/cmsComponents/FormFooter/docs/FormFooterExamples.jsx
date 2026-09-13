"use client";

import { useEffect, useState } from "react";
import { FormFooterSection } from "@/app/cmsComponents/FormFooter";
import FormFooterPropsForm from "@/app/cmsComponents/FormFooter/docs/FormFooterPropsForm";
import {
  getFormFooterEditorContent,
  wrapFormFooterContent,
} from "@/app/cmsComponents/FormFooter/utils/helpers";
import { DEFAULT_FORM_FOOTER_STYLE } from "@/app/cmsComponents/FormFooter/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getFormFooterEditorContent(data, lang);
}

export default function FormFooterExamples({ ctx, name = "FormFooter" }) {
  const { lang, dir, formFooterData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FORM_FOOTER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(formFooterData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(formFooterData, lang));
  }, [formFooterData, lang]);

  return (
    <div>
      <FormFooterSection
        lang={lang}
        dir={dir}
        data={wrapFormFooterContent(content, lang)}
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
              onClick={() => console.log("FormFooter", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <FormFooterPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(formFooterData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
