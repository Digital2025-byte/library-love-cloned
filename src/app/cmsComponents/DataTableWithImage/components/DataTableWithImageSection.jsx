import DataTableWithImage from "../DataTableWithImage";
import DataTableWithImageContainer from "./DataTableWithImageContainer";
import { resolveDataTableWithImageStyle } from "../utils/style";

export default function DataTableWithImageSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveDataTableWithImageStyle(style);

  return (
    <DataTableWithImageContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <DataTableWithImage lang={lang} data={data} style={resolvedStyle} />
    </DataTableWithImageContainer>
  );
}
