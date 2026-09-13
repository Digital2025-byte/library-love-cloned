"use client";

import { useEffect, useState } from "react";
import { FormsDirectorySection } from "@/app/cmsComponents/FormsDirectory";
import FormsDirectoryPropsForm from "@/app/cmsComponents/FormsDirectory/docs/FormsDirectoryPropsForm";
import {
  getFormsDirectoryEditorContent,
  wrapFormsDirectoryContent,
} from "@/app/cmsComponents/FormsDirectory/utils/helpers";
import { DEFAULT_FORMS_DIRECTORY_STYLE } from "@/app/cmsComponents/FormsDirectory/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getFormsDirectoryEditorContent(data, lang);
}

export default function FormsDirectoryExamples({
  ctx,
  name = "FormsDirectory",
}) {
  const { lang, dir, formsDirectoryData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_FORMS_DIRECTORY_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(formsDirectoryData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(formsDirectoryData, lang));
  }, [formsDirectoryData, lang]);

  return (
    <div>
      <FormsDirectorySection
        lang={lang}
        dir={dir}
        data={wrapFormsDirectoryContent(content, lang)}
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
                console.log("FormsDirectory", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <FormsDirectoryPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(formsDirectoryData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
