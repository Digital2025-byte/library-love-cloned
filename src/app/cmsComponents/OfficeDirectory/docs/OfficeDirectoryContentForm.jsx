"use client";

import {
  InspectorField,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";

const LABEL_KEYS = ["callLabel", "emailLabel", "weekendLabel", "tabsLabel"];

const emptyOffice = () => ({
  name: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  weekend: "",
});

const emptyTab = () => ({ label: "", offices: [emptyOffice()] });

export default function OfficeDirectoryContentForm({
  content,
  onChange,
  defaults,
}) {
  const updateField = (key, value) => onChange({ ...content, [key]: value });
  const reset = (keys) =>
    onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection title="Labels" onReset={() => reset(LABEL_KEYS)}>
        <InspectorField
          id="office-directory-call"
          label="Call button"
          value={content.callLabel || ""}
          onChange={(value) => updateField("callLabel", value)}
        />
        <InspectorField
          id="office-directory-email"
          label="Email button"
          value={content.emailLabel || ""}
          onChange={(value) => updateField("emailLabel", value)}
        />
        <InspectorField
          id="office-directory-weekend"
          label="Weekend label"
          value={content.weekendLabel || ""}
          onChange={(value) => updateField("weekendLabel", value)}
        />
        <InspectorField
          id="office-directory-tabs-label"
          label="Tabs label (accessibility)"
          value={content.tabsLabel || ""}
          onChange={(value) => updateField("tabsLabel", value)}
          hint="Screen-reader name for the city tab strip"
        />
      </InspectorSection>

      <InspectorSection title="Cities" onReset={() => reset(["tabs"])}>
        <InspectorRepeater
          items={content.tabs || []}
          createItem={emptyTab}
          itemLabel={(item, index) => item.label || `City ${index + 1}`}
          addLabel="Add City"
          titleKey="label"
          titlePlaceholder="City name"
          onChange={(tabs) => onChange({ ...content, tabs })}
        >
          {(tab, { index, update }) => (
            <>
              <InspectorField
                id={`office-directory-${index}-label`}
                label="City name"
                value={tab.label || ""}
                onChange={(value) => update("label", value)}
              />
              <InspectorRepeater
                items={tab.offices || []}
                createItem={emptyOffice}
                itemLabel={(o, oIndex) => o.name || `Office ${oIndex + 1}`}
                addLabel="Add Office"
                titleKey="name"
                titlePlaceholder="Office name"
                onChange={(offices) => update("offices", offices)}
              >
                {(o, { index: oIndex, update: updateO }) => (
                  <>
                    <InspectorField id={`office-${index}-${oIndex}-name`} label="Name" value={o.name || ""} onChange={(v) => updateO("name", v)} />
                    <InspectorField id={`office-${index}-${oIndex}-address`} label="Address" value={o.address || ""} onChange={(v) => updateO("address", v)} multiline />
                    <InspectorField id={`office-${index}-${oIndex}-phone`} label="Phone" value={o.phone || ""} onChange={(v) => updateO("phone", v)} />
                    <InspectorField id={`office-${index}-${oIndex}-email`} label="Email" value={o.email || ""} onChange={(v) => updateO("email", v)} />
                    <InspectorField id={`office-${index}-${oIndex}-hours`} label="Hours" value={o.hours || ""} onChange={(v) => updateO("hours", v)} />
                    <InspectorField id={`office-${index}-${oIndex}-weekend`} label="Weekend" value={o.weekend || ""} onChange={(v) => updateO("weekend", v)} />
                  </>
                )}
              </InspectorRepeater>
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>
    </div>
  );
}
