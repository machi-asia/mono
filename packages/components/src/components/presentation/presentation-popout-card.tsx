"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";
import type { PresentationPopOutCardProps } from "./types";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

export function PresentationPopOutCard({
  imageSrc,
  videoSrc,
  media,
  imageAlt = "Pop-out presentation graphic",
  badge,
  title,
  description,
  faceMouse = true,
  maxTiltAngle = 14,
  cardBackground = "linear-gradient(155deg, #18181b 0%, #09090b 100%)",
  cardTextColor = "#f4f4f5",
  topHalfHeight = 190,
  imageHeight,
  imageWidth = "116%",
  buriedPercent = 8,
  children,
  className,
  style,
  onMouseMove,
  onMouseLeave,
  ...rest
}: PresentationPopOutCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // 3D Tilt springs so the image faces the mouse cursor dynamically
  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (faceMouse) {
      const rect = e.currentTarget.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const normY = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      rotateY.set(normX * maxTiltAngle * 2);
      rotateX.set(-normY * maxTiltAngle * 1.5);
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    rotateX.set(0);
    rotateY.set(0);
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={ref}
      data-mono="presentation-popout-card"
      className={cx("mono-pres-popout-stage", className)}
      style={style}
      {...rest}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mono-pres-popout-wrapper">
        <div
          className="mono-pres-popout-card"
          style={{
            background: cardBackground,
            color: cardTextColor,
          }}
        >
          {/* TOP HALF: Visual stage with image boundary larger and taller than the card top half */}
          <div
            className="mono-pres-popout-top-half"
            style={{
              height:
                typeof topHalfHeight === "number"
                  ? `${topHalfHeight}px`
                  : topHalfHeight,
              minHeight:
                typeof topHalfHeight === "number"
                  ? `${topHalfHeight}px`
                  : topHalfHeight,
            }}
          >
            <div
              className="mono-pres-popout-portal-stage"
              style={{
                marginBottom: `-${buriedPercent}%`,
              }}
            >
              <motion.div
                className="mono-pres-popout-image-motion"
                style={{
                  width: imageWidth,
                  rotateX: faceMouse ? rotateX : 0,
                  rotateY: faceMouse ? rotateY : 0,
                }}
              >
                {media ? (
                  media
                ) : videoSrc ? (
                  <video
                    src={videoSrc}
                    className="mono-pres-popout-img mono-pres-popout-video"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      height:
                        imageHeight != null
                          ? typeof imageHeight === "number"
                            ? `${imageHeight}px`
                            : imageHeight
                          : undefined,
                    }}
                  />
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="mono-pres-popout-img"
                    style={{
                      objectPosition: "center bottom",
                      height:
                        imageHeight != null
                          ? typeof imageHeight === "number"
                            ? `${imageHeight}px`
                            : imageHeight
                          : undefined,
                    }}
                  />
                ) : null}
              </motion.div>
            </div>
          </div>

          {/* BOTTOM HALF: One layer higher (z-index 10) burying ~5% of the image bottom */}
          <div
            className="mono-pres-popout-bottom-half"
            style={{
              background: cardBackground,
            }}
          >
            {badge && <span className="mono-pres-popout-badge">{badge}</span>}
            {title && <h3 className="mono-pres-popout-title">{title}</h3>}
            {description && (
              <div className="mono-pres-popout-desc">{description}</div>
            )}
            {children && (
              <div className="mono-pres-popout-children">{children}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
