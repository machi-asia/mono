"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Loader2 } from "lucide-react";

interface PdfThumbnailProps {
  url: string;
  name: string;
  className?: string;
  iconSize?: number;
}

// Global cache for PDF.js library load promise to avoid re-fetching script
let pdfjsPromise: Promise<any> | null = null;

function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR not supported"));
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);

  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(lib);
        } else {
          reject(new Error("pdfjsLib not found on window"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load pdf.js script"));
      document.head.appendChild(script);
    });
  }

  return pdfjsPromise;
}

export function PdfThumbnail({
  url,
  name,
  className = "m-media-pdf-thumb",
  iconSize = 36,
}: PdfThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);

    loadPdfJs()
      .then(async (pdfjs) => {
        if (isCancelled) return;
        const loadingTask = pdfjs.getDocument({ url });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Base unscaled viewport
        const unscaledViewport = page.getViewport({ scale: 1 });
        
        // Desired render resolution (crisp thumbnail rendering)
        const targetWidth = 300;
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore cancel error
          }
        }

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
        if (!isCancelled) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore cancel error
        }
      }
    };
  }, [url]);

  if (hasError) {
    return (
      <div className="m-media-doc-preview m-media-pdf-fallback" aria-label={`PDF ${name}`}>
        <FileText size={iconSize} className="m-media-type-icon m-media-type-icon--pdf" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`m-media-pdf-wrapper ${className}`} aria-label={`Preview of ${name}`}>
      {isLoading ? (
        <div className="m-media-pdf-loading">
          <Loader2 size={18} className="m-media-spin" aria-hidden="true" />
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        className="m-media-pdf-canvas"
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
}
