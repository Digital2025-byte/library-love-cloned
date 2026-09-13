import SimpleGridWithPrefix from "../SimpleGridWithPrefix";
import SimpleGridContainer from "./SimpleGridContainer";
import { resolveSimpleGridStyle } from "../utils/style";

export default function SimpleGridWithPrefixSection({
  lang = "en",
  dir,
  data,
  style,
  cId,
  className = "",
}) {
  const resolvedStyle = resolveSimpleGridStyle(style);

  return (
    <SimpleGridContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <SimpleGridWithPrefix
        lang={lang}
        data={data}
        style={resolvedStyle}
        cId={cId}
      />
    </SimpleGridContainer>
  );
}
