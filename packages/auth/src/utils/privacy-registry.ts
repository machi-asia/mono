"use client";

import { useCallback, useEffect, useState } from "react";

export interface AppDataDisclosure {
  appKey: string;
  appName: string;
  appPath: string;
  description: string;
  dataCollected: string[];
  purpose: string;
  requirement: "required" | "optional";
  controlType?: "toggle" | "action";
  controlKey?: string;
  controlLabel?: string;
  /** Optional localStorage key used to persist toggle state (defaults to `machi_privacy_${controlKey}`) */
  storageKey?: string;
  /** Default boolean value when `controlType === "toggle"` (defaults to true) */
  defaultEnabled?: boolean;
  /** Optional callback executed when `controlType === "action"` is triggered */
  onAction?: () => void | Promise<void>;
}

const INITIAL_DISCLOSURES: AppDataDisclosure[] = [
  {
    appKey: "machi-asia",
    appName: "Machi Asia (Home & Billing Hub)",
    appPath: "apps/machi-asia",
    description:
      "Central authentication, multi-account switching, and subscription management across the ecosystem.",
    dataCollected: [
      "Account email address and unique User UUID",
      "OAuth profile metadata (display name, avatar image URL)",
      "Secure encrypted session tokens (JWT) and PKCE verifiers",
      "Account security credentials and linked identity providers",
    ],
    purpose:
      "Authenticating your identity across subdomains, verifying active product subscriptions, managing account switches, and password recovery.",
    requirement: "required",
  },
  {
    appKey: "rose",
    appName: "Rose AI (Personal Companion)",
    appPath: "apps/rose",
    description: "Personalized companion conversations and long-term memory retrieval.",
    dataCollected: [
      "User chat prompts and message dialogue history",
      "Companion persona customization parameters and active model settings",
      "Conversation memory anchors for dialogue continuity",
    ],
    purpose:
      "Generating contextual AI responses, maintaining conversational memory over time, and tailoring companion personality.",
    requirement: "required",
    controlType: "action",
    controlKey: "clear_rose_history",
    controlLabel: "Clear Rose AI Conversation History",
    onAction: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("rose_chat_history");
      }
    },
  },
  {
    appKey: "calculator",
    appName: "Game Production Calculator",
    appPath: "apps/calculator",
    description: "Factory rate planner, item catalog, and recipe dependency tree graphs.",
    dataCollected: [
      "Factory production rate targets and layout configurations",
      "Recipe node graph overrides and custom item throughputs",
      "Selected game presets and item catalog filter preferences",
    ],
    purpose:
      "Saving calculation graphs in the browser and synchronizing factory production plans across your devices.",
    requirement: "optional",
    controlType: "toggle",
    controlKey: "calc_sync_enabled",
    storageKey: "machi_calc_cloud_sync",
    defaultEnabled: true,
    controlLabel: "Enable cloud synchronization for factory graphs and recipes",
  },
  {
    appKey: "hells-forge",
    appName: "Hell's Forge (2D Exploration Space)",
    appPath: "apps/hells-forge",
    description:
      "Realtime multiplayer canvas with WASD movement and Redis room event synchronization.",
    dataCollected: [
      "Ephemeral player coordinates (x, y) and movement vector velocities",
      "Multiplayer room session connection timestamps and ping telemetry",
    ],
    purpose:
      "Synchronizing player movements on screen, handling circle collisions, and rendering live multiplayer positions (data is transient and not permanently persisted).",
    requirement: "required",
  },
  {
    appKey: "docs",
    appName: "Documentation & Developer Hub",
    appPath: "apps/docs",
    description: "Component showcases, API references, and interactive live previews.",
    dataCollected: [
      "Theme preference (dark/light mode)",
      "Client-side component search filter state",
    ],
    purpose: "Remembering your documentation viewing preferences and theme settings.",
    requirement: "optional",
  },
  {
    appKey: "media-library",
    appName: "Personal Media Library & Cloud Assets",
    appPath: "Account Settings & @mono/components",
    description:
      "User-isolated cloud storage repository for personal pictures and documents across Machi Asia applications.",
    dataCollected: [
      "User-uploaded image and document binary payloads",
      "File metadata (filenames, MIME types, file byte sizes, upload timestamps)",
      "Public CDN bucket asset URLs associated with user UUID",
    ],
    purpose:
      "Storing, renaming, deleting, and securely referencing user-uploaded media files and images across all platform applications.",
    requirement: "optional",
  },
  {
    appKey: "telemetry",
    appName: "Platform Performance & Diagnostics",
    appPath: "All Apps (apps/*)",
    description: "Anonymous error tracking and frontend performance metrics.",
    dataCollected: [
      "Anonymous page load durations and Web Vitals metrics",
      "Client-side error stack traces (de-identified; no prompts, emails, or personal data)",
    ],
    purpose:
      "Detecting performance regressions, diagnosing crashes, and optimizing speed across all applications.",
    requirement: "optional",
    controlType: "toggle",
    controlKey: "telemetry_enabled",
    storageKey: "machi_telemetry_optin",
    defaultEnabled: true,
    controlLabel: "Allow anonymous diagnostic telemetry and error crash logs",
  },
];

/**
 * Global dynamic registry of application data & privacy disclosures.
 * Apps and feature modules can register new disclosures at runtime via `registerPrivacyDisclosure`.
 */
export const PRIVACY_DISCLOSURES_REGISTRY = new Map<string, AppDataDisclosure>(
  INITIAL_DISCLOSURES.map((d) => [d.appKey, d])
);

const CONSENT_EVENT_NAME = "mono:privacy-consent-change";

/**
 * Registers or updates an application or feature module data disclosure in the global registry.
 */
export function registerPrivacyDisclosure(disclosure: AppDataDisclosure): AppDataDisclosure {
  const normalized: AppDataDisclosure = {
    defaultEnabled: true,
    ...disclosure,
  };
  PRIVACY_DISCLOSURES_REGISTRY.set(normalized.appKey, normalized);
  return normalized;
}

/**
 * Returns all registered application data disclosures.
 */
export function listPrivacyDisclosures(): AppDataDisclosure[] {
  return Array.from(PRIVACY_DISCLOSURES_REGISTRY.values());
}

/**
 * Resolves the localStorage key for a given privacy `controlKey`.
 */
export function resolvePrivacyStorageKey(controlKey: string): string {
  for (const item of PRIVACY_DISCLOSURES_REGISTRY.values()) {
    if (item.controlKey === controlKey && item.storageKey) {
      return item.storageKey;
    }
  }
  if (controlKey === "telemetry_enabled") return "machi_telemetry_optin";
  if (controlKey === "calc_sync_enabled") return "machi_calc_cloud_sync";
  return `machi_privacy_${controlKey}`;
}

/**
 * Reads the current boolean consent state for a privacy toggle `controlKey`.
 */
export function getPrivacyConsent(controlKey: string, defaultValue = true): boolean {
  if (typeof window === "undefined") return defaultValue;
  try {
    const key = resolvePrivacyStorageKey(controlKey);
    const stored = window.localStorage.getItem(key);
    if (stored === null) return defaultValue;
    return stored === "true";
  } catch {
    return defaultValue;
  }
}

/**
 * Persists a boolean consent state for a privacy toggle `controlKey` and notifies active listeners.
 */
export function setPrivacyConsent(controlKey: string, enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const key = resolvePrivacyStorageKey(controlKey);
    window.localStorage.setItem(key, String(enabled));
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT_NAME, {
        detail: { controlKey, enabled },
      })
    );
  } catch {
    // Ignore storage write failures
  }
}

/**
 * Reactive hook to read and toggle user consent for any registered privacy `controlKey`
 * (e.g. `"telemetry_enabled"`, `"calc_sync_enabled"`, or custom module consent keys).
 */
export function usePrivacyConsent(
  controlKey: string,
  defaultValue = true
): [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabledState] = useState<boolean>(() =>
    getPrivacyConsent(controlKey, defaultValue)
  );

  useEffect(() => {
    setEnabledState(getPrivacyConsent(controlKey, defaultValue));

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ controlKey: string; enabled: boolean }>;
      if (custom.detail?.controlKey === controlKey) {
        setEnabledState(custom.detail.enabled);
      }
    };

    window.addEventListener(CONSENT_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(CONSENT_EVENT_NAME, handleUpdate);
  }, [controlKey, defaultValue]);

  const updateConsent = useCallback(
    (next: boolean) => {
      setEnabledState(next);
      setPrivacyConsent(controlKey, next);
    },
    [controlKey]
  );

  return [enabled, updateConsent];
}
