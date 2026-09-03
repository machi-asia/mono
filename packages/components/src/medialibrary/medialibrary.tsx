"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import {
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileAudio,
  FileVideo,
  File as FileIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@mono/auth";
import {
  createClient,
  listUserMedia,
  uploadUserMedia,
  deleteUserMedia,
  detectMediaType,
  type MediaFileRecord,
} from "@mono/database";
import "./medialibrary.css";

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

const DEFAULT_ACCEPT = "image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "--";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(isoString?: string): string {
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

export function MediaLibrary({
  items: controlledItems,
  userId: propUserId,
  connected = false,
  onSelect,
  onUpload,
  onDelete,
  accept = DEFAULT_ACCEPT,
  multiple = true,
  pageSize = 12,
  initialFilter = "all",
}: MediaLibraryProps) {
  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authContext = useAuth();
  } catch {
    authContext = null;
  }

  const effectiveUserId = propUserId || authContext?.user?.id;
  const isConnectedMode = connected || (!controlledItems && Boolean(effectiveUserId));

  const [localItems, setLocalItems] = useState<MediaItem[]>(controlledItems || []);
  const [activeFilter, setActiveFilter] = useState<MediaFilterType>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (controlledItems) {
      setLocalItems(controlledItems);
    }
  }, [controlledItems]);

  const loadConnectedMedia = useCallback(async () => {
    if (!isConnectedMode || !effectiveUserId) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const res = await listUserMedia(supabase, {
        userId: effectiveUserId,
        type: activeFilter,
        page: 1,
        pageSize: 100,
      });
      const mapped: MediaItem[] = res.items.map((r: MediaFileRecord) => ({
        id: r.id,
        url: r.url,
        name: r.name,
        type: r.type,
        size: r.size,
        path: r.path,
        createdAt: r.created_at,
      }));
      setLocalItems(mapped);
      setCurrentPage(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load media files";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [isConnectedMode, effectiveUserId, activeFilter]);

  useEffect(() => {
    if (isConnectedMode) {
      loadConnectedMedia();
    }
  }, [isConnectedMode, loadConnectedMedia]);

  const filteredItems = useMemo(() => {
    if (isConnectedMode) {
      return localItems;
    }
    if (activeFilter === "all") {
      return localItems;
    }
    return localItems.filter((it) => it.type === activeFilter);
  }, [localItems, activeFilter, isConnectedMode]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, validPage, pageSize]);

  function handleFilterChange(filter: MediaFilterType) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage(null);

    if (onUpload) {
      setIsUploading(true);
      try {
        await onUpload(files);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
      e.target.value = "";
      return;
    }

    if (isConnectedMode && effectiveUserId) {
      setIsUploading(true);
      try {
        const supabase = createClient();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const rec = await uploadUserMedia(supabase, {
            file,
            userId: effectiveUserId,
          });
          const newItem: MediaItem = {
            id: rec.id,
            url: rec.url,
            name: rec.name,
            type: rec.type,
            size: rec.size,
            path: rec.path,
            createdAt: rec.created_at,
          };
          setLocalItems((prev) => [newItem, ...prev]);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to upload file(s)");
      } finally {
        setIsUploading(false);
      }
    } else {
      const syntheticItems: MediaItem[] = Array.from(files).map((file, idx) => ({
        id: `local-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        name: file.name,
        type: detectMediaType(file),
        size: file.size,
        createdAt: new Date().toISOString(),
      }));
      setLocalItems((prev) => [...syntheticItems, ...prev]);
    }

    e.target.value = "";
  }

  function handleItemClick(item: MediaItem) {
    setActiveModalItem(item);
    setIsCopied(false);
    setDeleteConfirm(false);
    onSelect?.(item);
  }

  async function handleCopyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  }

  async function handleDeleteItem(item: MediaItem) {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      if (onDelete) {
        await onDelete(item);
      } else if (isConnectedMode && effectiveUserId) {
        const supabase = createClient();
        await deleteUserMedia(supabase, {
          id: item.id,
          path: item.path || `users/${effectiveUserId}/${item.name}`,
          userId: effectiveUserId,
        });
      }

      setLocalItems((prev) => prev.filter((it) => it.id !== item.id));
      setActiveModalItem(null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  }

  function renderMediaIcon(type: MediaItem["type"], size = 32) {
    switch (type) {
      case "image":
        return <ImageIcon size={size} className="m-media-type-icon m-media-type-icon--image" aria-hidden="true" />;
      case "pdf":
        return <FileText size={size} className="m-media-type-icon m-media-type-icon--pdf" aria-hidden="true" />;
      case "docx":
        return <FileSpreadsheet size={size} className="m-media-type-icon m-media-type-icon--docx" aria-hidden="true" />;
      case "video":
        return <FileVideo size={size} className="m-media-type-icon m-media-type-icon--video" aria-hidden="true" />;
      case "audio":
        return <FileAudio size={size} className="m-media-type-icon m-media-type-icon--audio" aria-hidden="true" />;
      default:
        return <FileCode size={size} className="m-media-type-icon m-media-type-icon--file" aria-hidden="true" />;
    }
  }

  return (
    <div className="m-media" data-mono="medialibrary">
      {/* Top Header & Toolbar */}
      <div className="m-media-header">
        <div className="m-media-heading-wrap">
          <FolderOpen size={20} className="m-media-heading-icon" aria-hidden="true" />
          <h3 className="m-media-title">Media Library</h3>
          {effectiveUserId ? (
            <span className="m-media-badge" title="User Isolated Storage">
              Private
            </span>
          ) : null}
        </div>

        {/* Filter tabs: all, image, pdf, docx */}
        <div className="m-media-filters" role="tablist" aria-label="Media filters">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "all"}
            className={`m-media-filter-btn ${activeFilter === "all" ? "m-media-filter-btn--active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "image"}
            className={`m-media-filter-btn ${activeFilter === "image" ? "m-media-filter-btn--active" : ""}`}
            onClick={() => handleFilterChange("image")}
          >
            <ImageIcon size={14} aria-hidden="true" />
            Images
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "pdf"}
            className={`m-media-filter-btn ${activeFilter === "pdf" ? "m-media-filter-btn--active" : ""}`}
            onClick={() => handleFilterChange("pdf")}
          >
            <FileText size={14} aria-hidden="true" />
            PDFs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "docx"}
            className={`m-media-filter-btn ${activeFilter === "docx" ? "m-media-filter-btn--active" : ""}`}
            onClick={() => handleFilterChange("docx")}
          >
            <FileSpreadsheet size={14} aria-hidden="true" />
            DOCX
          </button>
        </div>

        <button
          type="button"
          className="m-media-upload-btn"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          aria-label="Upload file button"
        >
          {isUploading ? (
            <Loader2 size={16} className="m-media-spin" aria-hidden="true" />
          ) : (
            <Upload size={16} aria-hidden="true" />
          )}
          <span>{isUploading ? "Uploading..." : "Upload"}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="m-media-input"
          aria-label="Upload files input"
        />
      </div>

      {errorMessage ? (
        <div className="m-media-alert" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {/* Grid or Empty / Loading state */}
      {isLoading ? (
        <div className="m-media-loading">
          <Loader2 size={28} className="m-media-spin" aria-hidden="true" />
          <span>Loading media files...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="m-media-empty">
          <FileIcon size={36} className="m-media-empty-icon" aria-hidden="true" />
          <p className="m-media-empty-text">No media files found in this category.</p>
          <button
            type="button"
            className="m-media-empty-btn"
            onClick={() => inputRef.current?.click()}
          >
            Upload your first file
          </button>
        </div>
      ) : (
        <div className="m-media-grid" role="list" aria-label="Media grid">
          {paginatedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className="m-media-card"
              onClick={() => handleItemClick(item)}
              aria-label={`View ${item.name}`}
            >
              <div className="m-media-preview-box">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="m-media-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="m-media-doc-preview">
                    {renderMediaIcon(item.type, 38)}
                  </div>
                )}
                <span className={`m-media-badge-type m-media-badge-type--${item.type}`}>
                  {item.type.toUpperCase()}
                </span>
              </div>
              <div className="m-media-card-info">
                <span className="m-media-card-name" title={item.name}>
                  {item.name}
                </span>
                <span className="m-media-card-meta">
                  {formatBytes(item.size)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredItems.length > 0 ? (
        <div className="m-media-pagination">
          <span className="m-media-pagination-info">
            Showing <strong>{(validPage - 1) * pageSize + 1}</strong> to{" "}
            <strong>{Math.min(validPage * pageSize, filteredItems.length)}</strong> of{" "}
            <strong>{filteredItems.length}</strong> items
          </span>

          <div className="m-media-pagination-nav">
            <button
              type="button"
              className="m-media-page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <span>Prev</span>
            </button>

            <span className="m-media-page-indicator">
              {validPage} / {totalPages}
            </span>

            <button
              type="button"
              className="m-media-page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Item Inspection & Details Modal */}
      {activeModalItem ? (
        <div
          className="m-media-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-modal-title"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="m-media-modal"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <div className="m-media-modal-header">
              <div className="m-media-modal-title-wrap">
                {renderMediaIcon(activeModalItem.type, 20)}
                <h4 id="media-modal-title" className="m-media-modal-title" title={activeModalItem.name}>
                  {activeModalItem.name}
                </h4>
              </div>
              <button
                type="button"
                className="m-media-modal-close"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close modal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="m-media-modal-body">
              {/* Preview Area */}
              <div className="m-media-modal-preview">
                {activeModalItem.type === "image" ? (
                  <img
                    src={activeModalItem.url}
                    alt={activeModalItem.name}
                    className="m-media-modal-img"
                  />
                ) : (
                  <div className="m-media-modal-file-icon">
                    {renderMediaIcon(activeModalItem.type, 64)}
                    <span className="m-media-modal-doc-name">{activeModalItem.name}</span>
                    <span className="m-media-badge-type m-media-badge-type--large">
                      {activeModalItem.type.toUpperCase()} Document
                    </span>
                  </div>
                )}
              </div>

              {/* Details & Public Bucket Link */}
              <div className="m-media-modal-details">
                <div className="m-media-detail-row">
                  <span className="m-media-detail-label">File Type</span>
                  <span className="m-media-detail-value">{activeModalItem.type.toUpperCase()}</span>
                </div>
                <div className="m-media-detail-row">
                  <span className="m-media-detail-label">File Size</span>
                  <span className="m-media-detail-value">{formatBytes(activeModalItem.size)}</span>
                </div>
                {activeModalItem.createdAt ? (
                  <div className="m-media-detail-row">
                    <span className="m-media-detail-label">Uploaded</span>
                    <span className="m-media-detail-value">{formatDate(activeModalItem.createdAt)}</span>
                  </div>
                ) : null}

                {/* Public Bucket URL Box */}
                <div className="m-media-url-section">
                  <label htmlFor="media-public-url" className="m-media-detail-label">
                    Public Bucket URL
                  </label>
                  <div className="m-media-url-box">
                    <input
                      id="media-public-url"
                      type="text"
                      readOnly
                      value={activeModalItem.url}
                      className="m-media-url-input"
                    />
                    <button
                      type="button"
                      className={`m-media-copy-btn ${isCopied ? "m-media-copy-btn--copied" : ""}`}
                      onClick={() => handleCopyUrl(activeModalItem.url)}
                      aria-label="Copy public link"
                      title="Quick Copy Link"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} aria-hidden="true" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href={activeModalItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-media-open-btn"
                      title="Open in new tab"
                      aria-label="Open in new tab"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="m-media-modal-footer">
              <button
                type="button"
                className={`m-media-delete-btn ${deleteConfirm ? "m-media-delete-btn--confirm" : ""}`}
                onClick={() => handleDeleteItem(activeModalItem)}
                disabled={isDeleting}
                aria-label="Delete media"
              >
                {isDeleting ? (
                  <Loader2 size={16} className="m-media-spin" aria-hidden="true" />
                ) : (
                  <Trash2 size={16} aria-hidden="true" />
                )}
                <span>
                  {isDeleting
                    ? "Deleting..."
                    : deleteConfirm
                    ? "Click to Confirm Delete"
                    : "Delete Media"}
                </span>
              </button>

              <button
                type="button"
                className="m-media-close-action-btn"
                onClick={() => setActiveModalItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
