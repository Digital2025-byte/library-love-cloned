import LegalBodyCookies from "../LegalBodyCookies";
import LegalBodyCookiesContainer from "./LegalBodyCookiesContainer";
import { resolveLegalBodyCookiesStyle } from "../utils/style";

export default function LegalBodyCookiesSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveLegalBodyCookiesStyle(style);

  return (
    <LegalBodyCookiesContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <LegalBodyCookies lang={lang} data={data} style={resolvedStyle} />
    </LegalBodyCookiesContainer>
  );
}
