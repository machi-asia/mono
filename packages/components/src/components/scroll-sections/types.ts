import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "blur"
  | "wipe"
  | "rotate"
  | "flip";

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: ScrollRevealVariant;
}

export interface ScrollStackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Height of each card in the deck. Defaults to '100vh'. */
  itemHeight?: string | number;
  /** How far each covering card shrinks the ones beneath it (0-1 per level). Default 0.12. */
  scaleAmount?: number;
  /** How much a card dims while being covered (0-1, applied once regardless of depth). Default 0.35. */
  dimAmount?: number;
}

export interface ScrollHorizontalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Optional pinned header content that sits above the sliding track. */
  header?: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Defaults to number of children. */
  length?: number;
  /** Custom width for each card/slide. E.g. 'min(560px, 85vw)'. If unset, defaults to full viewport slide. */
  itemWidth?: string;
  /** Custom gap between slides. E.g. '2rem'. Default '2rem'. */
  gap?: string;
}

export interface ParallaxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Total drift across the wrapper's time on screen, as a fraction of the
   * viewport height. Negative moves against the scroll (background recedes),
   * positive moves with it. Default -0.2.
   */
  speed?: number;
}

export type ScrollZoomMode = "zoom-out" | "zoom-in";

export interface ScrollZoomProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Default 2. */
  length?: number;
  /** `zoom-out` shrinks and fades the content away; `zoom-in` grows it into place. */
  mode?: ScrollZoomMode;
}

export type ScrollCurtainDirection = "up" | "down" | "left" | "right";

export interface ScrollCurtainProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Default 2. */
  length?: number;
  /** Direction the curtain slides away towards. Default 'up'. */
  direction?: ScrollCurtainDirection;
  /** Elements rendered on the sliding curtain itself (they wipe away with it). */
  curtain?: ReactNode;
  curtainClassName?: string;
  curtainStyle?: CSSProperties;
}

export interface ScrollRotateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Default 2. */
  length?: number;
  /** Total rotation in degrees across the pin. Default 180. */
  angle?: number;
}

export type ScrollSplitDirection = "horizontal" | "vertical";

export interface ScrollSplitProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Default 2. */
  length?: number;
  /** Axis the two panels part along. Default 'horizontal'. */
  direction?: ScrollSplitDirection;
  /** Elements rendered on the first (left/top) door panel. */
  panelA?: ReactNode;
  /** Elements rendered on the second (right/bottom) door panel. */
  panelB?: ReactNode;
  panelClassName?: string;
  panelStyle?: CSSProperties;
}

export interface ScrollDepthProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Pinned scroll distance in viewport-height multiples. Defaults to one per two layers (min 2). */
  length?: number;
}
