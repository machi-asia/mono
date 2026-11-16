"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface MarkdownImageProps {
  src: string;
  alt: string;
}

export function MarkdownImage({ src, alt }: MarkdownImageProps) {
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomed(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomed]);

  if (failed) {
    return null;
  }

  return (
    <>
      <span className="m-md-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || "Image"}
          className="m-md-image"
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onClick={() => setZoomed(true)}
          onError={() => setFailed(true)}
        />
        {alt ? <span className="m-md-image-caption">{alt}</span> : null}
      </span>

      {zoomed && typeof document !== "undefined"
        ? createPortal(
            <div
              className="m-md-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={alt || "Image preview"}
              onClick={() => setZoomed(false)}
            >
              <button
                type="button"
                className="m-md-lightbox-close"
                onClick={() => setZoomed(false)}
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>
              <div className="m-md-lightbox-content" onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || "Image"}
                  className="m-md-lightbox-img"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                {alt ? <p className="m-md-lightbox-caption">{alt}</p> : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
