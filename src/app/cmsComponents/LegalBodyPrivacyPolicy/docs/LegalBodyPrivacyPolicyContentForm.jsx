"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const emptyPoint = () => ({ question: "", answer: "" });

export default function LegalBodyPrivacyPolicyContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection
        title="Cover"
        onReset={() => reset(["effectiveDate"])}
      >
        <InspectorField
          id="legal-privacy-date"
          label="Last updated"
          value={content.effectiveDate || ""}
          onChange={(value) => updateField("effectiveDate", value)}
        />
      </InspectorSection>

      <InspectorSection
        title="Introduction"
        onReset={() => reset(["introTitle", "introContent"])}
      >
        <InspectorField
          id="legal-privacy-intro-title"
          label="Title"
          value={content.introTitle || ""}
          onChange={(value) => updateField("introTitle", value)}
        />
        <InspectorField
          id="legal-privacy-intro-content"
          label="Copy"
          value={content.introContent || ""}
          onChange={(value) => updateField("introContent", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection
        title="Summary"
        onReset={() =>
          reset(["tocTitle", "infoCollectedLabel", "shareSituationsLabel", "summaryPoints"])
        }
      >
        <InspectorField
          id="legal-privacy-toc"
          label="Table of contents title"
          value={content.tocTitle || ""}
          onChange={(value) => updateField("tocTitle", value)}
        />
        <InspectorField
          id="legal-privacy-collected-label"
          label="Info collected label"
          value={content.infoCollectedLabel || ""}
          onChange={(value) => updateField("infoCollectedLabel", value)}
        />
        <InspectorField
          id="legal-privacy-share-label"
          label="Share situations label"
          value={content.shareSituationsLabel || ""}
          onChange={(value) => updateField("shareSituationsLabel", value)}
        />
        <InspectorRepeater
          items={content.summaryPoints || []}
          createItem={emptyPoint}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(summaryPoints) => onChange({ ...content, summaryPoints })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`legal-privacy-point-${index}-q`}
                label="Question"
                value={item.question || ""}
                onChange={(value) => update("question", value)}
              />
              <InspectorField
                id={`legal-privacy-point-${index}-a`}
                label="Answer"
                value={item.answer || ""}
                onChange={(value) => update("answer", value)}
                multiline
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
