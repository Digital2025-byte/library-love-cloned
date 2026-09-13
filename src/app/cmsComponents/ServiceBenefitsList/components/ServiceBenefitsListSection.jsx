import ServiceBenefitsList from "../ServiceBenefitsList";
import ServiceBenefitsContainer from "./ServiceBenefitsContainer";
import { resolveServiceBenefitsStyle } from "../utils/style";

export default function ServiceBenefitsListSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveServiceBenefitsStyle(style);

  return (
    <ServiceBenefitsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <ServiceBenefitsList lang={lang} data={data} style={resolvedStyle} />
    </ServiceBenefitsContainer>
  );
}
