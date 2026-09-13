"use client";

import { useEffect, useState } from "react";
import { CitiesSectionsSection } from "@/app/cmsComponents/CitiesSections";
import CitiesSectionsPropsForm from "@/app/cmsComponents/CitiesSections/docs/CitiesSectionsPropsForm";
import {
  getCitiesSectionsEditorContent,
  wrapCitiesSectionsContent,
} from "@/app/cmsComponents/CitiesSections/utils/helpers";
import { DEFAULT_CITIES_SECTIONS_STYLE } from "@/app/cmsComponents/CitiesSections/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  isExternalHref,
  isInternalPage,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorLink(href) {
  if (!href || href === "#") {
    return { type: "external", href: href || "" };
  }
  if (isExternalHref(href) || isInternalPage(href)) {
    return resolveEditorLink(href);
  }
  if (String(href).startsWith("/")) {
    return { type: "external", href };
  }
  return resolveEditorLink(href);
}

function toEditorContent(data, lang) {
  const content = getCitiesSectionsEditorContent(data, lang);
  const link = toEditorLink(content.ctaHref);

  return {
    ...content,
    ctaHref: link.href,
    ctaLinkType: link.type,
  };
}

export default function CitiesSectionsExamples({
  ctx,
  name = "CitiesSections",
}) {
  const { lang, dir, citiesSectionsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CITIES_SECTIONS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(citiesSectionsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(citiesSectionsData, lang));
  }, [citiesSectionsData, lang]);

  return (
    <div>
      <CitiesSectionsSection
        lang={lang}
        dir={dir}
        data={wrapCitiesSectionsContent(content, lang)}
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
              onClick={() => console.log("CitiesSections", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <CitiesSectionsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(citiesSectionsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
