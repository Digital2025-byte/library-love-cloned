"use client";

import {
  InspectorField,
  InspectorLink,
  InspectorRepeater,
  InspectorSection,
  applyInspectorReset,
} from "@/components/inspector";
import {
  BacklinksEditor,
  joinItemBacklinkSourceText,
} from "@/app/cmsComponents/shared/backlinks";

const SLIDE_KEYS = ["slides"];

const emptySlide = () => ({
  title: "",
  subtitle: "",
  description: "",
  links: [],
  imageUrl: "",
  videoUrl: "",
  imageAlt: "",
  buttonText: "",
  buttonHref: "/",
  buttonLinkType: "internal",
});

export default function SliderContentForm({ content, onChange, defaults }) {
  const reset = (keys) => onChange(applyInspectorReset(content, defaults, keys));

  return (
    <div>
      <InspectorSection
        title="Slides"
        onReset={() => reset(SLIDE_KEYS)}
      >
        <InspectorRepeater
          items={content.slides || []}
          createItem={emptySlide}
          onChange={(slides) => onChange({ ...content, slides })}
        >
          {(item, { index, update }) => (
            <>
              <InspectorField
                id={`slider-slide-${index}-title`}
                label="Title"
                value={item.title}
                onChange={(value) => update("title", value)}
              />
              <InspectorField
                id={`slider-slide-${index}-subtitle`}
                label="Subtitle"
                value={item.subtitle}
                onChange={(value) => update("subtitle", value)}
              />
              <InspectorField
                id={`slider-slide-${index}-description`}
                label="Description"
                value={item.description}
                onChange={(value) => update("description", value)}
                multiline
              />
              <InspectorField
                id={`slider-slide-${index}-image`}
                label="Image URL"
                value={item.imageUrl}
                onChange={(value) => update("imageUrl", value)}
              />
              <InspectorField
                id={`slider-slide-${index}-video`}
                label="Video URL"
                value={item.videoUrl}
                onChange={(value) => update("videoUrl", value)}
              />
              <InspectorField
                id={`slider-slide-${index}-alt`}
                label="Image alt"
                value={item.imageAlt}
                onChange={(value) => update("imageAlt", value)}
              />
              <InspectorField
                id={`slider-slide-${index}-button`}
                label="Button label"
                value={item.buttonText}
                onChange={(value) => update("buttonText", value)}
              />
              <InspectorLink
                id={`slider-slide-${index}-link`}
                type={item.buttonLinkType}
                href={item.buttonHref}
                onChange={({ type, href }) => {
                  const slides = (content.slides || []).map((slide, slideIndex) =>
                    slideIndex === index
                      ? { ...slide, buttonLinkType: type, buttonHref: href }
                      : slide
                  );
                  onChange({ ...content, slides });
                }}
              />
            </>
          )}
        </InspectorRepeater>
      </InspectorSection>

      <BacklinksEditor
        idPrefix="slider-link"
        title="Backlinks"
        links={content.links || []}
        sourceText={joinItemBacklinkSourceText({
          items: content.slides,
        })}
        defaults={defaults?.links || []}
        onChange={(links) => onChange({ ...content, links })}
      />
    </div>
  );
}
