import LegalInformationHero from "../LegalInformationHero";
import LegalInformationHeroContainer from "./LegalInformationHeroContainer";
import { resolveLegalInformationHeroStyle } from "../utils/style";

export default function LegalInformationHeroSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveLegalInformationHeroStyle(style);

  return (
    <LegalInformationHeroContainer
      lang={lang}
      dir={dir}
      className={className}
    >
      <LegalInformationHero lang={lang} data={data} style={resolvedStyle} />
    </LegalInformationHeroContainer>
  );
}
