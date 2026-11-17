"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, Sparkles } from "lucide-react";
import { MarkdownRenderer, PresentationPopOutCard } from "@mono/components";
import Carousel from "../Carousel";
import Badge from "../Badge";
import Dialog from "../Dialog";
import type { FeaturedWork } from "../../data/types";

interface FeaturedWorksSectionProps {
  featuredWorks: FeaturedWork[];
}

export default function FeaturedWorksSection({
  featuredWorks,
}: FeaturedWorksSectionProps) {
  const [selectedFeaturedWork, setSelectedFeaturedWork] =
    useState<FeaturedWork | null>(null);

  return (
    <motion.section
      id="featured"
      className="section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <h2 className="section-title">
        Featured <span className="gradient-text">Works</span>
      </h2>
      <p className="featured-subtitle">
        <Sparkles size={16} className="featured-subtitle-icon" />
        Showcase of my best projects with video demos
      </p>

      <Carousel variant="featured" visibleCount={3}>
        {featuredWorks.map((work) => (
          <PresentationPopOutCard
            key={work.id}
            className="featured-card featured-popout-card"
            faceMouse={true}
            maxTiltAngle={14}
            topHalfHeight={115}
            imageWidth="112%"
            buriedPercent={8}
            title={work.title}
            description={work.description.split("\n\n")[0]}
            onClick={() => setSelectedFeaturedWork(work)}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              const video = e.currentTarget.querySelector("video");
              const playPromise = video?.play?.();
              if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              const video = e.currentTarget.querySelector("video");
              if (video) {
                video.pause?.();
                video.currentTime = 0;
              }
            }}
            media={
              <div className="featured-video-container featured-popout-media">
                <video
                  className="featured-video mono-pres-popout-img"
                  src={work.videoUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="featured-video-overlay">
                  <Play size={48} className="featured-play-icon" />
                  <span className="featured-play-text">Click to expand</span>
                </div>
              </div>
            }
          >
            <div className="featured-tags">
              {work.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
            {work.link && (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-link"
                onClick={(e) => e.stopPropagation()}
              >
                View Project <ExternalLink size={14} />
              </a>
            )}
          </PresentationPopOutCard>
        ))}
      </Carousel>

      {/* Featured Work Video Dialog */}
      <Dialog
        open={selectedFeaturedWork !== null}
        onOpenChange={(open) => !open && setSelectedFeaturedWork(null)}
        variant="featured"
        title={selectedFeaturedWork?.title}
      >
        <div className="featured-video-dialog-content">
          {selectedFeaturedWork && (
            <video
              className="featured-video-expanded"
              src={selectedFeaturedWork.videoUrl}
              controls
              autoPlay
              loop
              playsInline
            />
          )}
        </div>
        {selectedFeaturedWork && (
          <div className="featured-video-dialog-footer">
            <div className="featured-video-dialog-description markdown-content">
              <MarkdownRenderer content={selectedFeaturedWork.description} />
            </div>
            <div className="featured-tags">
              {selectedFeaturedWork.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedFeaturedWork.link && (
              <a
                href={selectedFeaturedWork.link}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-link"
              >
                View Project <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </Dialog>
    </motion.section>
  );
}
