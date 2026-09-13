"use client";

import { useEffect, useState } from "react";
import { OfficeDirectorySection } from "@/app/cmsComponents/OfficeDirectory";
import OfficeDirectoryPropsForm from "@/app/cmsComponents/OfficeDirectory/docs/OfficeDirectoryPropsForm";
import {
  getOfficeDirectoryEditorContent,
  wrapOfficeDirectoryContent,
} from "@/app/cmsComponents/OfficeDirectory/utils/helpers";
import { DEFAULT_OFFICE_DIRECTORY_STYLE } from "@/app/cmsComponents/OfficeDirectory/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getOfficeDirectoryEditorContent(data, lang);
}

export default function OfficeDirectoryExamples({
  ctx,
  name = "OfficeDirectory",
}) {
  const { lang, dir, officeDirectoryData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_OFFICE_DIRECTORY_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(officeDirectoryData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(officeDirectoryData, lang));
  }, [officeDirectoryData, lang]);

  return (
    <div>
      <OfficeDirectorySection
        lang={lang}
        dir={dir}
        data={wrapOfficeDirectoryContent(content, lang)}
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
                console.log("OfficeDirectory", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <OfficeDirectoryPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(officeDirectoryData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
