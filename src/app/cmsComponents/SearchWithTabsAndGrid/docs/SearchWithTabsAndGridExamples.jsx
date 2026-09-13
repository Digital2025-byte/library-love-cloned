"use client";

import { useEffect, useState } from "react";
import { SearchWithTabsAndGridSection } from "@/app/cmsComponents/SearchWithTabsAndGrid";
import SearchWithTabsAndGridPropsForm from "@/app/cmsComponents/SearchWithTabsAndGrid/docs/SearchWithTabsAndGridPropsForm";
import {
  getSearchWithTabsAndGridEditorContent,
  wrapSearchWithTabsAndGridContent,
} from "@/app/cmsComponents/SearchWithTabsAndGrid/utils/helpers";
import { DEFAULT_SEARCH_GRID_STYLE } from "@/app/cmsComponents/SearchWithTabsAndGrid/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getSearchWithTabsAndGridEditorContent(data, lang);
}

export default function SearchWithTabsAndGridExamples({
  ctx,
  name = "SearchWithTabsAndGrid",
}) {
  const { lang, dir, searchWithTabsAndGridData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_SEARCH_GRID_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(searchWithTabsAndGridData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(searchWithTabsAndGridData, lang));
  }, [searchWithTabsAndGridData, lang]);

  return (
    <div>
      <SearchWithTabsAndGridSection
        lang={lang}
        dir={dir}
        data={wrapSearchWithTabsAndGridContent(content, lang)}
        style={style}
        posParams="gb"
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
                console.log("SearchWithTabsAndGrid", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <SearchWithTabsAndGridPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(searchWithTabsAndGridData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
