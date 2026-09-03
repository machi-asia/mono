"use client";

import { useState, useRef, type ChangeEvent } from "react";
import "./medialibrary.css";

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "video" | "audio" | "file";
}

export interface MediaLibraryProps {
  items?: MediaItem[];
  onSelect?: (item: MediaItem) => void;
  onUpload?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

export function MediaLibrary({
  items = [],
  onSelect,
  onUpload,
  accept = "image/*",
  multiple = true,
}: MediaLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload?.(files);
    }
    e.target.value = "";
  }

  function handleSelect(item: MediaItem) {
    setSelectedId(item.id);
    onSelect?.(item);
  }

  return (
    <div className="m-media" data-mono="medialibrary">
      <div className="m-media-header">
        <h3 className="m-media-title">Media Library</h3>
        <button
          type="button"
          className="m-media-upload"
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="m-media-input"
          aria-label="Upload files"
        />
      </div>
      {items.length === 0 ? (
        <div className="m-media-empty">No media files yet.</div>
      ) : (
        <div className="m-media-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`m-media-item ${item.id === selectedId ? "m-media-item--selected" : ""}`}
              onClick={() => handleSelect(item)}
            >
              {item.type === "image" ? (
                <img src={item.url} alt={item.name} className="m-media-thumb" />
              ) : (
                <div className="m-media-icon">{item.type === "video" ? "🎬" : item.type === "audio" ? "🎵" : "📄"}</div>
              )}
              <span className="m-media-name">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
