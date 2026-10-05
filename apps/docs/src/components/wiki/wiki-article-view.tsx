"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Card, MarkdownRenderer, Button } from "@mono/components";
import type { WikiArticle } from "../../data/wiki-types";
import { WikiToc } from "./wiki-toc";
import { parseTocFromMarkdown } from "../../utils/wiki-utils";

export interface WikiArticleViewProps {
  article: WikiArticle;
  relatedArticles?: WikiArticle[];
}

export function WikiArticleView({
  article,
  relatedArticles = [],
}: WikiArticleViewProps) {
  const tocEntries = parseTocFromMarkdown(article.content);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="wiki-page-container" id="top">
      {/* ── Top Action Breadcrumb ── */}
      <div className="wiki-top-bar">
        <Link href="/docs" className="wiki-back-button">
          <ArrowLeft size={16} />
          <span>Back to Documentation Wiki</span>
        </Link>
        <div className="wiki-top-actions">
          <span className="wiki-category-badge">
            <BookOpen size={13} />
            <span>{article.category}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 size={14} />}
            onClick={handleShare}
            className="wiki-share-btn"
          >
            Share
          </Button>
        </div>
      </div>

      {/* ── Article Header Card ── */}
      <Card className="wiki-header-card">
        <div className="wiki-header-body">
          <div className="wiki-header-pre">
            <span className="wiki-badge-pill">{article.category}</span>
            <span className="wiki-header-subtitle">Machi Asia Knowledge Encyclopedia</span>
          </div>
          <h1 className="wiki-article-main-title">{article.title}</h1>
          <p className="wiki-article-lead-desc">{article.description}</p>
          <div className="wiki-article-meta-row">
            <span className="wiki-meta-pill">
              <Calendar size={13} />
              <span>Updated {article.updatedAt}</span>
            </span>
            <span className="wiki-meta-sep">•</span>
            <span className="wiki-meta-pill">
              <User size={13} />
              <span>{article.author}</span>
            </span>
            <span className="wiki-meta-sep">•</span>
            <span className="wiki-meta-pill">
              <Clock size={13} />
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>
      </Card>

      {/* ── Main Two-Column Layout ── */}
      <div className="wiki-layout-grid">
        {/* Left: Sticky TOC */}
        {tocEntries.length > 0 && (
          <aside className="wiki-sidebar-toc">
            <Card className="wiki-sidebar-card">
              <WikiToc entries={tocEntries} />
            </Card>
          </aside>
        )}

        {/* Right: Markdown Content */}
        <main className="wiki-main-content">
          <Card className="wiki-content-card">
            <div className="wiki-markdown-wrapper">
              <MarkdownRenderer content={article.content} />
            </div>

            {/* Article Tags & Category Footer */}
            <div className="wiki-tags-footer">
              <div className="wiki-tags-group">
                <Tag size={14} className="wiki-tags-icon" />
                <span className="wiki-tags-label">Tags:</span>
                <div className="wiki-tags-list">
                  {article.tags.map((tag) => (
                    <span key={tag} className="wiki-tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="wiki-category-link-wrap">
                <span className="wiki-cat-label">Category:</span>
                <Link
                  href={`/docs?category=${encodeURIComponent(article.category)}`}
                  className="wiki-category-link"
                >
                  {article.category}
                </Link>
              </div>
            </div>
          </Card>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="wiki-related-section">
              <h3 className="wiki-related-title">Related Documentation</h3>
              <div className="wiki-related-grid">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/docs/${rel.slug}`}
                    className="wiki-related-card"
                  >
                    <div className="wiki-related-content">
                      <span className="wiki-related-category">{rel.category}</span>
                      <h4 className="wiki-related-name">{rel.title}</h4>
                      <p className="wiki-related-desc">{rel.description}</p>
                    </div>
                    <ChevronRight size={16} className="wiki-related-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="wiki-bottom-nav">
            <Link href="/docs" className="wiki-back-button">
              <ArrowLeft size={16} />
              <span>Return to Wiki Home</span>
            </Link>
            <div className="wiki-bottom-links">
              <Link href="/components/components" className="wiki-footer-sublink">
                <span>UI Components Showcase</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
