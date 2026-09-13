"use client";

import { useEffect, useState } from "react";
import { HeaderWithCityInfoSection } from "@/app/cmsComponents/HeaderWithCityInfo";
import HeaderWithCityInfoPropsForm from "@/app/cmsComponents/HeaderWithCityInfo/docs/HeaderWithCityInfoPropsForm";
import {
  getHeaderWithCityInfoEditorContent,
  wrapHeaderWithCityInfoContent,
} from "@/app/cmsComponents/HeaderWithCityInfo/utils/helpers";
import { DEFAULT_HEADER_WITH_CITY_INFO_STYLE } from "@/app/cmsComponents/HeaderWithCityInfo/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getHeaderWithCityInfoEditorContent(data, lang);
}

export default function HeaderWithCityInfoExamples({
  ctx,
  name = "HeaderWithCityInfo",
}) {
  const { lang, dir, headerWithCityInfoData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_HEADER_WITH_CITY_INFO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(headerWithCityInfoData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(headerWithCityInfoData, lang));
  }, [headerWithCityInfoData, lang]);

  return (
    <div>
      <HeaderWithCityInfoSection
        lang={lang}
        dir={dir}
        data={wrapHeaderWithCityInfoContent(content, lang)}
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
                console.log("HeaderWithCityInfo", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <HeaderWithCityInfoPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(headerWithCityInfoData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
