import AccordionContainer from "../container/AccordionContainer";
import AccordionWithContent from "../AccordionWithContent";
import { resolveAccordionStyle } from "../utils/style";

export default function AccordionWithContentSection({
  lang,
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveAccordionStyle(style);

  return (
    <AccordionContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <AccordionWithContent data={data} style={resolvedStyle} />
    </AccordionContainer>
  );
}
