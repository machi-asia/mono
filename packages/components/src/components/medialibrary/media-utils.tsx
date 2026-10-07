import type { ReactNode } from "react";
import {
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileAudio,
  FileVideo,
} from "lucide-react";
import type { MediaItem } from "./media-types";

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "--";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return "--";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function renderMediaIcon(type: MediaItem["type"], size = 32): ReactNode {
  switch (type) {
    case "image":
      return (
        <ImageIcon
          size={size}
          className="m-media-type-icon m-media-type-icon--image"
          aria-hidden="true"
        />
      );
    case "pdf":
      return (
        <FileText
          size={size}
          className="m-media-type-icon m-media-type-icon--pdf"
          aria-hidden="true"
        />
      );
    case "docx":
      return (
        <FileSpreadsheet
          size={size}
          className="m-media-type-icon m-media-type-icon--docx"
          aria-hidden="true"
        />
      );
    case "video":
      return (
        <FileVideo
          size={size}
          className="m-media-type-icon m-media-type-icon--video"
          aria-hidden="true"
        />
      );
    case "audio":
      return (
        <FileAudio
          size={size}
          className="m-media-type-icon m-media-type-icon--audio"
          aria-hidden="true"
        />
      );
    default:
      return (
        <FileCode
          size={size}
          className="m-media-type-icon m-media-type-icon--file"
          aria-hidden="true"
        />
      );
  }
}
