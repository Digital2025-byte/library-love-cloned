"use client";

import { useEffect, useState } from "react";
import { FormHeaderSection } from "@/app/cmsComponents/FormHeader";
import FormHeaderPropsForm from "@/app/cmsComponents/FormHeader/docs/FormHeaderPropsForm";
import {
  getFormHeaderEditorContent,
  wrapFormHeaderContent,
} from "@/app/cmsComponents/FormHeader/utils/helpers";
import { DEFAULT_FORM_HEADER_STYLE } from "@/app/cmsComponents/FormHeader/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getFormHeaderEditorContent(data, lang);
}

export default function FormHeaderExamples({ ctx, name = "FormHeader" }) {
  const { lang, dir, formHeaderData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FORM_HEADER_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(formHeaderData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(formHeaderData, lang));
  }, [formHeaderData, lang]);

  return (
    <div>
      <FormHeaderSection
        lang={lang}
        dir={dir}
        data={wrapFormHeaderContent(content, lang)}
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
              onClick={() => console.log("FormHeader", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <FormHeaderPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(formHeaderData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
