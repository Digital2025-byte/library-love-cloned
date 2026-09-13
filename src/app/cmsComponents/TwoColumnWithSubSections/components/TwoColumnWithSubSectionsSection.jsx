import TwoColumnWithSubSections from "../TwoColumnWithSubSections";
import SubSectionsContainer from "./SubSectionsContainer";
import { resolveTwoColumnWithSubSectionsStyle } from "../utils/style";

export default function TwoColumnWithSubSectionsSection({
  lang = "en",
  dir,
  data,
  style,
  className = "",
}) {
  const resolvedStyle = resolveTwoColumnWithSubSectionsStyle(style);

  return (
    <SubSectionsContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <TwoColumnWithSubSections
        lang={lang}
        data={data}
        style={resolvedStyle}
      />
    </SubSectionsContainer>
  );
}
