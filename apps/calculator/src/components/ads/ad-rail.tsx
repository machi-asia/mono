"use client";

import { AdSenseUnit } from "./adsense-unit";

/**
 * Vertical ad rail on the right side of the viewport.
 * Uses auto-format responsive sizing — AdSense measures the rail container
 * width and picks the best ad size automatically, matching the unit config
 * from the AdSense dashboard.
 */
export function AdRail() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL ?? "XXXXXXXXXX";

  return (
    <aside className="ad-rail" aria-label="Advertisement">
      <div className="ad-rail-sticky">
        <AdSenseUnit
          slot={slot}
          format="auto"
          fullWidth={false}
          width={160}
          height={600}
          className="ad-rail-unit"
        />
      </div>
    </aside>
  );
}
