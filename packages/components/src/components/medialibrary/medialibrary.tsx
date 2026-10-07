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
  LayoutGrid,
  List as ListIcon,
  Search,
  X,
} from "lucide-react";
import {
  createClient,
  listUserMedia,
  uploadUserMedia,
  deleteUserMedia,
  renameUserMedia,
  detectMediaType,
  type MediaFileRecord,
} from "@mono/database";
import { Skeleton } from "../skeleton/skeleton";
import "./medialibrary.css";
import {
  type MediaFilterType,
  type MediaViewMode,
  type MediaItem,
  type MediaLibraryProps,
  DEFAULT_ACCEPT,
} from "./media-types";
import { formatBytes, formatDate, renderMediaIcon } from "./media-utils";
import { MediaModal } from "./media-modal";
import { PdfThumbnail } from "./pdf-thumbnail";
import { compressImageFile, type UserRoleTier } from "./image-compressor";

export type { MediaFilterType, MediaViewMode, MediaItem, MediaLibraryProps };

function fuzzyMatch(pattern: string, text: string): boolean {
  if (!pattern || !pattern.trim()) return true;
  const p = pattern.trim().toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(p)) return true;

  let pIdx = 0;
  for (let tIdx = 0; tIdx < t.length && pIdx < p.length; tIdx++) {
    if (t[tIdx] === p[pIdx]) {
      pIdx++;
    }
  }
  return pIdx === p.length;
}

export function MediaLibrary({
  variant = "standalone",
  isOpen: controlledIsOpen,
  onOpenChange,
  trigger,
  triggerLabel = "Select from Media Library",
  triggerIcon,
  triggerClassName,
  allowedTypes,
  modalTitle = "Select Media",
  role = "authenticated",
  items: controlledItems,
  userId: propUserId,
  connected = false,
  onSelect,
  onUpload,
  onDelete,
  onRename,
  accept = DEFAULT_ACCEPT,
  multiple = true,
  pageSize = 12,
  initialFilter = "all",
  defaultViewMode = "gallery",
  viewMode: controlledViewMode,
  onViewModeChange,
}: MediaLibraryProps) {
  const effectiveUserId = propUserId;
  const isConnectedMode = connected || (!controlledItems && Boolean(effectiveUserId));

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isPopupOpen = controlledIsOpen ?? internalIsOpen;

  function setPopupOpen(open: boolean) {
    setInternalIsOpen(open);
    onOpenChange?.(open);
  }

  const effectiveInitialFilter =
    allowedTypes && allowedTypes.length === 1 && allowedTypes[0] !== "file"
      ? (allowedTypes[0] as MediaFilterType)
      : initialFilter;

  const [localItems, setLocalItems] = useState<MediaItem[]>(controlledItems || []);
  const [activeFilter, setActiveFilter] = useState<MediaFilterType>(effectiveInitialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [internalViewMode, setInternalViewMode] = useState<MediaViewMode>(defaultViewMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeViewMode = controlledViewMode ?? internalViewMode;

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
    let list = localItems;
    if (allowedTypes && allowedTypes.length > 0) {
      list = list.filter((it) => allowedTypes.includes(it.type));
    }
    if (!isConnectedMode && activeFilter !== "all") {
      list = list.filter((it) => it.type === activeFilter);
    }
    if (searchQuery.trim()) {
      list = list.filter(
        (it) => fuzzyMatch(searchQuery, it.name) || fuzzyMatch(searchQuery, it.type)
      );
    }
    return list;
  }, [localItems, allowedTypes, activeFilter, isConnectedMode, searchQuery]);

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

  function handleViewModeToggle(mode: MediaViewMode) {
    setInternalViewMode(mode);
    onViewModeChange?.(mode);
  }

  function handleItemClick(item: MediaItem) {
    if (variant === "popup") {
      onSelect?.(item);
      setPopupOpen(false);
      return;
    }
    setActiveModalItem(item);
    onSelect?.(item);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    setErrorMessage(null);
    setIsUploading(true);

    try {
      // Compress each file according to user role tier (guest: 500KB, auth: 1MB, admin: uncompressed)
      const processedFiles: File[] = [];
      for (let i = 0; i < rawFiles.length; i++) {
        const compressed = await compressImageFile(rawFiles[i], role);
        processedFiles.push(compressed);
      }

      if (onUpload) {
        if (typeof DataTransfer !== "undefined") {
          try {
            const dt = new DataTransfer();
            processedFiles.forEach((f) => dt.items.add(f));
            await onUpload(dt.files);
            e.target.value = "";
            return;
          } catch {
            // fallback if items.add fails
          }
        }
        // Fallback for environments without native DataTransfer FileList construction (like JSDOM)
        const fileListLike = Object.assign(processedFiles, {
          item: (index: number) => processedFiles[index] || null,
        }) as unknown as FileList;
        await onUpload(fileListLike);
        e.target.value = "";
        return;
      }

      if (isConnectedMode && effectiveUserId) {
        const supabase = createClient();
        for (const file of processedFiles) {
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
      } else {
        const syntheticItems: MediaItem[] = processedFiles.map((file, idx) => ({
          id: `local-${Date.now()}-${idx}`,
          url: URL.createObjectURL(file),
          name: file.name,
          type: detectMediaType(file),
          size: file.size,
          createdAt: new Date().toISOString(),
        }));
        setLocalItems((prev) => [...syntheticItems, ...prev]);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
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

  async function handleRenameItem(item: MediaItem, newName: string) {
    setErrorMessage(null);
    try {
      if (onRename) {
        await onRename(item, newName);
      } else if (isConnectedMode && effectiveUserId) {
        const supabase = createClient();
        await renameUserMedia(supabase, {
          id: item.id,
          path: item.path,
          newName,
          userId: effectiveUserId,
        });
      }

      setLocalItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, name: newName } : it))
      );
      setActiveModalItem((prev) => (prev && prev.id === item.id ? { ...prev, name: newName } : prev));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rename item";
      setErrorMessage(msg);
      throw err;
    }
  }

  const normalizedRole = useMemo(() => {
    if (role === "admin") return "admin";
    if (role === "pro") return "pro";
    if (role === "guest") return "guest";
    return "member";
  }, [role]);

  const storageLimitBytes = useMemo(() => {
    switch (normalizedRole) {
      case "guest":
        return 1 * 1024 * 1024; // 1 MB
      case "pro":
        return 1 * 1024 * 1024 * 1024; // 1 GB
      case "admin":
        return Infinity;
      case "member":
      default:
        return 5 * 1024 * 1024; // 5 MB
    }
  }, [normalizedRole]);

  const totalStorageBytes = useMemo(() => {
    return localItems.reduce((acc, it) => acc + (it.size || 0), 0);
  }, [localItems]);

  const storagePercentage = useMemo(() => {
    if (!Number.isFinite(storageLimitBytes) || storageLimitBytes <= 0) return 0;
    return Math.min(100, (totalStorageBytes / storageLimitBytes) * 100);
  }, [totalStorageBytes, storageLimitBytes]);

  const showAllTab = !allowedTypes || allowedTypes.length > 1;
  const showImageTab = !allowedTypes || allowedTypes.includes("image");
  const showPdfTab = !allowedTypes || allowedTypes.includes("pdf");
  const showDocxTab = !allowedTypes || allowedTypes.includes("docx");

  const mediaLibraryBody = (
    <div className={`m-media ${variant === "popup" ? "m-media--popup" : ""}`} data-mono="medialibrary">
      {/* Top Header & Toolbar */}
      <div className="m-media-header">
        <div className="m-media-header-top">
          <div className="m-media-heading-wrap">
            <FolderOpen size={20} className="m-media-heading-icon" aria-hidden="true" />
            <h3 className="m-media-title">{variant === "popup" ? modalTitle : "Media Library"}</h3>
            <span className={`m-media-role-badge m-media-role-badge--${normalizedRole}`}>
              {normalizedRole.toUpperCase()}
            </span>
          </div>

          <div className="m-media-header-controls">
            {/* Filter tabs: only render tabs for allowed types */}
            {(showAllTab && (showImageTab || showPdfTab || showDocxTab)) ? (
              <div className="m-media-filters" role="tablist" aria-label="Media filters">
                {showAllTab ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === "all"}
                    className={`m-media-filter-btn ${activeFilter === "all" ? "m-media-filter-btn--active" : ""}`}
                    onClick={() => handleFilterChange("all")}
                  >
                    All
                  </button>
                ) : null}
                {showImageTab ? (
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
                ) : null}
                {showPdfTab ? (
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
                ) : null}
                {showDocxTab ? (
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
                ) : null}
              </div>
            ) : null}

            {/* View Mode Toggle: Gallery vs List */}
            <div className="m-media-view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`m-media-view-btn ${activeViewMode === "gallery" ? "m-media-view-btn--active" : ""}`}
                onClick={() => handleViewModeToggle("gallery")}
                aria-label="Gallery mode"
                title="Gallery mode"
              >
                <LayoutGrid size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`m-media-view-btn ${activeViewMode === "list" ? "m-media-view-btn--active" : ""}`}
                onClick={() => handleViewModeToggle("list")}
                aria-label="List mode"
                title="List mode"
              >
                <ListIcon size={15} aria-hidden="true" />
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
        </div>

        {/* Second Row: Fuzzy Search Bar */}
        <div className="m-media-header-bottom">
          <div className="m-media-search-wrap">
            <Search size={14} className="m-media-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="m-media-search-input"
              placeholder="Fuzzy search media by name or type..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search media files"
            />
            {searchQuery ? (
              <button
                type="button"
                className="m-media-search-clear"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Third Row: Storage Usage Bar */}
        <div className="m-media-header-storage">
          <div className="m-media-storage-header">
            <span className="m-media-storage-label">Storage Usage</span>
            <span className="m-media-storage-value">
              {formatBytes(totalStorageBytes)} / {Number.isFinite(storageLimitBytes) ? formatBytes(storageLimitBytes) : "Unlimited"}
              {Number.isFinite(storageLimitBytes) && storageLimitBytes > 0
                ? ` (${storagePercentage.toFixed(1)}%)`
                : ""}
            </span>
          </div>
          {Number.isFinite(storageLimitBytes) ? (
            <div
              className="m-media-storage-track"
              role="progressbar"
              aria-valuenow={totalStorageBytes}
              aria-valuemin={0}
              aria-valuemax={storageLimitBytes}
              aria-label={`Storage usage: ${formatBytes(totalStorageBytes)} of ${formatBytes(storageLimitBytes)}`}
            >
              <div
                className={`m-media-storage-fill ${
                  storagePercentage >= 90
                    ? "m-media-storage-fill--danger"
                    : storagePercentage >= 75
                    ? "m-media-storage-fill--warning"
                    : ""
                }`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
          ) : (
            <div className="m-media-storage-unlimited">
              <span>Unlimited Cloud Storage</span>
            </div>
          )}
        </div>
      </div>

      {errorMessage ? (
        <div className="m-media-alert" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {/* Main Content Area */}
      {isLoading ? (
        activeViewMode === "gallery" ? (
          <div className="m-media-grid" role="status" aria-label="Loading media files" aria-busy="true">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="m-media-card m-media-card--skeleton">
                <div className="m-media-preview-box">
                  <Skeleton variant="rounded" width="100%" height={120} />
                </div>
                <div className="m-media-card-info" style={{ width: "100%" }}>
                  <Skeleton variant="text" width="80%" height="0.9rem" />
                  <Skeleton variant="text" width="40%" height="0.75rem" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-media-list" role="status" aria-label="Loading media files" aria-busy="true">
            {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
              <div key={i} className="m-media-list-row m-media-list-row--skeleton">
                <Skeleton variant="rounded" width={38} height={38} />
                <div className="m-media-list-name-wrap">
                  <Skeleton variant="text" width="60%" height="0.9rem" />
                  <Skeleton variant="text" width="30%" height="0.75rem" />
                </div>
                <Skeleton variant="text" width={60} height="0.8rem" />
                <Skeleton variant="text" width={80} height="0.8rem" />
              </div>
            ))}
          </div>
        )
      ) : filteredItems.length === 0 ? (
        <div className="m-media-empty">
          <FileIcon size={36} className="m-media-empty-icon" aria-hidden="true" />
          <p className="m-media-empty-text">
            {searchQuery
              ? `No media files matching "${searchQuery}".`
              : "No media files found in this category."}
          </p>
          <button
            type="button"
            className="m-media-empty-btn"
            onClick={() => (searchQuery ? setSearchQuery("") : inputRef.current?.click())}
          >
            {searchQuery ? "Clear Search" : "Upload your first file"}
          </button>
        </div>
      ) : activeViewMode === "gallery" ? (
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
                ) : item.type === "pdf" ? (
                  <PdfThumbnail
                    url={item.url}
                    name={item.name}
                    className="m-media-thumb-pdf"
                    iconSize={38}
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
      ) : (
        /* List Mode View */
        <div className="m-media-list" role="list" aria-label="Media list">
          <div className="m-media-list-header">
            <span className="m-media-col-file">File</span>
            <span className="m-media-col-type">Type</span>
            <span className="m-media-col-size">Size</span>
            <span className="m-media-col-date">Uploaded</span>
          </div>
          {paginatedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className="m-media-list-row"
              onClick={() => handleItemClick(item)}
              aria-label={`View ${item.name}`}
            >
              <div className="m-media-col-file m-media-list-file-cell">
                <div className="m-media-list-thumb">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="m-media-list-img"
                      loading="lazy"
                    />
                  ) : item.type === "pdf" ? (
                    <PdfThumbnail
                      url={item.url}
                      name={item.name}
                      className="m-media-list-pdf"
                      iconSize={18}
                    />
                  ) : (
                    <div className="m-media-list-icon">
                      {renderMediaIcon(item.type, 20)}
                    </div>
                  )}
                </div>
                <div className="m-media-list-name-wrap">
                  <span className="m-media-list-name" title={item.name}>
                    {item.name}
                  </span>
                </div>
              </div>

              <div className="m-media-col-type">
                <span className={`m-media-badge-type m-media-badge-type--inline m-media-badge-type--${item.type}`}>
                  {item.type.toUpperCase()}
                </span>
              </div>

              <div className="m-media-col-size m-media-list-size">
                {formatBytes(item.size)}
              </div>

              <div className="m-media-col-date m-media-list-date">
                {formatDate(item.createdAt)}
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

      {/* Item Inspection & Details Modal (only in standalone mode) */}
      {variant === "standalone" && activeModalItem ? (
        <MediaModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onDelete={handleDeleteItem}
          onRename={handleRenameItem}
        />
      ) : null}
    </div>
  );

  if (variant === "popup") {
    return (
      <div className="m-media-popup-container">
        {trigger ? (
          <div onClick={() => setPopupOpen(true)} className="m-media-trigger-wrap">
            {trigger}
          </div>
        ) : (
          <button
            type="button"
            className={triggerClassName || "m-media-popup-trigger"}
            onClick={() => setPopupOpen(true)}
          >
            {triggerIcon || <FolderOpen size={16} aria-hidden="true" />}
            <span>{triggerLabel}</span>
          </button>
        )}

        {isPopupOpen ? (
          <div
            className="m-media-popup-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={modalTitle}
            onClick={() => setPopupOpen(false)}
          >
            <div
              className="m-media-popup-window"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="m-media-popup-header">
                <div className="m-media-popup-title-wrap">
                  <FolderOpen size={18} className="m-media-heading-icon" aria-hidden="true" />
                  <h4 className="m-media-popup-title">{modalTitle}</h4>
                </div>
                <button
                  type="button"
                  className="m-media-popup-close-btn"
                  onClick={() => setPopupOpen(false)}
                  aria-label="Close media picker"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="m-media-popup-content">
                {mediaLibraryBody}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return mediaLibraryBody;
}

