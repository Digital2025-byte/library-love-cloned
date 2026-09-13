"use client";

import { useEffect, useState } from "react";
import { PageHeroSection } from "@/app/cmsComponents/PageHero";
import PageHeroPropsForm from "@/app/cmsComponents/PageHero/docs/PageHeroPropsForm";
import {
  getPageHeroEditorContent,
  wrapPageHeroContent,
} from "@/app/cmsComponents/PageHero/utils/helpers";
import { DEFAULT_PAGE_HERO_STYLE } from "@/app/cmsComponents/PageHero/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getPageHeroEditorContent(data, lang);
}

export default function PageHeroExamples({ ctx, name = "PageHero" }) {
  const { lang, dir, pageHeroData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_PAGE_HERO_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(pageHeroData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(pageHeroData, lang));
  }, [pageHeroData, lang]);

  return (
    <div>
      <PageHeroSection
        lang={lang}
        dir={dir}
        data={wrapPageHeroContent(content, lang)}
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
              onClick={() => console.log("PageHero", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <PageHeroPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(pageHeroData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
