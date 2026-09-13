import FlightFaresSection from "../FlightFaresSection";
import FlightFaresContainer from "./FlightFaresContainer";
import { resolveFlightFaresStyle } from "../utils/style";

export default function FlightFaresSectionSection({
  lang = "en",
  dir,
  data,
  style,
  posParams,
  className = "",
}) {
  const resolvedStyle = resolveFlightFaresStyle(style);

  return (
    <FlightFaresContainer
      lang={lang}
      dir={dir}
      style={resolvedStyle}
      className={className}
    >
      <FlightFaresSection
        lang={lang}
        data={data}
        style={resolvedStyle}
        posParams={posParams}
      />
    </FlightFaresContainer>
  );
}
