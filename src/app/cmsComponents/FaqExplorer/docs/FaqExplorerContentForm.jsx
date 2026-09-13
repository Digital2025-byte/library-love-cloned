"use client";

import {
  InspectorButtonSection,
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const BROWSE_KEYS = ["browseLabel", "browseHref", "browseLinkType"];

const emptyQuestion = () => ({ question: "", answer: "" });
const emptyCategory = () => ({ label: "", questions: [emptyQuestion()] });

export default function FaqExplorerContentForm({ content, onChange, defaults }) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Heading" onReset={() => reset(["title"])}>
        <InspectorField
          id="faq-explorer-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
      </InspectorSection>

      <InspectorSection title="Categories" onReset={() => reset(["categories"])}>
        <InspectorRepeater
          items={content.categories || []}
          createItem={emptyCategory}
          itemLabel={(item, index) => item.label || `Category ${index + 1}`}
          addLabel="Add Category"
          titleKey="label"
          titlePlaceholder="Category name"
          onChange={(categories) => onChange({ ...content, categories })}
        >
          {(cat, { index, update }) => (
            <>
              <InspectorField
                id={`faq-explorer-${index}-label`}
                label="Category name"
                value={cat.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorRepeater
                items={cat.questions || []}
                createItem={emptyQuestion}
                itemLabel={(q, qIndex) => q.question || `Q ${qIndex + 1}`}
                addLabel="Add Question"
                titleKey="question"
                titlePlaceholder="Question"
                onChange={(questions) => update("questions", questions)}
              >
                {(q, { index: qIndex, update: updateQ }) => (
                  <>
                    <InspectorField
                      id={`faq-${index}-${qIndex}-question`}
                      label="Question"
                      value={q.question || ""}
                      onChange={(value) => updateQ("question", value)}
                    />
                    <InspectorField
                      id={`faq-${index}-${qIndex}-answer`}
                      label="Answer"
                      value={q.answer || ""}
                      onChange={(value) => updateQ("answer", value)}
                      multiline
                    />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorButtonSection
        idPrefix="faq-explorer-browse"
        heading="Browse button"
        label={content.browseLabel}
        href={content.browseHref}
        linkType={content.browseLinkType}
        onLabelChange={(value) => updateField("browseLabel", value)}
        onLinkChange={({ type, href }) =>
          onChange({ ...content, browseLinkType: type, browseHref: href })
        }
        onReset={() => reset(BROWSE_KEYS)}
      />
    </div>
  );
}
