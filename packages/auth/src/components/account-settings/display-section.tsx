"use client";

import { useTheme } from "@mono/components";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export function DisplaySection() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "dark",
      label: "Dark",
      description: "Deep charcoal background with rich warm golden accents.",
      icon: <Moon size={20} />,
      previewClass: "auth-display-preview--dark",
    },
    {
      id: "light",
      label: "Light",
      description: "Crisp warm cream background with dark high-contrast text.",
      icon: <Sun size={20} />,
      previewClass: "auth-display-preview--light",
    },
    {
      id: "system",
      label: "System",
      description: "Automatically matches your device display appearance preferences.",
      icon: <Monitor size={20} />,
      previewClass: "auth-display-preview--system",
    },
  ];

  return (
    <section className="auth-settings-section auth-display-section">
      <h2 className="auth-settings-section-title">Display & Appearance</h2>
      <p className="auth-settings-section-desc">
        Customize the appearance and visual theme of the platform across all applications.
      </p>

      <div className="auth-display-grid">
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`auth-display-card${isSelected ? " auth-display-card--active" : ""}`}
              onClick={() => setTheme(t.id)}
              aria-pressed={isSelected}
            >
              <div className={`auth-display-preview ${t.previewClass}`}>
                <div className="auth-display-mock-window">
                  <div className="auth-display-mock-header">
                    <span className="auth-display-mock-dot" />
                    <span className="auth-display-mock-dot" />
                    <span className="auth-display-mock-dot" />
                  </div>
                  <div className="auth-display-mock-body">
                    <div className="auth-display-mock-line auth-display-mock-line--accent" />
                    <div className="auth-display-mock-line auth-display-mock-line--text" />
                    <div className="auth-display-mock-line auth-display-mock-line--muted" />
                  </div>
                </div>
              </div>

              <div className="auth-display-info">
                <div className="auth-display-header">
                  <div className="auth-display-title-group">
                    <span className="auth-display-icon">{t.icon}</span>
                    <span className="auth-display-name">{t.label}</span>
                  </div>
                  {isSelected && (
                    <span className="auth-display-badge">
                      <Check size={14} />
                      <span>Active</span>
                    </span>
                  )}
                </div>
                <p className="auth-display-desc">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
