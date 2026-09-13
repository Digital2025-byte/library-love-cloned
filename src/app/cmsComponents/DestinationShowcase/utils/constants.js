/**
 * Card sizing (in px). The transform that positions the track advances by one
 * "slot" per index. Every card to the LEFT of the active one is inactive, so a
 * slot is exactly an inactive card + the gap. Driving the gap and widths from
 * these same constants (see DestinationShowcaseCards) keeps slot math exact.
 * Start padding of `50% - activeWidth/2` centers the active card at every
 * breakpoint, with neighbouring cards peeking on both sides.
 */
export const CARD_GAP_PX = 20;
export const CARD_INACTIVE_W_PX = 148;
export const CARD_ACTIVE_W_PX = 160;
export const CARD_STEP_PX = CARD_INACTIVE_W_PX + CARD_GAP_PX; // 168

/**
 * Card track + title slide — both move together with the SAME duration and
 * easing. Keep in sync with the track's Tailwind class in DestinationShowcaseCards
 * (`duration-900`).
 */
export const MOVE_DURATION_MS = 900;
export const MOVE_DURATION_S = MOVE_DURATION_MS / 1000;
export const MOVE_EASE = [0.33, 1, 0.68, 1]; // easeOutCubic

/** Hero fill image — full section width up to max-w-7xl */
export const HERO_IMAGE_SIZES = "(min-width: 1280px) 1280px, 100vw";
export const HERO_IMAGE_QUALITY = 90;
export const CARD_IMAGE_SIZES = "160px";
