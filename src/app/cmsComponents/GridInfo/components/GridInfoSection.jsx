import GridInfo from "../GridInfo";
import GridInfoContainer from "./GridInfoContainer";
import { resolveGridInfoStyle } from "../utils/style";

export default function GridInfoSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveGridInfoStyle(style);

  return (
    <GridInfoContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <GridInfo lang={lang} data={data} style={resolvedStyle} />
    </GridInfoContainer>
  );
}
