"use client";

import { useOtaUpdater } from "./useOtaUpdater";
import { CloudDownload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import "./ota.css";

export interface OtaUpdateNotifierProps {
  /** Optional custom position class or override */
  className?: string;
  /** Force show during development or testing */
  forceShow?: boolean;
  /** Mock progress value if forceShow is enabled */
  mockProgress?: number;
  /** Mock status text if forceShow is enabled */
  mockStatus?: string;
}

export function OtaUpdateNotifier({
  className = "",
  forceShow = false,
  mockProgress,
  mockStatus,
}: OtaUpdateNotifierProps) {
  const ota = useOtaUpdater();

  const isVisible = forceShow || (ota.isSupported && ota.isUpdating);
  if (!isVisible) {
    return null;
  }

  const progress = forceShow ? (mockProgress ?? 45) : ota.progress;
  const status = forceShow ? (mockStatus ?? "Downloading live update...") : ota.status;
  const isComplete = !forceShow && ota.isComplete;
  const hasError = !forceShow && Boolean(ota.error);

  return (
    <div
      className={`m-ota-notifier ${isComplete ? "m-ota-notifier--complete" : ""} ${hasError ? "m-ota-notifier--error" : ""} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="App update progress"
    >
      <div className="m-ota-icon-wrap">
        {isComplete ? (
          <CheckCircle2 className="m-ota-icon m-ota-icon--success" aria-hidden="true" />
        ) : hasError ? (
          <AlertCircle className="m-ota-icon m-ota-icon--error" aria-hidden="true" />
        ) : progress > 0 ? (
          <CloudDownload className="m-ota-icon" aria-hidden="true" />
        ) : (
          <RefreshCw className="m-ota-icon m-ota-icon--spin" aria-hidden="true" />
        )}
      </div>

      <div className="m-ota-body">
        <div className="m-ota-header">
          <span className="m-ota-status">{hasError ? (ota.error || "Update error") : status}</span>
          <span className="m-ota-percent">{progress}%</span>
        </div>
        <div className="m-ota-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`m-ota-bar ${isComplete ? "m-ota-bar--complete" : ""} ${hasError ? "m-ota-bar--error" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
