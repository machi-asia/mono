"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    ExternalLink,
    Star,
    GitFork,
    FolderGit2,
    Calendar,
    RefreshCw,
} from "lucide-react";
import { GithubIcon } from "./social-icons";
import Badge from "./Badge";
import Card from "./Card";
import Tooltip from "./Tooltip";
import type { GitHubRepo } from "../data/types";
import { languageColors } from "../data/tech-stack";

const LANGUAGE_ICONS: Record<string, string> = {
    TypeScript: "/icons/typescript.svg",
    JavaScript: "/icons/typescript.svg",
    Python: "/icons/python.svg",
    "C#": "/icons/csharp.svg",
    CSS: "/icons/css.svg",
    HTML: "/icons/css.svg",
};

export default function GitHubRepoCard({ repo }: { repo: GitHubRepo }) {
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div
            className="repo-card-wrapper"
            style={{ position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card variant="interactive" className="repo-card">
                <div className="repo-card-header">
                    <div className="repo-card-title-wrapper">
                        <FolderGit2 size={20} className="repo-card-icon" />
                        <h3 className="repo-card-title">
                            {repo.name}
                        </h3>
                    </div>
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-card-link"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Open ${repo.name} on GitHub`}
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>

                <p className="repo-card-description">
                    {repo.description || "No description available"}
                </p>

                {repo.topics && repo.topics.length > 0 && (
                    <div className="repo-card-topics">
                        {repo.topics.slice(0, 4).map((topic) => (
                            <Badge key={topic} variant="default">{topic}</Badge>
                        ))}
                        {repo.topics.length > 4 && (
                            <span className="repo-card-more-topics">
                                +{repo.topics.length - 4}
                            </span>
                        )}
                    </div>
                )}

                <div className="repo-card-footer">
                    {repo.language && (
                        <div className="repo-card-language">
                            {LANGUAGE_ICONS[repo.language] ? (
                                <Image
                                    src={LANGUAGE_ICONS[repo.language]}
                                    alt={repo.language}
                                    width={14}
                                    height={14}
                                    style={{ flexShrink: 0 }}
                                />
                            ) : (
                                <span
                                    className="repo-card-language-dot"
                                    style={{
                                        backgroundColor: languageColors[repo.language] || "#6e7681",
                                    }}
                                />
                            )}
                            <span>{repo.language}</span>
                        </div>
                    )}
                    <Tooltip content="Stars">
                        <div className="repo-card-stat">
                            <Star size={14} />
                            <span>{repo.stargazers_count}</span>
                        </div>
                    </Tooltip>
                    <Tooltip content="Forks">
                        <div className="repo-card-stat">
                            <GitFork size={14} />
                            <span>{repo.forks_count}</span>
                        </div>
                    </Tooltip>
                </div>
            </Card>

            {isHovered && (
                <div className="hover-card-content" style={{ position: "absolute", bottom: "105%", left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
                    <div className="repo-hover-header">
                        <GithubIcon size={24} />
                        <div>
                            <h4 className="repo-hover-title">{repo.name}</h4>
                            {repo.language && (
                                <div className="repo-hover-language">
                                    <span
                                        className="repo-hover-language-dot"
                                        style={{
                                            backgroundColor: languageColors[repo.language] || "#6e7681",
                                        }}
                                    />
                                    {repo.language}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="repo-hover-description">
                        {repo.description || "No description available"}
                    </p>
                    <div className="repo-hover-dates">
                        <div className="repo-hover-date">
                            <Calendar size={12} />
                            Created: {formatDate(repo.created_at)}
                        </div>
                        <div className="repo-hover-date">
                            <RefreshCw size={12} />
                            Updated: {formatDate(repo.updated_at)}
                        </div>
                    </div>
                    {repo.homepage && (
                        <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-hover-demo"
                        >
                            <ExternalLink size={12} /> Live Demo
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
