"use client";

import { useEffect, useState } from "react";
import { SearchConsoleSection } from "@/app/cmsComponents/SearchConsole";
import SearchConsolePropsForm from "@/app/cmsComponents/SearchConsole/docs/SearchConsolePropsForm";
import {
  getSearchConsoleEditorContent,
  wrapSearchConsoleContent,
} from "@/app/cmsComponents/SearchConsole/utils/helpers";
import { DEFAULT_SEARCH_CONSOLE_STYLE } from "@/app/cmsComponents/SearchConsole/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getSearchConsoleEditorContent(data, lang);
}

export default function SearchConsoleExamples({ ctx, name = "SearchConsole" }) {
  const { lang, dir, searchConsoleData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SEARCH_CONSOLE_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(searchConsoleData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(searchConsoleData, lang));
  }, [searchConsoleData, lang]);

  return (
    <div>
      <SearchConsoleSection
        lang={lang}
        dir={dir}
        data={wrapSearchConsoleContent(content, lang)}
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
              onClick={() => console.log("SearchConsole", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <SearchConsolePropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(searchConsoleData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
