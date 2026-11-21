"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export interface WikiGalleryItem {
  src: string;
  caption?: string;
}

interface WikiGalleryProps {
  title?: string;
  items: WikiGalleryItem[];
}

export function WikiGallery({ title = "Photos & Certificates", items }: WikiGalleryProps) {
  const [page, setPage] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<WikiGalleryItem | null>(null);

  if (!items || items.length === 0) return null;

  const pageSize = 6;
  const totalPages = Math.ceil(items.length / pageSize);
  const start = page * pageSize;
  const end = Math.min(start + pageSize, items.length);
  const visibleItems = items.slice(start, end);

  return (
    <div
      style={{
        margin: "1.25rem 0",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(255, 255, 255, 0.02)",
        overflow: "hidden",
      }}
    >
      {/* Header bar matching original wiki gallery */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(255, 255, 255, 0.03)",
          fontSize: "0.75rem",
          color: "#a1a1aa",
        }}
      >
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Previous gallery page"
          style={{
            padding: "4px",
            borderRadius: "4px",
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: page === 0 ? "default" : "pointer",
            opacity: page === 0 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontWeight: 500, letterSpacing: "0.02em" }}>
          {title} &middot; {start + 1}&ndash;{end} of {items.length}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Next gallery page"
          style={{
            padding: "4px",
            borderRadius: "4px",
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: page >= totalPages - 1 ? "default" : "pointer",
            opacity: page >= totalPages - 1 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 3-column grid of items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1px",
          background: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {visibleItems.map((item, idx) => (
          <button
            key={`${item.src}-${idx}`}
            type="button"
            onClick={() => setLightboxItem(item)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem",
              background: "#121215",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "4px",
                background: "rgba(0, 0, 0, 0.35)",
              }}
            >
              <img
                src={item.src}
                alt={item.caption || "Gallery image"}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                loading="lazy"
              />
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  padding: "4px",
                  borderRadius: "9999px",
                  background: "rgba(0, 0, 0, 0.65)",
                  color: "rgba(255, 255, 255, 0.85)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ZoomIn size={12} />
              </span>
            </div>
            {item.caption && (
              <span
                style={{
                  marginTop: "0.625rem",
                  fontSize: "0.75rem",
                  color: "#a1a1aa",
                  lineHeight: 1.35,
                }}
              >
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.88)",
            padding: "1rem",
          }}
          onClick={() => setLightboxItem(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "56rem",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lightbox"
              style={{
                position: "absolute",
                top: "-2.5rem",
                right: 0,
                padding: "6px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </button>
            <img
              src={lightboxItem.src}
              alt={lightboxItem.caption || "Preview"}
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                borderRadius: "8px",
                objectFit: "contain",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            />
            {lightboxItem.caption && (
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.875rem",
                  color: "#d4d4d8",
                  textAlign: "center",
                }}
              >
                {lightboxItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
