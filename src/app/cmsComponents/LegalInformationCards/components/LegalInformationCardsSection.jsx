import LegalInformationCards from "../LegalInformationCards";
import LegalInformationCardsContainer from "./LegalInformationCardsContainer";
import { resolveLegalInformationCardsStyle } from "../utils/style";

export default function LegalInformationCardsSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  cId,
  className = "",
}) {
  const resolvedStyle = resolveLegalInformationCardsStyle(style);

  return (
    <LegalInformationCardsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <LegalInformationCards
        lang={lang}
        data={data}
        style={resolvedStyle}
        posParams={posParams}
        cId={cId}
      />
    </LegalInformationCardsContainer>
  );
}
