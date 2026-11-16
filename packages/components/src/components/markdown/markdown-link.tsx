"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { ExternalLink, Globe } from "lucide-react";

export interface MarkdownLinkProps {
  href: string;
  isExternal: boolean;
  children: ReactNode;
}

interface SitePreviewData {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  publisher?: string;
}

const previewCache = new Map<string, SitePreviewData>();

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function MarkdownLink({ href, isExternal, children }: MarkdownLinkProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<SitePreviewData | null>(() =>
    isExternal ? previewCache.get(href) ?? null : null
  );
  const [loading, setLoading] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const fetchPreview = async () => {
    if (!isExternal || previewCache.has(href)) {
      const cached = previewCache.get(href);
      if (cached) setPreview(cached);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(href)}`);
      if (res.ok) {
        const json: any = await res.json();
        const data = json?.data;
        if (data) {
          const parsed: SitePreviewData = {
            title: data.title || undefined,
            description: data.description || undefined,
            image: data.image?.url || undefined,
            logo: data.logo?.url || undefined,
            publisher: data.publisher || undefined,
          };
          previewCache.set(href, parsed);
          setPreview(parsed);
          return;
        }
      }
    } catch {
      // Fallback to basic domain preview
    } finally {
      setLoading(false);
    }

    const fallback: SitePreviewData = { publisher: getHostname(href) };
    previewCache.set(href, fallback);
    setPreview(fallback);
  };

  const handleMouseEnter = () => {
    if (!isExternal) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setShowPreview(true);
      void fetchPreview();
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 150);
  };

  const hostname = isExternal ? getHostname(href) : "";
  const faviconUrl = isExternal
    ? preview?.logo || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`
    : undefined;

  return (
    <span
      className="m-md-link-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={href}
        className={`m-md-link m-md-link-pill ${isExternal ? "is-external" : ""}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {isExternal && faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={faviconUrl}
            alt=""
            className="m-md-link-favicon"
            width={13}
            height={13}
            aria-hidden="true"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
        ) : null}
        {children}
        {isExternal ? (
          <ExternalLink size={11} className="m-md-external-icon" aria-hidden="true" />
        ) : null}
      </a>

      {isExternal && showPreview ? (
        <span className="m-md-link-preview" role="tooltip">
          {preview?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://wsrv.nl/?url=${encodeURIComponent(preview.image)}`}
              alt=""
              className="m-md-link-preview-img"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          ) : null}
          <span className="m-md-link-preview-body">
            <span className="m-md-link-preview-site">
              <Globe size={12} aria-hidden="true" />
              <span>{preview?.publisher || hostname}</span>
            </span>
            <span className="m-md-link-preview-title">
              {preview?.title || (loading ? "Loading preview..." : hostname)}
            </span>
            {preview?.description ? (
              <span className="m-md-link-preview-desc">{preview.description}</span>
            ) : null}
          </span>
        </span>
      ) : null}
    </span>
  );
}
