"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ChangeEvent,
} from "react";
import {
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Upload,
  ChevronLeft,
  ChevronRight,
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
import {
  type MediaFilterType,
  type MediaItem,
  type MediaLibraryProps,
  DEFAULT_ACCEPT,
} from "./media-types";
import { formatBytes, renderMediaIcon } from "./media-utils";
import { MediaModal } from "./media-modal";

export type { MediaFilterType, MediaItem, MediaLibraryProps };

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
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    onSelect?.(item);
  }

  async function handleDeleteItem(item: MediaItem) {
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
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      setErrorMessage(msg);
      throw err;
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
        <MediaModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onDelete={handleDeleteItem}
        />
      ) : null}
    </div>
  );
}
