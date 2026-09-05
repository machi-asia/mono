export type MediaFilterType = "all" | "image" | "pdf" | "docx";

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
  items?: MediaItem[];
  userId?: string;
  connected?: boolean;
  onSelect?: (item: MediaItem) => void;
  onUpload?: (files: FileList) => void | Promise<void>;
  onDelete?: (item: MediaItem) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  pageSize?: number;
  initialFilter?: MediaFilterType;
}

export const DEFAULT_ACCEPT =
  "image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
