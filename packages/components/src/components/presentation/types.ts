import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface PresentationSpringConfig {
  stiffness?: number;
  damping?: number;
  restDelta?: number;
}

export interface PresentationBaseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Whether scroll progress is smoothed with a Framer Motion spring. Default true. */
  smooth?: boolean;
  /** Optional custom spring configuration when smooth is true. */
  springConfig?: PresentationSpringConfig;
}

export interface PresentationPinnedStep {
  id?: string;
  badge?: string;
  title: ReactNode;
  description?: ReactNode;
  visual?: ReactNode;
}

export interface PresentationPinnedSectionProps extends PresentationBaseProps {
  /** Pinned scroll runway in viewport-height multiples. Defaults to max(steps.length, 2). */
  length?: number;
  /** Fixed background layer rendered behind the pinned stage. */
  background?: ReactNode;
  /** Optional steps that crossfade and slide in sequentially while the section is locked. */
  steps?: PresentationPinnedStep[];
  /** Optional static overlay header inside the sticky viewport. */
  header?: ReactNode;
}

export interface PresentationHorizontalProps extends PresentationBaseProps {
  children: ReactNode;
  /** Optional pinned header rendered above the horizontal track. */
  header?: ReactNode;
  /** Pinned scroll runway in viewport-height multiples. Defaults to number of slides. */
  length?: number;
  /** Gap between slides. Default '2rem'. */
  gap?: string;
  /** Show bottom progress bar inside the locked viewport. Default true. */
  showProgress?: boolean;
}

export type PresentationZoomMode = "zoom-in" | "zoom-out" | "portal";

export interface PresentationZoomProps extends PresentationBaseProps {
  children: ReactNode;
  /** Pinned scroll runway in viewport-height multiples. Default 2.5. */
  length?: number;
  /** Zoom behavior mode: 'zoom-in' grows into place, 'zoom-out' shrinks away, 'portal' scales a center frame to full screen revealing overlay content. Default 'portal'. */
  mode?: PresentationZoomMode;
  /** Content revealed inside or over the zoomed portal once zoomed in. */
  overlay?: ReactNode;
  /** Optional backdrop layer behind the zooming target. */
  backdrop?: ReactNode;
}

export interface PresentationCardStackProps extends PresentationBaseProps {
  children: ReactNode;
  /** Height of each sticky card viewport. Default '82vh'. */
  itemHeight?: string | number;
  /** How much each covered card scales down per level. Default 0.06. */
  scaleStep?: number;
  /** Top offset step in pixels for each stacked card so headers peek out. Default 24. */
  topOffsetStep?: number;
}

export type PresentationSplitDirection = "horizontal" | "vertical";

export interface PresentationSplitProps extends PresentationBaseProps {
  children: ReactNode;
  /** Pinned scroll runway in viewport-height multiples. Default 2. */
  length?: number;
  /** Direction the two shutter panels part along. Default 'horizontal'. */
  direction?: PresentationSplitDirection;
  /** Content on the first (left or top) shutter panel. */
  panelA?: ReactNode;
  /** Content on the second (right or bottom) shutter panel. */
  panelB?: ReactNode;
  panelClassName?: string;
  panelStyle?: CSSProperties;
}

export interface PresentationParallaxLayer {
  id?: string;
  /** Vertical drift speed multiplier (-1 to 1). Negative recedes, positive advances. */
  speed: number;
  /** Optional scale multiplier at end of scroll. */
  scale?: [number, number];
  content: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface PresentationParallaxProps extends PresentationBaseProps {
  children?: ReactNode;
  /** Height of the parallax stage. Default '80vh'. */
  height?: string | number;
  /** Multi-depth layers that move at independent speeds on scroll. */
  layers?: PresentationParallaxLayer[];
}

export interface PresentationDeckSectionItem {
  id: string;
  label: string;
}

export interface PresentationDeckProps extends PresentationBaseProps {
  children: ReactNode;
  /** Section anchors to display in the floating presentation navigation dots. */
  sections?: PresentationDeckSectionItem[];
  /** Show top scroll progress bar. Default true. */
  showProgressBar?: boolean;
  /** Show floating side navigation dots & keyboard shortcuts hint. Default true. */
  showNavDots?: boolean;
}

export interface PresentationPopOutCardProps
  extends Omit<PresentationBaseProps, "title"> {
  /** Image source URL for the pop-out subject (transparent PNG works best). */
  imageSrc: string;
  /** Accessible alt text for the pop-out image. */
  imageAlt?: string;
  /** Optional eyebrow badge rendered inside the card bottom half. */
  badge?: ReactNode;
  /** Card title rendered inside the card bottom half. */
  title?: ReactNode;
  /** Card description or subtitle rendered inside the card bottom half. */
  description?: ReactNode;
  /** Whether the image tilts in 3D to face the cursor. Default true. */
  faceMouse?: boolean;
  /** Maximum degrees of 3D tilt when facing the mouse. Default 14. */
  maxTiltAngle?: number;
  /** Custom background for the card body. */
  cardBackground?: string;
  /** Custom text color for the card body. */
  cardTextColor?: string;
  /** Top half visual frame height in px or string. Default 200. */
  topHalfHeight?: number | string;
  /** Custom image max height or height in px or string. */
  imageHeight?: number | string;
  /** Custom image width (e.g. '160%', '170%'). Default '165%'. */
  imageWidth?: string;
  /** Percentage of bottom of the image to bury behind the bottom half card. Default 5. */
  buriedPercent?: number;
}
