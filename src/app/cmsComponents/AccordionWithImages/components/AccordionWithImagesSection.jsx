import AccordionImagesContainer from "./AccordionImagesContainer";
import AccordionWithImages from "../AccordionWithImages";
import { resolveAccordionImagesStyle } from "../utils/style";

export default function AccordionWithImagesSection({
  lang,
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveAccordionImagesStyle(style);

  return (
    <AccordionImagesContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <AccordionWithImages data={data} style={resolvedStyle} />
    </AccordionImagesContainer>
  );
}
