/**
 * AdSenseScript — Server Component
 *
 * Renders the AdSense loader <script> tag as a direct child of <html>
 * (outside <body>), which keeps it entirely out of React's client-side
 * reconciliation tree. This avoids:
 *   - "Encountered a script tag while rendering React component" (React 19)
 *   - "data-nscript attribute" (added only by next/script, not plain <script>)
 *
 * Next.js hoists <script> tags that are direct children of <html> into <head>
 * in the final HTML output.
 */

interface AdSenseScriptProps {
  publisherId: string;
}

export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
