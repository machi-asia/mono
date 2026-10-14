"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type DialogVariant = "default" | "featured" | "admin" | "compact";

export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant?: DialogVariant;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    showClose?: boolean;
    style?: React.CSSProperties;
}

export const componentVariants = [
    { label: "Default", props: { open: true, title: "Dialog Title", children: "Dialog content", showClose: true } },
    { label: "Featured", props: { open: true, variant: "featured" as const, title: "Featured Dialog", children: "Featured content", showClose: true } },
    { label: "Admin", props: { open: true, variant: "admin" as const, title: "Admin Management Dialog", children: "Admin modal content", showClose: true } },
    { label: "Compact", props: { open: true, variant: "compact" as const, title: "Compact Dialog", children: "Compact dialog content", showClose: true } },
];

const emptySubscribe = () => () => {};

export default function Dialog({
    open,
    onOpenChange,
    variant = "default",
    title,
    description,
    children,
    footer,
    className = "",
    showClose = true,
    style,
}: DialogProps) {
    const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onOpenChange]);

    if (!open || !mounted) return null;

    const dialogElement = (
        <div className="dialog-portal-root" role="dialog" aria-modal="true">
            <div
                className="dialog-overlay"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            <div
                ref={contentRef}
                style={style}
                className={`dialog-content ${variant !== "default" ? `dialog-content-${variant}` : ""} ${className}`.trim()}
            >
                {title && (
                    <div className="dialog-header">
                        <h2 className="dialog-title">{title}</h2>
                        {showClose && (
                            <button
                                type="button"
                                className="dialog-close"
                                aria-label="Close"
                                onClick={() => onOpenChange(false)}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}

                {description && (
                    <p className="dialog-description">{description}</p>
                )}

                {!title && showClose && (
                    <button
                        type="button"
                        className="dialog-close dialog-close-absolute"
                        aria-label="Close"
                        onClick={() => onOpenChange(false)}
                    >
                        <X size={18} />
                    </button>
                )}

                {children}

                {footer && (
                    <div className="dialog-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return typeof document !== "undefined"
        ? createPortal(dialogElement, document.body)
        : null;
}
