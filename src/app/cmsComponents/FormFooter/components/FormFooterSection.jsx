import FormFooter from "../FormFooter";
import FormFooterContainer from "./FormFooterContainer";
import { resolveFormFooterStyle } from "../utils/style";

export default function FormFooterSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveFormFooterStyle(style);

  return (
    <FormFooterContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <FormFooter lang={lang} data={data} style={resolvedStyle} />
    </FormFooterContainer>
  );
}
