"use client";

import { useEffect, useState } from "react";
import { Button } from "@mono/components";
import { ExternalLink, X } from "lucide-react";

/**
 * Dismissible modal shown on initial page load to inform visitors that the
 * Machi Asia landing page is still under development and link to the portfolio.
 */
export function UnderDevelopmentModal() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="machi-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className="machi-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="under-dev-modal-title"
      >
        <button
          type="button"
          className="machi-modal-close"
          aria-label="Close modal"
          onClick={() => setIsOpen(false)}
        >
          <X size={18} />
        </button>

        <h2 id="under-dev-modal-title" className="machi-modal-title">
          Under Development
        </h2>

        <p className="machi-modal-text">
          It appears this page is still under development. If you wish to find my portfolio, please click the button below.
        </p>

        <div className="machi-modal-actions">
          <a
            href="https://portfolio.machi.asia"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button variant="primary" size="md" icon={<ExternalLink size={16} />}>
              portfolio.machi.asia
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
