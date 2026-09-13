import TitleWithList from "../TitleWithList";
import TitleWithListContainer from "./TitleWithListContainer";
import { resolveTitleWithListStyle } from "../utils/style";

export default function TitleWithListSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveTitleWithListStyle(style);

  return (
    <TitleWithListContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <TitleWithList lang={lang} data={data} style={resolvedStyle} />
    </TitleWithListContainer>
  );
}
