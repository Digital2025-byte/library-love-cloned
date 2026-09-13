"use client";

import { useEffect, useState } from "react";
import { TwoColumnWithSubSectionsSection } from "@/app/cmsComponents/TwoColumnWithSubSections";
import TwoColumnWithSubSectionsPropsForm from "@/app/cmsComponents/TwoColumnWithSubSections/docs/TwoColumnWithSubSectionsPropsForm";
import {
  getTwoColumnWithSubSectionsEditorContent,
  wrapTwoColumnWithSubSectionsContent,
} from "@/app/cmsComponents/TwoColumnWithSubSections/utils/helpers";
import { DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE } from "@/app/cmsComponents/TwoColumnWithSubSections/utils/style";
import {
  InspectorFooter,
  InspectorSubmitButton,
  resolveEditorLink,
} from "@/components/inspector";
import Drawer, { useDrawer } from "@/components/ui/Drawer";

function toEditorContent(data, lang) {
  const content = getTwoColumnWithSubSectionsEditorContent(data, lang);
  const link = resolveEditorLink(content.ctaHref);

  return {
    ...content,
    ctaLinkType: link.type,
    ctaHref: link.href,
  };
}

export default function TwoColumnWithSubSectionsExamples({
  ctx,
  name = "TwoColumnWithSubSections",
}) {
  const { lang, dir, twoColumnWithSubSectionsData } = ctx;
  const drawer = useDrawer();
  const [style, setStyle] = useState(DEFAULT_TWO_COLUMN_SUB_SECTIONS_STYLE);
  const [content, setContent] = useState(() =>
    toEditorContent(twoColumnWithSubSectionsData, lang)
  );

  useEffect(() => {
    setContent(toEditorContent(twoColumnWithSubSectionsData, lang));
  }, [twoColumnWithSubSectionsData, lang]);

  return (
    <div>
      <TwoColumnWithSubSectionsSection
        lang={lang}
        dir={dir}
        data={wrapTwoColumnWithSubSectionsContent(content, lang)}
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
                console.log("TwoColumnWithSubSections", { content, style })
              }
            />
          </InspectorFooter>
        }
      >
        <TwoColumnWithSubSectionsPropsForm
          content={content}
          onContentChange={setContent}
          contentDefaults={toEditorContent(twoColumnWithSubSectionsData, lang)}
          style={style}
          onStyleChange={setStyle}
        />
      </Drawer>
    </div>
  );
}
