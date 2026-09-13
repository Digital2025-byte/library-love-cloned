import CallUs from "../CallUs";
import CallUsContainer from "./CallUsContainer";
import { resolveCallUsStyle } from "../utils/style";

export default function CallUsSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveCallUsStyle(style);

  return (
    <CallUsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <CallUs lang={lang} data={data} style={resolvedStyle} />
    </CallUsContainer>
  );
}
