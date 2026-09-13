"use client";

import { useEffect, useState } from "react";
import { DataTableWithImageSection } from "@/app/cmsComponents/DataTableWithImage";
import DataTableWithImagePropsForm from "@/app/cmsComponents/DataTableWithImage/docs/DataTableWithImagePropsForm";
import {
  getDataTableWithImageEditorContent,
  wrapDataTableWithImageContent,
} from "@/app/cmsComponents/DataTableWithImage/utils/helpers";
import { DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE } from "@/app/cmsComponents/DataTableWithImage/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getDataTableWithImageEditorContent(data, lang);
}

export default function DataTableWithImageExamples({
  ctx,
  name = "DataTableWithImage",
}) {
  const { lang, dir, dataTableWithImageData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_DATA_TABLE_WITH_IMAGE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(dataTableWithImageData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(dataTableWithImageData, lang));
  }, [dataTableWithImageData, lang]);

  return (
    <div>
      <DataTableWithImageSection
        lang={lang}
        dir={dir}
        data={wrapDataTableWithImageContent(content, lang)}
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
                console.log("DataTableWithImage", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <DataTableWithImagePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(dataTableWithImageData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
