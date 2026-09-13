import CitiesSectionsContainer from "./CitiesSectionsContainer";
import CitiesSectionsPanel from "./CitiesSectionsPanel";
import { getCitiesSectionsContent } from "../utils/helpers";
import { resolveCitiesSectionsStyle } from "../utils/style";

export default function CitiesSectionsSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveCitiesSectionsStyle(style);
  const content = getCitiesSectionsContent(data, lang);

  return (
    <CitiesSectionsContainer lang={lang} dir={dir} className={className}>
      {content.hasContent ? (
        <CitiesSectionsPanel
          lang={lang}
          cId={cId}
          content={{
            ...content,
            ctaHref: content.ctaHref || content.slug || "",
          }}
          style={resolvedStyle}
        />
      ) : null}
    </CitiesSectionsContainer>
  );
}
