"use client";

import { useEffect, useRef } from "react";

export interface AdSenseUnitProps {
  /** AdSense ad slot ID (NEXT_PUBLIC_ADSENSE_SLOT_*) */
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  fullWidth?: boolean;
  /** Fixed ad size in px. When set, the unit is rendered at these exact
   *  dimensions and AdSense auto-size (which writes empty width/height
   *  styles when it can't measure the container) is disabled. */
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Renders a single Google AdSense display ad unit.
 *
 * Script loading is handled separately by <GoogleAdSense> in layout.tsx —
 * this component only manages the <ins> element and the adsbygoogle.push() call.
 */
export function AdSenseUnit({
  slot,
  className,
  format = "auto",
  fullWidth = true,
  width,
  height,
  style,
}: AdSenseUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "";
  const configured =
    process.env.NODE_ENV === "production" &&
    !!publisherId &&
    publisherId !== "ca-pub-XXXXXXXXXXXXXXXX";
  const fixedSize = width !== undefined && height !== undefined;

  useEffect(() => {
    if (!configured) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Non-fatal — adsbygoogle may not be ready yet on first render
    }
  }, [configured]);

  if (!configured) {
    return (
      <div className={`adsense-placeholder ${className ?? ""}`} style={style}>
        <span className="adsense-placeholder-label">Ad</span>
      </div>
    );
  }

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className ?? ""}`}
      style={{
        display: "block",
        ...(fixedSize ? { width: `${width}px`, height: `${height}px` } : {}),
        ...style,
      }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={
        (fixedSize ? false : fullWidth) ? "true" : "false"
      }
    />
  );
}
