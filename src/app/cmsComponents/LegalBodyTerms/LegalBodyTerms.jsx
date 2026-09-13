"use client";

import LegalBodyTermsPanel from "./components/LegalBodyTermsPanel";
import { getLegalBodyTermsContent } from "./utils/helpers";
import { resolveLegalBodyTermsStyle } from "./utils/style";

/**
 * LegalBodyTerms — terms body with chip, alerts, info cards, and contact.
 */
export default function LegalBodyTerms({ lang = "en", data, style }) {
  const resolvedStyle = resolveLegalBodyTermsStyle(style);
  const { content, hasContent } = getLegalBodyTermsContent(data, lang);

  if (!hasContent) {
    return null;
  }

  return (
    <LegalBodyTermsPanel lang={lang} content={content} style={resolvedStyle} />
  );
}
