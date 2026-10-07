"use client";

import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

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

    // Notify Capgo that the current app bundle has loaded successfully
    try {
      CapacitorUpdater.notifyAppReady().catch(() => {
        // Silently catch if not supported or not running from Capgo bundle
      });
    } catch {
      // Ignore in mock/test environments
    }

    let downloadListener: { remove: () => void } | null = null;
    let completeListener: { remove: () => void } | null = null;
    let failedListener: { remove: () => void } | null = null;
    let availableListener: { remove: () => void } | null = null;

    async function registerListeners() {
      try {
        downloadListener = await CapacitorUpdater.addListener(
          "download",
          (info) => {
            setState({
              isSupported: true,
              isUpdating: true,
              progress: Math.min(100, Math.max(0, Math.round(info.percent))),
              status: "Downloading update...",
              error: null,
              isComplete: false,
            });
          }
        );

        availableListener = await CapacitorUpdater.addListener(
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

        completeListener = await CapacitorUpdater.addListener(
          "downloadComplete",
          () => {
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

        failedListener = await CapacitorUpdater.addListener(
          "downloadFailed",
          (info) => {
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
      downloadListener?.remove();
      availableListener?.remove();
      completeListener?.remove();
      failedListener?.remove();
    };
  }, []);

  return state;
}
