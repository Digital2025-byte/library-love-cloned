"use client";

import { useEffect, useState } from "react";
import { ConnectionStepsListSection } from "@/app/cmsComponents/ConnectionStepsList";
import ConnectionStepsListPropsForm from "@/app/cmsComponents/ConnectionStepsList/docs/ConnectionStepsListPropsForm";
import {
  getConnectionStepsListEditorContent,
  wrapConnectionStepsListContent,
} from "@/app/cmsComponents/ConnectionStepsList/utils/helpers";
import { DEFAULT_CONNECTION_STEPS_STYLE } from "@/app/cmsComponents/ConnectionStepsList/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getConnectionStepsListEditorContent(data, lang);
}

export default function ConnectionStepsListExamples({
  ctx,
  name = "ConnectionStepsList",
}) {
  const { lang, dir, connectionStepsListData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CONNECTION_STEPS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(connectionStepsListData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(connectionStepsListData, lang));
  }, [connectionStepsListData, lang]);

  return (
    <div>
      <ConnectionStepsListSection
        lang={lang}
        dir={dir}
        data={wrapConnectionStepsListContent(content, lang)}
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
                console.log("ConnectionStepsList", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <ConnectionStepsListPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(connectionStepsListData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
