"use client";

import { useEffect, useState } from "react";
import { MealsDescriptionTabbedSection } from "@/app/cmsComponents/MealsDescriptionTabbed";
import MealsDescriptionTabbedPropsForm from "@/app/cmsComponents/MealsDescriptionTabbed/docs/MealsDescriptionTabbedPropsForm";
import {
  getMealsDescriptionTabbedEditorContent,
  wrapMealsDescriptionTabbedContent,
} from "@/app/cmsComponents/MealsDescriptionTabbed/utils/helpers";
import { DEFAULT_MEALS_TABBED_STYLE } from "@/app/cmsComponents/MealsDescriptionTabbed/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getMealsDescriptionTabbedEditorContent(data, lang);
}

export default function MealsDescriptionTabbedExamples({
  ctx,
  name = "MealsDescriptionTabbed",
}) {
  const { lang, dir, mealsDescriptionTabbedData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_MEALS_TABBED_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(mealsDescriptionTabbedData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(mealsDescriptionTabbedData, lang));
  }, [mealsDescriptionTabbedData, lang]);

  return (
    <div>
      <MealsDescriptionTabbedSection
        lang={lang}
        dir={dir}
        data={wrapMealsDescriptionTabbedContent(content, lang)}
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
                console.log("MealsDescriptionTabbed", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <MealsDescriptionTabbedPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(mealsDescriptionTabbedData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
