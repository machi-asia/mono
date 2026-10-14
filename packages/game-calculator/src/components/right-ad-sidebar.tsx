"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export interface AdSidebarProps {
  client?: string;
  slot?: string;
  className?: string;
}

export function AdSidebar({
  client = "ca-pub-2144375932551709",
  slot,
  className = "",
}: AdSidebarProps) {
  // Construct the sandboxed HTML for the ad
  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
    }
    .adsbygoogle {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  </style>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>
</head>
<body>
  <ins class="adsbygoogle"
       data-ad-client="${client}"
       ${slot ? `data-ad-slot="${slot}"` : ""}></ins>
  <script>
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  </script>
</body>
</html>`;

  return (
    <aside
      className={`hidden xl:flex flex-col shrink-0 bg-[#0c0d10] border-l border-zinc-800/80 w-[160px] 2xl:w-[200px] z-20 select-none p-0 m-0 ${className}`}
      aria-label="Advertisement Sidebar"
    >
      <iframe
        title="Advertisement"
        srcDoc={adHtml}
        scrolling="no"
        tabIndex={-1}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        className="w-full h-full border-0 p-0 m-0 overflow-hidden block"
      />
    </aside>
  );
}

// Backwards-compatible export
export const RightAdSidebar = AdSidebar;
export const LeftAdSidebar = AdSidebar;
