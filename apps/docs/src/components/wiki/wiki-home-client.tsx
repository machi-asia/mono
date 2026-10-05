"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  BookOpen,
  Layers,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Cpu,
  Shield,
  Palette,
  FileCode2,
  Boxes,
  ExternalLink,
} from "lucide-react";
import { Card, Button } from "@mono/components";
import type { WikiArticle, WikiCategory } from "../../data/wiki-types";
import {
  CATEGORY_DESCRIPTIONS,
  WIKI_CATEGORIES,
} from "../../data/wiki-articles";

export interface WikiHomeClientProps {
  initialArticles: WikiArticle[];
  initialCategory?: string | null;
}

const CATEGORY_ICONS: Record<WikiCategory, React.ReactNode> = {
  "Architecture & Core": <Cpu size={15} />,
  "Architecture Decisions (ADR)": <FileCode2 size={15} />,
  "Packages & Libraries": <Boxes size={15} />,
  "Standards & Guidelines": <Shield size={15} />,
  "Applications & Services": <Layers size={15} />,
};

export function WikiHomeClient({
  initialArticles,
  initialCategory = null,
}: WikiHomeClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<WikiCategory | null>(
    (initialCategory as WikiCategory) || null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = initialArticles;

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialArticles, selectedCategory, query]);

  // Grouped by category for portals
  const groupedByCategory = useMemo(() => {
    const map: Record<WikiCategory, WikiArticle[]> = {
      "Architecture & Core": [],
      "Architecture Decisions (ADR)": [],
      "Packages & Libraries": [],
      "Standards & Guidelines": [],
      "Applications & Services": [],
    };
    for (const article of initialArticles) {
      if (map[article.category]) {
        map[article.category].push(article);
      }
    }
    return map;
  }, [initialArticles]);

  // Recent articles
  const recentArticles = useMemo(() => {
    return [...initialArticles]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [initialArticles]);

  // Featured article (Architecture)
  const featuredArticle = useMemo(() => {
    return (
      initialArticles.find((a) => a.slug === "architecture") ||
      initialArticles[0]
    );
  }, [initialArticles]);

  const isSearching = query.trim().length > 0;
  const isBrowsingAll = !isSearching && selectedCategory === null;

  return (
    <div className="wiki-home-root">
      {/* ── Hero Header ── */}
      <header className="wiki-hero-header">
        <div className="wiki-hero-pill-box">
          <span className="wiki-hero-pill">
            <BookOpen size={14} className="wiki-hero-pill-icon" />
            <span>Machi Asia Documentation Wiki</span>
          </span>
        </div>

        <div className="wiki-hero-text-wrap">
          <h1 className="wiki-hero-headline">
            Developer <span className="wiki-gradient-accent">Knowledge Wiki</span>
          </h1>
          <p className="wiki-hero-subhead">
            The canonical encyclopedia for Machi Asia — architecture blueprints, ADR specifications, package manuals, and organization standards.
          </p>
        </div>

        {/* ── Category Chips Bar ── */}
        <div className="wiki-chips-bar" role="toolbar" aria-label="Category filters">
          <button
            type="button"
            className={`wiki-chip ${selectedCategory === null && !query ? "wiki-chip-active" : ""}`}
            onClick={() => {
              setSelectedCategory(null);
              setQuery("");
            }}
          >
            <Layers size={13} />
            <span>All Articles</span>
            <span className="wiki-chip-badge">{initialArticles.length}</span>
          </button>

          {WIKI_CATEGORIES.map((cat) => {
            const count = groupedByCategory[cat]?.length ?? 0;
            const isSelected = selectedCategory === cat && !query;
            return (
              <button
                key={cat}
                type="button"
                className={`wiki-chip ${isSelected ? "wiki-chip-active" : ""}`}
                onClick={() => {
                  setSelectedCategory((prev) => (prev === cat ? null : cat));
                  setQuery("");
                }}
              >
                {CATEGORY_ICONS[cat] ?? <BookOpen size={13} />}
                <span>{cat}</span>
                <span className="wiki-chip-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Live Search Input ── */}
      <section className="wiki-search-box-section">
        <div className="wiki-search-container">
          <Search size={17} className="wiki-search-glass" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search documentation, ADRs, packages, guides, or keywords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="wiki-search-field"
            aria-label="Search articles"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="wiki-search-clear-btn"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="wiki-search-kbd-hint">/</kbd>
          )}
        </div>
      </section>

      {/* ── Main Two-Column Body ── */}
      <div className="wiki-grid-container">
        {/* ── Left Column (Articles / Search Results / Featured) ── */}
        <div className="wiki-grid-left">
          {/* If searching or category filtered */}
          {(isSearching || selectedCategory) && (
            <Card className="wiki-panel-card">
              <div className="wiki-panel-title-bar">
                <div className="wiki-panel-title-left">
                  <Search size={16} className="wiki-accent-icon" />
                  <span>
                    {isSearching
                      ? `Search results for "${query}"`
                      : `Category: ${selectedCategory}`}
                  </span>
                </div>
                <span className="wiki-count-tag">
                  {filteredArticles.length} found
                </span>
              </div>
              <div className="wiki-panel-content">
                {filteredArticles.length > 0 ? (
                  <ul className="wiki-article-entry-list">
                    {filteredArticles.map((article) => (
                      <li key={article.slug} className="wiki-article-list-item">
                        <Link
                          href={`/docs/${article.slug}`}
                          className="wiki-article-card-link"
                        >
                          <div className="wiki-article-card-header">
                            <h3 className="wiki-article-card-title">
                              {article.title}
                            </h3>
                            <span className="wiki-category-mini-badge">
                              {article.category}
                            </span>
                          </div>
                          <p className="wiki-article-card-desc">
                            {article.description}
                          </p>
                          <div className="wiki-article-card-footer">
                            <span className="wiki-meta-time">
                              <Clock size={12} />
                              <span>{article.readTime}</span>
                            </span>
                            <div className="wiki-tags-inline">
                              {article.tags.slice(0, 3).map((t) => (
                                <span key={t} className="wiki-tag-micro">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="wiki-empty-results">
                    <Sparkles size={32} className="wiki-empty-icon" />
                    <h3 className="wiki-empty-title">
                      No documentation matched your query
                    </h3>
                    <p className="wiki-empty-subtitle">
                      Try searching with different keywords, check spelling, or clear filters.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setQuery("");
                        setSelectedCategory(null);
                      }}
                      className="wiki-empty-btn"
                    >
                      Clear search & filters
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Browse Mode (Default view when not searching) */}
          {isBrowsingAll && (
            <>
              {/* Featured Article Card */}
              {featuredArticle && (
                <Card className="wiki-panel-card wiki-featured-hero-card">
                  <Link
                    href={`/docs/${featuredArticle.slug}`}
                    className="wiki-featured-anchor"
                  >
                    <div className="wiki-featured-header">
                      <div className="wiki-featured-badge-row">
                        <Star size={13} className="wiki-star-icon" />
                        <span className="wiki-featured-label">
                          Featured Architecture Guide
                        </span>
                      </div>
                      <span className="wiki-category-mini-badge">
                        {featuredArticle.category}
                      </span>
                    </div>

                    <div className="wiki-featured-main">
                      <h2 className="wiki-featured-heading">
                        {featuredArticle.title}
                      </h2>
                      <p className="wiki-featured-summary">
                        {featuredArticle.description}
                      </p>
                    </div>

                    <div className="wiki-featured-footer-row">
                      <div className="wiki-tags-inline">
                        {featuredArticle.tags.map((t) => (
                          <span key={t} className="wiki-tag-micro">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <div className="wiki-read-full-link">
                        <span>Read full article</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </Card>
              )}

              {/* All Articles List */}
              <Card className="wiki-panel-card">
                <div className="wiki-panel-title-bar">
                  <div className="wiki-panel-title-left">
                    <Layers size={16} className="wiki-accent-icon" />
                    <span>All Wiki Articles</span>
                  </div>
                  <span className="wiki-count-tag">
                    {initialArticles.length} total
                  </span>
                </div>
                <div className="wiki-panel-content">
                  <ul className="wiki-article-entry-list">
                    {initialArticles.map((article) => (
                      <li key={article.slug} className="wiki-article-list-item">
                        <Link
                          href={`/docs/${article.slug}`}
                          className="wiki-article-card-link"
                        >
                          <div className="wiki-article-card-header">
                            <h3 className="wiki-article-card-title">
                              {article.title}
                            </h3>
                            <span className="wiki-category-mini-badge">
                              {article.category}
                            </span>
                          </div>
                          <p className="wiki-article-card-desc">
                            {article.description}
                          </p>
                          <div className="wiki-article-card-footer">
                            <span className="wiki-meta-time">
                              <Clock size={12} />
                              <span>{article.readTime}</span>
                            </span>
                            <div className="wiki-tags-inline">
                              {article.tags.slice(0, 3).map((t) => (
                                <span key={t} className="wiki-tag-micro">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Component Showcase Navigation Banner */}
              <Card className="wiki-panel-card wiki-showcase-banner">
                <div className="wiki-showcase-banner-inner">
                  <div className="wiki-showcase-text">
                    <div className="wiki-showcase-pre">
                      <Palette size={14} className="wiki-accent-icon" />
                      <span>Interactive Playground</span>
                    </div>
                    <h3 className="wiki-showcase-title">
                      Live Component Showcases
                    </h3>
                    <p className="wiki-showcase-desc">
                      Test live UI components, prop dropdowns, and theme toggles for all exported packages.
                    </p>
                  </div>
                  <div className="wiki-showcase-links-grid">
                    <Link
                      href="/components/components"
                      className="wiki-showcase-link-btn"
                    >
                      <span>@mono/components</span>
                      <ExternalLink size={12} />
                    </Link>
                    <Link
                      href="/components/auth"
                      className="wiki-showcase-link-btn"
                    >
                      <span>@mono/auth</span>
                      <ExternalLink size={12} />
                    </Link>
                    <Link
                      href="/components/rose"
                      className="wiki-showcase-link-btn"
                    >
                      <span>@mono/rose</span>
                      <ExternalLink size={12} />
                    </Link>
                    <Link
                      href="/components/sync"
                      className="wiki-showcase-link-btn"
                    >
                      <span>@mono/sync</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* ── Right Column (Category Portals & Recent Updates) ── */}
        <div className="wiki-grid-right">
          {/* Category Portals */}
          <Card className="wiki-panel-card">
            <div className="wiki-panel-title-bar">
              <div className="wiki-panel-title-left">
                <BookOpen size={16} className="wiki-accent-icon" />
                <span>Browse by Category</span>
              </div>
            </div>
            <div className="wiki-portals-grid">
              {WIKI_CATEGORIES.map((category) => {
                const articles = groupedByCategory[category] ?? [];
                return (
                  <div key={category} className="wiki-portal-tile">
                    <div className="wiki-portal-tile-top">
                      <button
                        type="button"
                        className="wiki-portal-button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setQuery("");
                        }}
                      >
                        <span className="wiki-portal-icon">
                          {CATEGORY_ICONS[category] ?? <BookOpen size={14} />}
                        </span>
                        <span className="wiki-portal-name">{category}</span>
                      </button>
                      <span className="wiki-portal-count">
                        {articles.length}
                      </span>
                    </div>
                    <p className="wiki-portal-desc">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                    <ul className="wiki-portal-links-list">
                      {articles.slice(0, 4).map((art) => (
                        <li key={art.slug}>
                          <Link
                            href={`/docs/${art.slug}`}
                            className="wiki-portal-sublink"
                          >
                            <span className="wiki-portal-link-text">
                              {art.title}
                            </span>
                            <ArrowUpRight
                              size={12}
                              className="wiki-portal-link-arrow"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Updates */}
          <Card className="wiki-panel-card">
            <div className="wiki-panel-title-bar">
              <div className="wiki-panel-title-left">
                <Clock size={16} className="wiki-accent-icon" />
                <span>Recent Specifications & ADRs</span>
              </div>
            </div>
            <div className="wiki-recent-list">
              {recentArticles.map((article, idx) => (
                <Link
                  key={article.slug}
                  href={`/docs/${article.slug}`}
                  className="wiki-recent-item"
                >
                  <div className="wiki-recent-row">
                    <span className="wiki-recent-title">{article.title}</span>
                    {idx === 0 && (
                      <span className="wiki-new-badge">New</span>
                    )}
                  </div>
                  <div className="wiki-recent-meta">
                    <span>{article.updatedAt}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Wiki Footer ── */}
      <footer className="wiki-main-footer">
        <div className="wiki-footer-inner">
          <span className="wiki-footer-copyright">
            © {new Date().getFullYear()} Machi Asia. All documentation and specifications maintained under monorepo governance.
          </span>
          <div className="wiki-footer-nav">
            <Link href="/docs" className="wiki-footer-a">
              Docs Wiki
            </Link>
            <Link href="/components/components" className="wiki-footer-a">
              Components
            </Link>
            <Link href="/components/auth" className="wiki-footer-a">
              Auth
            </Link>
            <Link href="/components/rose" className="wiki-footer-a">
              Rose AI
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
