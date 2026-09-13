"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { isRtl } from "@/i18n/settings";
import {
  ALL_SECTION_DATA_IDS,
  SECTION_DATA_LOADERS,
} from "./sectionDataLoaders";

/**
 * Build demo CMS payloads only for the requested section ids.
 * Pass `sectionIds` from the current page to avoid loading every
 * component's images/data on docs routes.
 *
 * @param {string[]} [sectionIds]
 */
export default function useCmsDemoData(sectionIds) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const dir = isRtl(lang) ? "rtl" : "ltr";

  const idsKey =
    Array.isArray(sectionIds) && sectionIds.length > 0
      ? [...new Set(sectionIds)].join(",")
      : "ALL";

  const ids = useMemo(
    () => (idsKey === "ALL" ? ALL_SECTION_DATA_IDS : idsKey.split(",")),
    [idsKey]
  );

  const [sectionData, setSectionData] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const chunks = await Promise.all(
        ids.map(async (id) => {
          const loader = SECTION_DATA_LOADERS[id];
          if (!loader) return {};
          try {
            return await loader(t, lang);
          } catch {
            return {};
          }
        })
      );

      if (cancelled) return;
      setSectionData(Object.assign({}, ...chunks));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [idsKey, lang, t, ids]);

  return {
    lang,
    dir,
    ...sectionData,
  };
}
