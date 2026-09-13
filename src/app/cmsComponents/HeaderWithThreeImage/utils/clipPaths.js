const THREE = {
  LEFT_W: "35%",
  MID_W: "45%",
  RIGHT_W: "40%",
  EQUAL_W: "33.334%",
};

const TWO = {
  LEFT_W: "55%",
  RIGHT_W: "55%",
  EQUAL_W: "50%",
};

const SLANT = "8vw";

function normalizeDirection(direction) {
  if (direction === "left" || direction === "none" || direction === "right") {
    return direction;
  }
  return direction === "reverse" ? "left" : "right";
}

function normalizeCount(count) {
  return Number(count) === 2 ? 2 : 3;
}

/**
 * Slice divider geometry for 2 or 3 images.
 * direction: right (\), left (/), none (vertical)
 */
export function getHeaderClipPaths(direction = "right", { count = 3 } = {}) {
  const normalized = normalizeDirection(direction);
  const imageCount = normalizeCount(count);
  const overlapStyle = { marginLeft: `calc(-1 * ${SLANT})` };

  if (imageCount === 2) {
    if (normalized === "none") {
      const rect = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
      return {
        count: 2,
        LEFT_W: TWO.EQUAL_W,
        RIGHT_W: TWO.EQUAL_W,
        leftClipPath: rect,
        rightClipPath: rect,
        overlapStyle: undefined,
      };
    }

    if (normalized === "left") {
      return {
        count: 2,
        LEFT_W: TWO.LEFT_W,
        RIGHT_W: TWO.RIGHT_W,
        leftClipPath: `polygon(0% 0%, calc(100% - ${SLANT}) 0%, 100% 100%, 0% 100%)`,
        rightClipPath: `polygon(0% 0%, 100% 0%, 100% 100%, ${SLANT} 100%)`,
        overlapStyle,
      };
    }

    return {
      count: 2,
      LEFT_W: TWO.LEFT_W,
      RIGHT_W: TWO.RIGHT_W,
      leftClipPath: `polygon(0% 0%, 100% 0%, calc(100% - ${SLANT}) 100%, 0% 100%)`,
      rightClipPath: `polygon(${SLANT} 0%, 100% 0%, 100% 100%, 0% 100%)`,
      overlapStyle,
    };
  }

  if (normalized === "none") {
    const rect = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    return {
      count: 3,
      LEFT_W: THREE.EQUAL_W,
      MID_W: THREE.EQUAL_W,
      RIGHT_W: THREE.EQUAL_W,
      leftClipPath: rect,
      midClipPath: rect,
      rightClipPath: rect,
      overlapStyle: undefined,
    };
  }

  if (normalized === "left") {
    return {
      count: 3,
      LEFT_W: THREE.LEFT_W,
      MID_W: THREE.MID_W,
      RIGHT_W: THREE.RIGHT_W,
      leftClipPath: `polygon(0% 0%, calc(100% - ${SLANT}) 0%, 100% 100%, 0% 100%)`,
      midClipPath: `polygon(0% 0%, calc(100% - ${SLANT}) 0%, 100% 100%, ${SLANT} 100%)`,
      rightClipPath: `polygon(0% 0%, 100% 0%, 100% 100%, ${SLANT} 100%)`,
      overlapStyle,
    };
  }

  return {
    count: 3,
    LEFT_W: THREE.LEFT_W,
    MID_W: THREE.MID_W,
    RIGHT_W: THREE.RIGHT_W,
    leftClipPath: `polygon(0% 0%, 100% 0%, calc(100% - ${SLANT}) 100%, 0% 100%)`,
    midClipPath: `polygon(${SLANT} 0%, 100% 0%, calc(100% - ${SLANT}) 100%, 0% 100%)`,
    rightClipPath: `polygon(${SLANT} 0%, 100% 0%, 100% 100%, 0% 100%)`,
    overlapStyle,
  };
}
