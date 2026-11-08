import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE,
  dirFor,
  isLanguageMap,
  localizeContent,
  mergeStyleMaps,
  normalizeLang,
  pickLanguage,
  styleForLang,
  SUPPORTED_LANGUAGES,
} from "./cms-languages";

const NEW_LOCALES = ["tr", "de", "hy"] as const;

describe("language registry", () => {
  it("supports en, ar, tr, de, hy", () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual(["en", "ar", "tr", "de", "hy"]);
  });

  it("keeps English as the default language", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
  });
});

describe("normalizeLang", () => {
  it.each([...SUPPORTED_LANGUAGES])("accepts %s", (lang) => {
    expect(normalizeLang(lang)).toBe(lang);
  });

  it.each([...NEW_LOCALES])("accepts %s case-insensitively and trimmed", (lang) => {
    expect(normalizeLang(` ${lang.toUpperCase()} `)).toBe(lang);
  });

  it("rejects unsupported and empty values", () => {
    expect(normalizeLang("fr")).toBeNull();
    expect(normalizeLang("")).toBeNull();
    expect(normalizeLang(null)).toBeNull();
    expect(normalizeLang(undefined)).toBeNull();
    expect(normalizeLang(42)).toBeNull();
  });

  it("never resolves a supported locale to English", () => {
    for (const lang of NEW_LOCALES) {
      expect(normalizeLang(lang)).not.toBe("en");
    }
  });
});

describe("dirFor", () => {
  it("marks only Arabic as RTL", () => {
    expect(dirFor("ar")).toBe("rtl");
  });

  it.each(["en", ...NEW_LOCALES] as const)("marks %s as LTR", (lang) => {
    expect(dirFor(lang)).toBe("ltr");
  });

  it("treats a null locale as LTR", () => {
    expect(dirFor(null)).toBe("ltr");
  });
});

describe("pickLanguage", () => {
  const content = {
    en: { title: "Hello" },
    ar: { title: "مرحبا" },
    tr: { title: "Merhaba" },
  };

  it.each([...NEW_LOCALES] as const)(
    "returns the %s object when authored, never English",
    (lang) => {
      const withLang = { ...content, [lang]: { title: `${lang} title` } };
      expect(pickLanguage(withLang, lang)).toEqual({ title: `${lang} title` });
    },
  );

  it("returns null for an unauthored locale (no English fallback)", () => {
    expect(pickLanguage(content, "de")).toBeNull();
    expect(pickLanguage(content, "hy")).toBeNull();
  });

  it("returns null for non-map content", () => {
    expect(pickLanguage(null, "tr")).toBeNull();
    expect(pickLanguage(["x"], "de")).toBeNull();
    expect(pickLanguage("text", "hy")).toBeNull();
  });
});

describe("isLanguageMap", () => {
  it("recognizes maps keyed by any supported locales", () => {
    expect(isLanguageMap({ tr: {}, de: {}, hy: {} })).toBe(true);
    expect(isLanguageMap({ en: {}, ar: {} })).toBe(true);
  });

  it("rejects flat objects and maps with unknown keys", () => {
    expect(isLanguageMap({ title: "x" })).toBe(false);
    expect(isLanguageMap({ fr: {} })).toBe(false);
    expect(isLanguageMap({})).toBe(false);
    expect(isLanguageMap(null)).toBe(false);
  });
});

describe("styleForLang", () => {
  it("picks the requested locale from a per-language map", () => {
    const style = { en: { color: "red" }, tr: { color: "blue" } };
    expect(styleForLang(style, "tr")).toEqual({ color: "blue" });
  });

  it("returns a legacy flat style for every locale", () => {
    const style = { showImage: true };
    for (const lang of NEW_LOCALES) {
      expect(styleForLang(style, lang)).toEqual({ showImage: true });
    }
  });

  it("returns {} for non-object styles", () => {
    expect(styleForLang(null, "de")).toEqual({});
  });
});

describe("mergeStyleMaps", () => {
  it("keeps existing locales when merging a new one", () => {
    const merged = mergeStyleMaps(
      { en: { a: 1 }, ar: { a: 2 } },
      { tr: { a: 3 } },
    );
    expect(merged).toEqual({ en: { a: 1 }, ar: { a: 2 }, tr: { a: 3 } });
  });

  it("seeds a legacy flat style onto every supported locale", () => {
    const merged = mergeStyleMaps({ flat: true }, { de: { flat: false } });
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(merged[lang]).toBeDefined();
    }
    expect(merged["de"]).toEqual({ flat: false });
  });
});

describe("localizeContent", () => {
  const content = { en: { title: "Hello" }, hy: { title: "Բարև" } };

  it("returns the requested locale when authored", () => {
    expect(localizeContent(content, "hy")).toEqual({ title: "Բարև" });
  });

  it("returns {} for content that is not a map", () => {
    expect(localizeContent(null, "tr")).toEqual({});
  });
});
