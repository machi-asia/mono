export { ScrollReveal } from "./scroll-reveal";
export { ScrollStack } from "./scroll-stack";
export { ScrollHorizontal } from "./scroll-horizontal";
export { Parallax } from "./parallax";
export { ScrollZoom } from "./scroll-zoom";
export { ScrollCurtain } from "./scroll-curtain";
export { ScrollRotate } from "./scroll-rotate";
export { ScrollSplit } from "./scroll-split";
export { ScrollDepth } from "./scroll-depth";

// Legacy Aliases for backwards compatibility
export { ScrollHorizontal as HorizontalScrollSection } from "./scroll-horizontal";
export { ScrollStack as CardStackSection } from "./scroll-stack";
export { ScrollSplit as SplitCurtainSection } from "./scroll-split";
export { Parallax as ParallaxSection } from "./parallax";
export { ScrollZoom as ZoomFocusSection } from "./scroll-zoom";

export { useScrollLoop, useScrollProgress, usePinProgress, clamp01, cx } from "./use-scroll-progress";

export type {
  ScrollRevealVariant,
  ScrollRevealProps,
  ScrollStackProps,
  ScrollHorizontalProps,
  ParallaxProps,
  ScrollZoomMode,
  ScrollZoomProps,
  ScrollCurtainDirection,
  ScrollCurtainProps,
  ScrollRotateProps,
  ScrollSplitDirection,
  ScrollSplitProps,
  ScrollDepthProps,
} from "./types";
