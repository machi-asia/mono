"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import Carousel from "../Carousel";
import Badge from "../Badge";
import type { FeaturedWork } from "../../data/types";

interface FeaturedWorksSectionProps {
  featuredWorks: FeaturedWork[];
}

export default function FeaturedWorksSection({
  featuredWorks,
}: FeaturedWorksSectionProps) {
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
          <div
            key={work.id}
            className="featured-card"
            data-testid={`featured-card-${work.id}`}
          >
            <div className="featured-video-container">
              <video
                className="featured-video"
                src={work.videoUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="featured-content">
              <h3 className="featured-title">{work.title}</h3>
              <p className="featured-description">
                {work.description.split("\n\n")[0]}
              </p>
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
                >
                  View Project <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </motion.section>
  );
}
