-- Shared (site-wide) style for component types that should look the same on
-- every page — e.g. breadcrumbs: content stays per-page, chrome/colours are one.
ALTER TABLE public.component_types
  ADD COLUMN IF NOT EXISTS shared_style jsonb;

-- Seed breadcrumbs from the common CMS defaults (per-language map so it matches
-- how component.style is stored after the first locale edit).
UPDATE public.component_types
SET shared_style = '{
  "en": {
    "sectionPadding": "none",
    "showSectionBg": false,
    "sectionBg": "100",
    "crumbColor": "600",
    "crumbFontWeight": "medium",
    "crumbColorHover": "primary-1",
    "crumbFontWeightHover": "medium",
    "focusColor": "primary-1",
    "focusFontWeight": "semibold",
    "focusColorHover": "primary-1",
    "focusFontWeightHover": "semibold",
    "currentColor": "primary-1",
    "currentFontWeight": "semibold",
    "currentColorHover": "primary-1",
    "currentFontWeightHover": "semibold",
    "separatorColor": "600",
    "crumbUnderline": false,
    "showLinks": true,
    "linkColor": "primary-1",
    "linkHoverColor": "primary-2",
    "linkFontWeight": "semibold",
    "linkUnderline": "always",
    "linkItalic": false
  },
  "ar": {
    "sectionPadding": "none",
    "showSectionBg": false,
    "sectionBg": "100",
    "crumbColor": "600",
    "crumbFontWeight": "medium",
    "crumbColorHover": "primary-1",
    "crumbFontWeightHover": "medium",
    "focusColor": "primary-1",
    "focusFontWeight": "semibold",
    "focusColorHover": "primary-1",
    "focusFontWeightHover": "semibold",
    "currentColor": "primary-1",
    "currentFontWeight": "semibold",
    "currentColorHover": "primary-1",
    "currentFontWeightHover": "semibold",
    "separatorColor": "600",
    "crumbUnderline": false,
    "showLinks": true,
    "linkColor": "primary-1",
    "linkHoverColor": "primary-2",
    "linkFontWeight": "semibold",
    "linkUnderline": "always",
    "linkItalic": false
  }
}'::jsonb
WHERE id = 'breadcrumbs'
  AND shared_style IS NULL;
