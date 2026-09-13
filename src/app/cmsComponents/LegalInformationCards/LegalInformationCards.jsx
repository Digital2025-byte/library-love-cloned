"use client";

import LegalInformationCardsPanel from "./components/LegalInformationCardsPanel";
import { getLegalInformationCardsContent } from "./utils/helpers";
import { resolveLegalInformationCardsStyle } from "./utils/style";

/**
 * LegalInformationCards — privacy, cookies, and terms cards.
 */
export default function LegalInformationCards({
  lang = "en",
  data,
  style,
  posParams = "gb",
  cId,
}) {
  const resolvedStyle = resolveLegalInformationCardsStyle(style);
  const { links, cards, hasContent } = getLegalInformationCardsContent(
    data,
    lang
  );

  if (!hasContent) {
    return null;
  }

  return (
    <LegalInformationCardsPanel
      lang={lang}
      links={links}
      cards={cards}
      posParams={posParams}
      cId={cId}
      style={resolvedStyle}
    />
  );
}
