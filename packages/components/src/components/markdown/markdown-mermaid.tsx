"use client";

import { useEffect, useId, useState } from "react";

let mermaidInitialized = false;

/**
 * Renders Mermaid diagrams (flowchart, sequence, gantt, pie, class, state, ER, mindmap, etc.).
 */
export function MarkdownMermaid({ code }: { code: string }) {
  const rawId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "strict",
          });
          mermaidInitialized = true;
        }
        const { svg: rendered } = await mermaid.render(`m-mermaid-${rawId}`, code.trim());
        if (!cancelled) {
          setSvg(rendered);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    }

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [code, rawId]);

  if (failed) {
    return (
      <pre className="m-md-pre">
        <code>{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="m-md-mermaid m-md-mermaid--loading" aria-busy="true">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="m-md-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
