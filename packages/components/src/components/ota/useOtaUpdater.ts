"use client";

import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { OtaKit, type UpdateStagedEvent, type UpdateFailedEvent } from "@otakit/capacitor-updater";

export interface OtaUpdaterState {
  isSupported: boolean;
  isUpdating: boolean;
  progress: number;
  status: string;
  error: string | null;
  isComplete: boolean;
}

export function useOtaUpdater(): OtaUpdaterState {
  const [state, setState] = useState<OtaUpdaterState>({
    isSupported: false,
    isUpdating: false,
    progress: 0,
    status: "Idle",
    error: null,
    isComplete: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isNative = Capacitor.isNativePlatform();
    if (!isNative) {
      return;
    }

    setState((prev) => ({ ...prev, isSupported: true }));

    // Notify OtaKit that the current app bundle has loaded successfully
    try {
      OtaKit.notifyAppReady().catch(() => {
        // Silently catch if not running in native app
      });
    } catch {
      // Ignore in mock/test environments
    }

    let availableListener: { remove: () => void } | null = null;
    let stagedListener: { remove: () => void } | null = null;
    let failedListener: { remove: () => void } | null = null;

    async function registerListeners() {
      try {
        availableListener = await OtaKit.addListener(
          "updateAvailable",
          () => {
            setState((prev) => ({
              ...prev,
              isUpdating: true,
              progress: prev.progress > 0 ? prev.progress : 5,
              status: "Update available, downloading...",
            }));
          }
        );

        stagedListener = await OtaKit.addListener(
          "updateStaged",
          (_event: UpdateStagedEvent) => {
            setState({
              isSupported: true,
              isUpdating: true,
              progress: 100,
              status: "Update ready",
              error: null,
              isComplete: true,
            });

            // Automatically hide popup after short delay
            setTimeout(() => {
              setState((prev) => ({ ...prev, isUpdating: false }));
            }, 2500);
          }
        );

        failedListener = await OtaKit.addListener(
          "downloadFailed",
          (info: UpdateFailedEvent) => {
            setState((prev) => ({
              ...prev,
              isUpdating: true,
              status: "Update failed",
              error: info?.version ? `Failed to download version ${info.version}` : "Failed to download update",
              isComplete: false,
            }));

            setTimeout(() => {
              setState((prev) => ({ ...prev, isUpdating: false }));
            }, 4000);
          }
        );
      } catch (err) {
        console.warn("[OTA Updater] Error registering listeners", err);
      }
    }

    registerListeners();

    return () => {
      availableListener?.remove();
      stagedListener?.remove();
      failedListener?.remove();
    };
  }, []);

  return state;
}

