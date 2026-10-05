"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { User, UserIdentity } from "@supabase/supabase-js";
import { User as UserIcon, Check, Image as ImageIcon, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import { createClient } from "../client";
import { GoogleIcon } from "../icons/google";
import { GithubIcon } from "../icons/github";

interface ProfileSectionProps {
  user: User;
}

export interface AvatarOption {
  id: string;
  source: string;
  label: string;
  url: string;
  type: "linked" | "generated" | "custom";
  provider?: string;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const meta = user.user_metadata ?? {};
  const currentName =
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    user.email?.split("@")[0] ||
    "User";

  const currentAvatar =
    meta.avatar_url ||
    meta.picture ||
    meta.avatar ||
    meta.photo_url ||
    "";

  const [displayName, setDisplayName] = useState(currentName);
  const [activeAvatar, setActiveAvatar] = useState(currentAvatar);
  const [customUrl, setCustomUrl] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Sync state if user prop updates
  useEffect(() => {
    const latestMeta = user.user_metadata ?? {};
    const latestName =
      latestMeta.display_name ||
      latestMeta.full_name ||
      latestMeta.name ||
      latestMeta.user_name ||
      user.email?.split("@")[0] ||
      "User";
    const latestAvatar =
      latestMeta.avatar_url ||
      latestMeta.picture ||
      latestMeta.avatar ||
      latestMeta.photo_url ||
      "";
    setDisplayName(latestName);
    setActiveAvatar(latestAvatar);
  }, [user]);

  // Extract avatar options from linked accounts and metadata
  const avatarOptions: AvatarOption[] = [];
  const identities: UserIdentity[] = user.identities ?? [];

  for (const identity of identities) {
    const idData = identity.identity_data ?? {};
    let url: string | undefined;

    if (identity.provider === "google") {
      url = idData.picture || idData.avatar_url;
      if (url) {
        avatarOptions.push({
          id: `google-${identity.id}`,
          source: "Google",
          label: `Google (${idData.email || "Account"})`,
          url,
          type: "linked",
          provider: "google",
        });
      }
    } else if (identity.provider === "github") {
      url = idData.avatar_url;
      if (url) {
        avatarOptions.push({
          id: `github-${identity.id}`,
          source: "GitHub",
          label: `GitHub (@${idData.user_name || idData.name || "Profile"})`,
          url,
          type: "linked",
          provider: "github",
        });
      }
    } else if (identity.provider === "discord") {
      url = idData.avatar_url || idData.picture;
      if (url) {
        avatarOptions.push({
          id: `discord-${identity.id}`,
          source: "Discord",
          label: `Discord (${idData.email || idData.name || "Account"})`,
          url,
          type: "linked",
          provider: "discord",
        });
      }
    } else if (identity.provider === "twitter") {
      url = idData.avatar_url;
      if (url) {
        avatarOptions.push({
          id: `twitter-${identity.id}`,
          source: "X / Twitter",
          label: `X / Twitter (@${idData.user_name || "Profile"})`,
          url,
          type: "linked",
          provider: "twitter",
        });
      }
    } else if (identity.provider === "facebook") {
      url = idData.picture?.data?.url || idData.avatar_url;
      if (url) {
        avatarOptions.push({
          id: `facebook-${identity.id}`,
          source: "Facebook",
          label: `Facebook (${idData.name || "Account"})`,
          url,
          type: "linked",
          provider: "facebook",
        });
      }
    }
  }

  // Add Default Initials Avatar
  const seed = encodeURIComponent(displayName || user.email || "User");
  const defaultInitialsUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=d4af37&textColor=0b0f19`;
  avatarOptions.push({
    id: "default-initials",
    source: "System",
    label: "Generated Initials",
    url: defaultInitialsUrl,
    type: "generated",
  });

  // If current active avatar is a custom URL not in the options, add it as Custom
  if (
    activeAvatar &&
    !avatarOptions.some((opt) => opt.url === activeAvatar) &&
    activeAvatar.startsWith("http")
  ) {
    avatarOptions.unshift({
      id: "custom-active",
      source: "Custom",
      label: "Current Custom Picture",
      url: activeAvatar,
      type: "custom",
    });
  }

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setNameError(null);
    setNameSuccess(false);

    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError("Display name cannot be empty.");
      return;
    }

    setSavingName(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: trimmed,
          full_name: trimmed,
          name: trimmed,
        },
      });

      if (error) {
        setNameError(error.message);
      } else {
        setNameSuccess(true);
        if (data.user) {
          const updatedMeta = data.user.user_metadata ?? {};
          setDisplayName(
            updatedMeta.display_name ||
            updatedMeta.full_name ||
            updatedMeta.name ||
            trimmed,
          );
        }
      }
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Failed to update profile name");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSelectAvatar(url: string) {
    if (updatingAvatar || url === activeAvatar) return;
    setAvatarError(null);
    setAvatarSuccess(false);
    setUpdatingAvatar(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        data: {
          avatar_url: url,
          picture: url,
        },
      });

      if (error) {
        setAvatarError(error.message);
      } else {
        setActiveAvatar(url);
        setAvatarSuccess(true);
        if (data.user) {
          const updatedMeta = data.user.user_metadata ?? {};
          setActiveAvatar(updatedMeta.avatar_url || updatedMeta.picture || url);
        }
      }
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Failed to update profile picture");
    } finally {
      setUpdatingAvatar(false);
    }
  }

  async function handleApplyCustomUrl(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = customUrl.trim();
    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
      setAvatarError("Please enter a valid image URL starting with http:// or https://");
      return;
    }
    await handleSelectAvatar(trimmed);
    setCustomUrl("");
  }

  return (
    <section className="auth-settings-section auth-profile-section">
      <div className="auth-profile-header">
        <h2 className="auth-settings-section-title">Profile & Identity</h2>
        <p className="auth-settings-section-desc">
          Manage your public profile name and choose your preferred profile picture from your linked accounts.
        </p>
      </div>

      {/* Current Profile Summary Card */}
      <div className="auth-profile-card">
        <div className="auth-profile-avatar-wrap">
          {activeAvatar ? (
            <img
              src={activeAvatar}
              alt={displayName}
              className="auth-profile-avatar-img"
              onError={(e) => {
                // Fallback to placeholder if image load fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="auth-profile-avatar-placeholder">
              <UserIcon size={32} />
            </div>
          )}
        </div>
        <div className="auth-profile-meta">
          <h3 className="auth-profile-name">{displayName}</h3>
          <p className="auth-profile-email">{user.email || "No email on file"}</p>
          <div className="auth-profile-badges">
            <span className="auth-profile-badge">
              {user.is_anonymous ? "Guest Account" : "Verified Account"}
            </span>
            {identities.length > 0 ? (
              <span className="auth-profile-badge auth-profile-badge--linked">
                {identities.length} {identities.length === 1 ? "Provider" : "Providers"} Linked
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Manual Display Name Form */}
      <form className="auth-settings-form auth-profile-form" onSubmit={handleSaveName}>
        <label className="auth-settings-field">
          <span>Display Name</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            maxLength={60}
            required
          />
        </label>
        {nameError && <p className="auth-settings-error">{nameError}</p>}
        {nameSuccess && <p className="auth-settings-success">Display name updated successfully.</p>}
        <button
          type="submit"
          className="auth-settings-btn auth-settings-btn--primary"
          disabled={savingName || displayName.trim() === currentName}
        >
          {savingName ? "Saving…" : "Save Name"}
        </button>
      </form>

      <div className="auth-privacy-divider" style={{ margin: "var(--space-5) 0 var(--space-4)" }} />

      {/* Profile Picture / Avatar Selector from Linked Accounts */}
      <div className="auth-profile-avatar-section">
        <div className="auth-profile-section-heading">
          <h3 className="auth-privacy-heading">Profile Picture</h3>
          <p className="auth-privacy-subtext">
            Choose which profile picture to use across Machi Asia products. You can switch between avatars from any of your linked accounts or provide a custom image.
          </p>
        </div>

        {avatarError && <p className="auth-settings-error">{avatarError}</p>}
        {avatarSuccess && <p className="auth-settings-success">Profile picture updated.</p>}

        <div className="auth-avatar-grid" role="radiogroup" aria-label="Profile picture choices">
          {avatarOptions.map((opt) => {
            const isSelected = activeAvatar === opt.url;
            return (
              <button
                key={opt.id}
                type="button"
                className={`auth-avatar-card${isSelected ? " auth-avatar-card--active" : ""}`}
                onClick={() => handleSelectAvatar(opt.url)}
                disabled={updatingAvatar}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="auth-avatar-thumb-wrap">
                  <img
                    src={opt.url}
                    alt={opt.label}
                    className="auth-avatar-thumb"
                    crossOrigin="anonymous"
                  />
                  {isSelected && (
                    <span className="auth-avatar-check" aria-label="Active profile picture">
                      <Check size={12} />
                    </span>
                  )}
                </div>
                <div className="auth-avatar-card-info">
                  <div className="auth-avatar-card-top">
                    {opt.provider === "google" && <GoogleIcon size={14} />}
                    {opt.provider === "github" && <GithubIcon size={14} />}
                    {opt.type === "generated" && <Sparkles size={14} style={{ color: "var(--color-primary)" }} />}
                    {opt.type === "custom" && <ImageIcon size={14} style={{ color: "var(--color-text-muted)" }} />}
                    <span className="auth-avatar-source">{opt.source}</span>
                  </div>
                  <span className="auth-avatar-label">{opt.label}</span>
                </div>
                {isSelected ? (
                  <span className="auth-avatar-status auth-avatar-status--active">Active</span>
                ) : (
                  <span className="auth-avatar-status">Select</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Picture URL */}
        <form className="auth-profile-custom-avatar" onSubmit={handleApplyCustomUrl}>
          <label className="auth-settings-field" style={{ flex: 1 }}>
            <span>Custom Image URL</span>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </label>
          <button
            type="submit"
            className="auth-settings-btn auth-settings-btn--secondary"
            disabled={updatingAvatar || !customUrl.trim()}
            style={{ alignSelf: "flex-end" }}
          >
            Apply URL
          </button>
        </form>
      </div>
    </section>
  );
}
