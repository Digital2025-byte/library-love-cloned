"use client";

import {
  InspectorTitleSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";

const TITLE_KEYS = ["title", "description"];

export default function ParagraphContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorTitleSection
        idPrefix="paragraph"
        title={content.title}
        description={content.description}
        onTitleChange={(value) => updateField("title", value)}
        onDescriptionChange={(value) => updateField("description", value)}
        onReset={() => reset(TITLE_KEYS)}
      />

      <BacklinksEditor
        idPrefix="paragraph-link"
        links={content.links || []}
        sourceText={content.description || ""}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
        showReset
      />
    </div>
  );
}
