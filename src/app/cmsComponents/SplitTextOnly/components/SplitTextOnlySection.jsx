import SplitTextOnly from "../SplitTextOnly";
import SplitTextOnlyContainer from "./SplitTextOnlyContainer";
import { resolveSplitTextOnlyStyle } from "../utils/style";

export default function SplitTextOnlySection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveSplitTextOnlyStyle(style);

  return (
    <SplitTextOnlyContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <SplitTextOnly lang={lang} data={data} style={resolvedStyle} />
    </SplitTextOnlyContainer>
  );
}
