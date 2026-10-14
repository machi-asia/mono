"use client";

import React, { useState, useMemo } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, FileCheck, CheckCircle, Maximize2 } from "lucide-react";
import Image from "next/image";
import Button from "../Button";
import Tooltip from "../Tooltip";
import Dialog from "../Dialog";
import Badge from "../Badge";
import type { Certificate } from "../../data/types";

function formatDisplayName(name: string): string {
    const hashRegex = /([a-f0-9]{32})/i;
    const match = name.match(hashRegex);
    if (match) {
        const fullHash = match[1];
        const shortHash = `${fullHash.slice(0, 7)}...`;
        return name.replace(fullHash, shortHash);
    }
    return name;
}

interface CertificatesSectionProps {
    certificates?: Certificate[];
}

type TabType = "all" | "google" | "coursera" | "wadhwani" | "physical";

export default function CertificatesSection({ certificates = [] }: CertificatesSectionProps = {}) {
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
    const [activeSubCertId, setActiveSubCertId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // Filter certificates based on active tab
    const filteredCertificates = useMemo(() => {
        if (activeTab === "all") return certificates;
        return certificates.filter((c) => c.source === activeTab);
    }, [certificates, activeTab]);

    const totalPages = Math.ceil(filteredCertificates.length / pageSize);
    const adjustedPage = Math.min(currentPage, totalPages || 1);

    const paginatedCertificates = useMemo(() => {
        const start = (adjustedPage - 1) * pageSize;
        return filteredCertificates.slice(start, start + pageSize);
    }, [filteredCertificates, adjustedPage, pageSize]);

    const currentCertIndex = filteredCertificates.findIndex((c) => c.id === selectedCertificateId);
    const currentCert = selectedCertificateId ? filteredCertificates.find((c) => c.id === selectedCertificateId) : null;

    // Active image and title for inspection dialog
    const activeCertData = useMemo(() => {
        if (!currentCert) return null;
        if (activeSubCertId && currentCert.subCertificates) {
            const sub = currentCert.subCertificates.find((s) => s.id === activeSubCertId);
            if (sub) return sub;
        }
        return currentCert;
    }, [currentCert, activeSubCertId]);

    const goToPrevCert = () => {
        if (currentCertIndex > 0) {
            setSelectedCertificateId(filteredCertificates[currentCertIndex - 1].id);
            setActiveSubCertId(null);
        }
    };

    const goToNextCert = () => {
        if (currentCertIndex < filteredCertificates.length - 1) {
            setSelectedCertificateId(filteredCertificates[currentCertIndex + 1].id);
            setActiveSubCertId(null);
        }
    };

    const categories: { id: TabType; label: string }[] = [
        { id: "all", label: "All" },
        { id: "google", label: "Google" },
        { id: "coursera", label: "Coursera" },
        { id: "wadhwani", label: "Wadhwani" },
        { id: "physical", label: "Physical" },
    ];

    return (
        <section
            id="certificates"
            className="section"
            style={{ position: "relative" }}
        >
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-topography" />
            </div>

            <div className="section-header-wrap" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header-top">
                    <h2 className="section-title">
                        My <span className="gradient-text">Certificates</span>
                    </h2>
                </div>
            </div>

            <div className="tabs-root">
                <div className="certificates-tabs-list">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`certificates-tab-trigger ${activeTab === cat.id ? "tabs-trigger-active" : ""}`}
                            data-state={activeTab === cat.id ? "active" : "inactive"}
                            onClick={() => {
                                setActiveTab(cat.id);
                                setCurrentPage(1);
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="certificates-grid">
                    {paginatedCertificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="certificate-card"
                            onClick={() => {
                                setSelectedCertificateId(cert.id);
                                setActiveSubCertId(null);
                            }}
                        >
                            <div className="certificate-image-wrap">
                                <Image
                                    src={cert.image}
                                    alt={cert.name}
                                    fill
                                    className="certificate-image"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="certificate-overlay">
                                    <span className="certificate-zoom-icon">
                                        <Maximize2 size={16} />
                                    </span>
                                </div>
                            </div>

                            <div className="certificate-info">
                                <div className="certificate-info-content">
                                    <FileCheck size={16} className="certificate-info-icon" />
                                    <h3 className="certificate-name">{formatDisplayName(cert.name)}</h3>
                                </div>

                                <div className="certificate-meta-bar">
                                    <span className="certificate-issuer">{cert.source || "Verified"}</span>
                                    {cert.subCertificates && cert.subCertificates.length > 0 && (
                                        <Badge variant="default" size="sm">
                                            {cert.subCertificates.length + 1} Modules
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="certificates-pagination">
                        <Tooltip content="Previous page">
                            <Button
                                variant="icon"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={adjustedPage === 1}
                                aria-label="Previous certificates page"
                            >
                                <ChevronLeft size={18} />
                            </Button>
                        </Tooltip>
                        <span className="certificates-page-info">
                            Page {adjustedPage} of {totalPages}
                        </span>
                        <Tooltip content="Next page">
                            <Button
                                variant="icon"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={adjustedPage >= totalPages}
                                aria-label="Next certificates page"
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>

            {/* Certificate Inspection Modal */}
            <Dialog
                open={selectedCertificateId !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedCertificateId(null);
                        setActiveSubCertId(null);
                    }
                }}
                className="certificate-dialog-content"
            >
                {activeCertData && (
                    <div className="certificate-dialog-body">
                        <div className="certificate-dialog-image-pane">
                            <img
                                src={activeCertData.image}
                                alt={activeCertData.name}
                                className="certificate-dialog-image"
                            />
                        </div>

                        <div className="certificate-dialog-details-pane">
                            <div>
                                <div style={{ marginBottom: "0.75rem" }}>
                                    <Badge variant="positive" size="sm">
                                        <CheckCircle size={12} style={{ marginRight: "0.25rem" }} /> Verified Credential
                                    </Badge>
                                </div>
                                <h3 className="certificate-dialog-title">
                                    {formatDisplayName(activeCertData.name)}
                                </h3>
                                <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.35rem" }}>
                                    Issuer: {currentCert?.source?.toUpperCase() || "ACCREDITED"}
                                </p>
                            </div>

                            {currentCert?.subCertificates && currentCert.subCertificates.length > 0 && (
                                <div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
                                        Curriculum Modules
                                    </span>
                                    <div className="certificate-sub-certs">
                                        <button
                                            className={`certificate-sub-item ${activeSubCertId === null ? "active" : ""}`}
                                            onClick={() => setActiveSubCertId(null)}
                                        >
                                            Main Specialization Certificate
                                        </button>
                                        {currentCert.subCertificates.map((sub) => (
                                            <button
                                                key={sub.id}
                                                className={`certificate-sub-item ${activeSubCertId === sub.id ? "active" : ""}`}
                                                onClick={() => setActiveSubCertId(sub.id)}
                                            >
                                                {sub.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeCertData.url && (
                                <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                                    <a
                                        href={activeCertData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ width: "100%" }}
                                    >
                                        Verify on {currentCert?.source?.toUpperCase() || "Issuer"} <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", borderTop: "1px solid var(--hairline)", paddingTop: "1rem" }}>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={goToPrevCert}
                                    disabled={currentCertIndex <= 0}
                                    leftIcon={<ChevronLeft size={16} />}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={goToNextCert}
                                    disabled={currentCertIndex >= filteredCertificates.length - 1}
                                    rightIcon={<ChevronRight size={16} />}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </section>
    );
}
