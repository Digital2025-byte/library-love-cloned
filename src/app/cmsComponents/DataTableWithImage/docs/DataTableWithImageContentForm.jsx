"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const TITLE_KEYS = ["title", "note"];
const HEADER_KEYS = ["headers"];
const ROW_KEYS = ["rows"];
const IMAGE_KEYS = ["imageUrl", "imageAlt"];

export default function DataTableWithImageContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => {
    onChange({ ...content, [key]: value });
  };
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));
  const headers = content.headers || [];

  return (
    <div>
      <InspectorSection title="Title" onReset={() => reset(TITLE_KEYS)}>
        <InspectorField
          id="data-table-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
        <InspectorField
          id="data-table-note"
          label="Note"
          value={content.note || ""}
          onChange={(value) => updateField("note", value)}
          multiline
        />
      </InspectorSection>

      <InspectorSection title="Headers" onReset={() => reset(HEADER_KEYS)}>
        <InspectorRepeater
          items={headers}
          createItem={() => ({ text: "" })}
          itemLabel={(item, index) => item.text || `Header ${index + 1}`}
          addLabel="Add Header"
          onChange={(nextHeaders) =>
            onChange({ ...content, headers: nextHeaders })
          }
        >
          {(item, { index, update }) => (
            <InspectorField
              id={`data-table-header-${index}`}
              label="Header"
              value={item.text || ""}
              onChange={(value) => update("text", value)}
            />
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Rows" onReset={() => reset(ROW_KEYS)}>
        <InspectorRepeater
          items={content.rows || []}
          createItem={() => ({
            cells: headers.map(() => ""),
          })}
          itemLabel={(item, index) => item.cells?.[0] || `Row ${index + 1}`}
          addLabel="Add Row"
          onChange={(rows) => onChange({ ...content, rows })}
        >
          {(item, { index, update }) => (
            <>
              {headers.map((header, cellIndex) => (
                <InspectorField
                  key={`${index}-${cellIndex}`}
                  id={`data-table-row-${index}-cell-${cellIndex}`}
                  label={header.text || `Column ${cellIndex + 1}`}
                  value={item.cells?.[cellIndex] || ""}
                  onChange={(value) => {
                    const cells = [...(item.cells || [])];
                    cells[cellIndex] = value;
                    update("cells", cells);
                  }}
                />
              ))}
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Image" onReset={() => reset(IMAGE_KEYS)}>
        <InspectorField
          id="data-table-image"
          label="Image URL"
          value={content.imageUrl || ""}
          onChange={(value) => updateField("imageUrl", value)}
        />
        <InspectorField
          id="data-table-image-alt"
          label="Image alt"
          value={content.imageAlt || ""}
          onChange={(value) => updateField("imageAlt", value)}
        />
      </InspectorSection>
    </div>
  );
}
