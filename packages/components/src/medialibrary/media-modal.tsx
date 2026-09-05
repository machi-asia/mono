"use client";

import { useState, type MouseEvent } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";
import type { MediaItem } from "./media-types";
import { formatBytes, formatDate, renderMediaIcon } from "./media-utils";

interface MediaModalProps {
  item: MediaItem;
  onClose: () => void;
  onDelete: (item: MediaItem) => Promise<void>;
}

export function MediaModal({ item, onClose, onDelete }: MediaModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function handleCopyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(item);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <div
      className="m-media-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-modal-title"
      onClick={onClose}
    >
      <div
        className="m-media-modal"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="m-media-modal-header">
          <div className="m-media-modal-title-wrap">
            {renderMediaIcon(item.type, 20)}
            <h4
              id="media-modal-title"
              className="m-media-modal-title"
              title={item.name}
            >
              {item.name}
            </h4>
          </div>
          <button
            type="button"
            className="m-media-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="m-media-modal-body">
          {/* Preview Area */}
          <div className="m-media-modal-preview">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.name}
                className="m-media-modal-img"
              />
            ) : (
              <div className="m-media-modal-file-icon">
                {renderMediaIcon(item.type, 64)}
                <span className="m-media-modal-doc-name">{item.name}</span>
                <span className="m-media-badge-type m-media-badge-type--large">
                  {item.type.toUpperCase()} Document
                </span>
              </div>
            )}
          </div>

          {/* Details & Public Bucket Link */}
          <div className="m-media-modal-details">
            <div className="m-media-detail-row">
              <span className="m-media-detail-label">File Type</span>
              <span className="m-media-detail-value">
                {item.type.toUpperCase()}
              </span>
            </div>
            <div className="m-media-detail-row">
              <span className="m-media-detail-label">File Size</span>
              <span className="m-media-detail-value">
                {formatBytes(item.size)}
              </span>
            </div>
            {item.createdAt ? (
              <div className="m-media-detail-row">
                <span className="m-media-detail-label">Uploaded</span>
                <span className="m-media-detail-value">
                  {formatDate(item.createdAt)}
                </span>
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
                  value={item.url}
                  className="m-media-url-input"
                />
                <button
                  type="button"
                  className={`m-media-copy-btn ${isCopied ? "m-media-copy-btn--copied" : ""}`}
                  onClick={() => handleCopyUrl(item.url)}
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
                  href={item.url}
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
            onClick={handleDelete}
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
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
