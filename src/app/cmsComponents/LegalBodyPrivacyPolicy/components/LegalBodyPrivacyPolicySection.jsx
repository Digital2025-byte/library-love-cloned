import LegalBodyPrivacyPolicy from "../LegalBodyPrivacyPolicy";
import LegalBodyPrivacyPolicyContainer from "./LegalBodyPrivacyPolicyContainer";
import { resolveLegalBodyPrivacyPolicyStyle } from "../utils/style";

export default function LegalBodyPrivacyPolicySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveLegalBodyPrivacyPolicyStyle(style);

  return (
    <LegalBodyPrivacyPolicyContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <LegalBodyPrivacyPolicy lang={lang} data={data} style={resolvedStyle} />
    </LegalBodyPrivacyPolicyContainer>
  );
}
