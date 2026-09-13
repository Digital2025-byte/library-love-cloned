"use client";

import { useEffect, useState } from "react";
import { HelpCategoriesSection } from "@/app/cmsComponents/HelpCategories";
import HelpCategoriesPropsForm from "@/app/cmsComponents/HelpCategories/docs/HelpCategoriesPropsForm";
import {
  getHelpCategoriesEditorContent,
  wrapHelpCategoriesContent,
} from "@/app/cmsComponents/HelpCategories/utils/helpers";
import { DEFAULT_HELP_CATEGORIES_STYLE } from "@/app/cmsComponents/HelpCategories/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getHelpCategoriesEditorContent(data, lang);
}

export default function HelpCategoriesExamples({
  ctx,
  name = "HelpCategories",
}) {
  const { lang, dir, helpCategoriesData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_HELP_CATEGORIES_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(helpCategoriesData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(helpCategoriesData, lang));
  }, [helpCategoriesData, lang]);

  return (
    <div>
      <HelpCategoriesSection
        lang={lang}
        dir={dir}
        data={wrapHelpCategoriesContent(content, lang)}
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
              onClick={() => console.log("HelpCategories", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <HelpCategoriesPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(helpCategoriesData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
