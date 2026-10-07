import type { UserRoleTier } from "./image-compressor";

export type MediaFilterType = "all" | "image" | "pdf" | "docx";
export type MediaViewMode = "gallery" | "list";

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "pdf" | "docx" | "video" | "audio" | "file";
  size?: number;
  path?: string;
  createdAt?: string;
}

export interface MediaLibraryProps {
  variant?: "standalone" | "popup";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  allowedTypes?: Array<MediaItem["type"]>;
  modalTitle?: string;
  role?: UserRoleTier;
  items?: MediaItem[];
  userId?: string;
  connected?: boolean;
  onSelect?: (item: MediaItem) => void;
  onUpload?: (files: FileList) => void | Promise<void>;
  onDelete?: (item: MediaItem) => void | Promise<void>;
  onRename?: (item: MediaItem, newName: string) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  pageSize?: number;
  initialFilter?: MediaFilterType;
  defaultViewMode?: MediaViewMode;
  viewMode?: MediaViewMode;
  onViewModeChange?: (mode: MediaViewMode) => void;
}

export const DEFAULT_ACCEPT =
  "image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
