import FaqExplorerContainer from "./FaqExplorerContainer";
import FaqExplorerPanel from "./FaqExplorerPanel";
import { getFaqExplorerContent } from "../utils/helpers";
import { resolveFaqExplorerStyle } from "../utils/style";

export default function FaqExplorerSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveFaqExplorerStyle(style);
  const content = getFaqExplorerContent(data, lang);

  return (
    <FaqExplorerContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      {content.hasContent ? (
        <FaqExplorerPanel content={content} style={resolvedStyle} />
      ) : null}
    </FaqExplorerContainer>
  );
}
