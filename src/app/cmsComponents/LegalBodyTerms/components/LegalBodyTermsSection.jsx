import LegalBodyTerms from "../LegalBodyTerms";
import LegalBodyTermsContainer from "./LegalBodyTermsContainer";
import { resolveLegalBodyTermsStyle } from "../utils/style";

export default function LegalBodyTermsSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveLegalBodyTermsStyle(style);

  return (
    <LegalBodyTermsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <LegalBodyTerms lang={lang} data={data} style={resolvedStyle} />
    </LegalBodyTermsContainer>
  );
}
