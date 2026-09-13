import FormHeader from "../FormHeader";
import FormHeaderContainer from "./FormHeaderContainer";
import { resolveFormHeaderStyle } from "../utils/style";

export default function FormHeaderSection({
  lang = "en",
  dir,
  data,
  style,
  posParams = "gb",
  className = "",
}) {
  const resolvedStyle = resolveFormHeaderStyle(style);

  return (
    <FormHeaderContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <FormHeader
        lang={lang}
        data={data}
        style={resolvedStyle}
        posParams={posParams}
      />
    </FormHeaderContainer>
  );
}
