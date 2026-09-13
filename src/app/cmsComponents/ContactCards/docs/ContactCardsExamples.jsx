"use client";

import { useEffect, useState } from "react";
import { ContactCardsSection } from "@/app/cmsComponents/ContactCards";
import ContactCardsPropsForm from "@/app/cmsComponents/ContactCards/docs/ContactCardsPropsForm";
import {
  getContactCardsEditorContent,
  wrapContactCardsContent,
} from "@/app/cmsComponents/ContactCards/utils/helpers";
import { DEFAULT_CONTACT_CARDS_STYLE } from "@/app/cmsComponents/ContactCards/utils/style";
import { InspectorFooter, InspectorSubmitButton } from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  return getContactCardsEditorContent(data, lang);
}

export default function ContactCardsExamples({ ctx, name = "ContactCards" }) {
  const { lang, dir, contactCardsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_CONTACT_CARDS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(contactCardsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(contactCardsData, lang));
  }, [contactCardsData, lang]);

  return (
    <div>
      <ContactCardsSection
        lang={lang}
        dir={dir}
        data={wrapContactCardsContent(content, lang)}
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
              onClick={() => console.log("ContactCards", { content, style })}
            />
          </InspectorFooter>
        }
      >
        <ContactCardsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(contactCardsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
