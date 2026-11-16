"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { AuthNavbar } from "@mono/auth";
import { Button } from "@mono/components";
import { PanelLeft, PanelLeftClose, Plus, RotateCcw } from "lucide-react";

export interface RoseNavbarProps {
  currentPath?: string;
  className?: string;
}

export function RoseNavbar({ className = "" }: RoseNavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener("rose:toggle-sidebar", handleToggle);
    return () => window.removeEventListener("rose:toggle-sidebar", handleToggle);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rose:toggle-sidebar"));
    }
  };

  const handleNewConversation = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rose:new-conversation"));
    }
  };

  const handleClearConversation = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rose:clear-conversation"));
    }
  };

  return (
    <AuthNavbar
      variant="floating"
      className={className}
      brand={
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2, 8px)" }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            title={sidebarOpen ? "Hide conversations panel" : "Show conversations panel"}
            aria-label={sidebarOpen ? "Hide conversations panel" : "Show conversations panel"}
            icon={sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            style={{ width: "32px", height: "32px", padding: 0 }}
          />

          <NextLink
            href="/"
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2, 8px)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1.5px solid var(--color-primary, #d4af37)",
                background: "var(--color-surface, #141416)",
                boxShadow: "0 0 10px rgb(212 175 55 / 30%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rose/happy.png"
                alt="Rose"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </span>
            <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Rose AI</span>
          </NextLink>
        </div>
      }
      links={[]}
      actions={
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1, 4px)" }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            title="Start new conversation"
            aria-label="Start new conversation"
            icon={<Plus size={16} />}
            style={{ width: "32px", height: "32px", padding: 0 }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            title="Reset active conversation"
            aria-label="Reset active conversation"
            icon={<RotateCcw size={16} />}
            style={{ width: "32px", height: "32px", padding: 0 }}
          />
        </div>
      }
      showUsageMenuItem
      showDisplayMenuItem
    />
  );
}
