"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";
import { BacklinksEditor } from "@/app/cmsComponents/shared/backlinks";
import { joinMealsBacklinkSourceText } from "../utils/helpers";

const TITLE_KEYS = ["title"];
const NOTE_KEYS = ["notes"];
const ITEM_KEYS = ["items"];

const emptyItem = () => ({ title: "", description: "" });
const emptyGroup = () => ({ title: "", items: [emptyItem()] });
const emptySection = () => ({
  sectionTitle: "",
  items: [emptyItem()],
  groups: [],
});
const emptyTab = () => ({
  label: "",
  imageUrl: "",
  imageAlt: "",
  sections: [emptySection()],
});
const emptyNote = () => ({ text: "" });

export default function MealsDescriptionTabbedContentForm({
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
      <InspectorSection title="Title" onReset={() => reset(TITLE_KEYS)}>
        <InspectorField
          id="meals-tabbed-title"
          label="Title"
          value={content.title || ""}
          onChange={(value) => updateField("title", value)}
        />
      </InspectorSection>

      <InspectorSection title="Tabs" onReset={() => reset(ITEM_KEYS)}>
        <InspectorRepeater
          items={content.items || []}
          createItem={emptyTab}
          itemLabel={(item, index) => item.label || `Tab ${index + 1}`}
          addLabel="Add Tab"
          titleKey="label"
          titlePlaceholder="Tab title"
          onChange={(items) => onChange({ ...content, items })}
        >
          {(tab, { index, update }) => (
            <>
              <InspectorField
                id={`meals-tabbed-${index}-label`}
                label="Tab title"
                value={tab.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorField
                id={`meals-tabbed-${index}-image`}
                label="Image URL"
                value={tab.imageUrl || ""}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`meals-tabbed-${index}-alt`}
                label="Image alt"
                value={tab.imageAlt || ""}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorRepeater
                items={tab.sections || []}
                createItem={emptySection}
                itemLabel={(section, sectionIndex) =>
                  section.sectionTitle || `Section ${sectionIndex + 1}`
                }
                addLabel="Add Section"
                onChange={(sections) => update("sections", sections)}
              >
                {(section, { index: sectionIndex, update: updateSection }) => (
                  <>
                    <InspectorField
                      id={`meals-tabbed-${index}-${sectionIndex}-title`}
                      label="Section title"
                      value={section.sectionTitle || ""}
                      onChange={(value) => updateSection("sectionTitle", value)}
                    />
                    <InspectorRepeater
                      items={section.items || []}
                      createItem={emptyItem}
                      itemLabel={(_item, itemIndex) => `Item ${itemIndex + 1}`}
                      addLabel="Add Item"
                      onChange={(items) => updateSection("items", items)}
                    >
                      {(item, { index: itemIndex, update: updateItem }) => (
                        <>
                          <InspectorField
                            id={`meals-tabbed-${index}-${sectionIndex}-item-${itemIndex}-title`}
                            label="Title"
                            value={item.title || ""}
                            onChange={(value) => updateItem("title", value)}
                          />
                          <InspectorField
                            id={`meals-tabbed-${index}-${sectionIndex}-item-${itemIndex}-description`}
                            label="Description"
                            value={item.description || ""}
                            onChange={(value) =>
                              updateItem("description", value)
                            }
                            multiline
                          />
                        </>
                      )}
                    </InspectorRepeater>
                    <InspectorRepeater
                      items={section.groups || []}
                      createItem={emptyGroup}
                      itemLabel={(group, groupIndex) =>
                        group.title || `Group ${groupIndex + 1}`
                      }
                      addLabel="Add Group"
                      onChange={(groups) => updateSection("groups", groups)}
                    >
                      {(group, { index: groupIndex, update: updateGroup }) => (
                        <>
                          <InspectorField
                            id={`meals-tabbed-${index}-${sectionIndex}-group-${groupIndex}-title`}
                            label="Group title"
                            value={group.title || ""}
                            onChange={(value) => updateGroup("title", value)}
                          />
                          <InspectorRepeater
                            items={group.items || []}
                            createItem={emptyItem}
                            itemLabel={(_item, itemIndex) => `Item ${itemIndex + 1}`}
                            addLabel="Add Item"
                            onChange={(items) => updateGroup("items", items)}
                          >
                            {(
                              item,
                              { index: itemIndex, update: updateItem }
                            ) => (
                              <>
                                <InspectorField
                                  id={`meals-tabbed-${index}-${sectionIndex}-group-${groupIndex}-item-${itemIndex}-title`}
                                  label="Title"
                                  value={item.title || ""}
                                  onChange={(value) =>
                                    updateItem("title", value)
                                  }
                                />
                                <InspectorField
                                  id={`meals-tabbed-${index}-${sectionIndex}-group-${groupIndex}-item-${itemIndex}-description`}
                                  label="Description"
                                  value={item.description || ""}
                                  onChange={(value) =>
                                    updateItem("description", value)
                                  }
                                  multiline
                                />
                              </>
                            )}
                          </InspectorRepeater>
                        </>
                      )}
                    </InspectorRepeater>
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <InspectorSection title="Notes" onReset={() => reset(NOTE_KEYS)}>
        <InspectorRepeater
          items={content.notes || []}
          createItem={emptyNote}
          itemLabel={(_item, index) => `Item ${index + 1}`}
          addLabel="Add Item"
          onChange={(notes) => onChange({ ...content, notes })}
        >
          {(item, { index, update }) => (
            <InspectorField
              id={`meals-tabbed-note-${index}`}
              label="Note"
              value={item.text || ""}
              onChange={(value) => update("text", value)}
              multiline
            />
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="meals-tabbed-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinMealsBacklinkSourceText(content)}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
