import ConnectionStepsList from "../ConnectionStepsList";
import ConnectionStepsListContainer from "./ConnectionStepsListContainer";
import { resolveConnectionStepsListStyle } from "../utils/style";

export default function ConnectionStepsListSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveConnectionStepsListStyle(style);

  return (
    <ConnectionStepsListContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <ConnectionStepsList lang={lang} data={data} style={resolvedStyle} />
    </ConnectionStepsListContainer>
  );
}
