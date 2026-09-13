/**
 * Shared Background Image display kit — fit + position for any CMS hero/BG photo.
 *
 * ---------------------------------------------------------------------------
 * 1) STYLE (utils/style.js)
 * ---------------------------------------------------------------------------
 *   import {
 *     DEFAULT_BACKGROUND_IMAGE_STYLE,
 *     BACKGROUND_IMAGE_STYLE_RESET_KEYS,
 *     resolveBackgroundImageStyle,
 *   } from "@/app/cmsComponents/shared/backgroundImage";
 *
 *   export const DEFAULT_X_STYLE = {
 *     ...other,
 *     ...DEFAULT_BACKGROUND_IMAGE_STYLE,
 *   };
 *
 *   export function resolveXStyle(style = {}) {
 *     return resolveBackgroundImageStyle(
 *       { ...DEFAULT_X_STYLE, ...style },
 *       DEFAULT_X_STYLE
 *     );
 *   }
 *
 *   // Include BACKGROUND_IMAGE_STYLE_RESET_KEYS in layout/banner reset keys
 *
 * ---------------------------------------------------------------------------
 * 2) STYLE FORM
 * ---------------------------------------------------------------------------
 *   import { BackgroundImageControls } from "...";
 *
 *   <InspectorSwitch ... label="Background image" / "Image" />
 *   <BackgroundImageControls
 *     style={style}
 *     onChange={onChange}
 *     visible={style.showBackgroundImage || style.showHeroImage}
 *     idPrefix="component-kebab"
 *   />
 *
 * ---------------------------------------------------------------------------
 * 3) RENDER
 * ---------------------------------------------------------------------------
 *   // CSS background:
 *   import { getBackgroundDisplayStyle } from "...";
 *   style={{ backgroundImage: `url(...)`, ...getBackgroundDisplayStyle(style) }}
 *
 *   // next/image:
 *   import { getObjectFitClass } from "...";
 *   <Image className={getObjectFitClass(style)} ... />
 *
 *   // CustomBackgroundImage:
 *   <CustomBackgroundImage imageFit={style.imageFit} imagePosition={style.imagePosition} />
 */

export {
  BACKGROUND_IMAGE_STYLE_RESET_KEYS,
  DEFAULT_BACKGROUND_IMAGE_STYLE,
  IMAGE_FIT_CSS,
  IMAGE_FIT_OBJECT_CLASS,
  IMAGE_FIT_OPTIONS,
  IMAGE_POSITION_CSS,
  IMAGE_POSITION_OBJECT_CLASS,
  IMAGE_POSITION_OPTIONS,
  resolveBackgroundImageStyle,
} from "./core/style";

export {
  getBackgroundDisplayStyle,
  getObjectFitClass,
  getObjectFitStyle,
} from "./core/css";

export { default as BackgroundImageControls } from "./BackgroundImageControls";
