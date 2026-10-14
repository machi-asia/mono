"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { LogIn, Send, Pencil, Plus } from "lucide-react";
import Button from "../Button";
import Dialog from "../Dialog";
import StarRating from "../StarRating";
import ReviewCard from "../ReviewCard";
import { useAuth, SignInModal } from "@mono/auth";
import type { VisitorReview, ReviewStats } from "../../data/types";
import { initialVisitorReviews, calculateReviewStats } from "../../data/reviews";
import FetchBoundary from "../FetchBoundary";

export default function VisitorsSection() {
    const auth = useAuth();
    const user = auth?.user;
    const [reviews, setReviews] = useState<VisitorReview[]>(initialVisitorReviews);
    const [stats, setStats] = useState<ReviewStats>(() => calculateReviewStats(initialVisitorReviews));
    const [loading, setLoading] = useState<boolean>(false);
    const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingReview, setEditingReview] = useState<VisitorReview | null>(null);

    // Form inputs
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const userReview = user ? reviews.find((r) => r.user_id === user.id) : null;

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                if (data && data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                    setStats(data.stats || calculateReviewStats(data.reviews));
                    return;
                }
            }
            setReviews(initialVisitorReviews);
            setStats(calculateReviewStats(initialVisitorReviews));
        } catch {
            setReviews(initialVisitorReviews);
            setStats(calculateReviewStats(initialVisitorReviews));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchReviews();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchReviews]);

    const handleOpenModal = (reviewToEdit?: VisitorReview) => {
        setErrorMsg(null);
        if (reviewToEdit) {
            setEditingReview(reviewToEdit);
            setRating(reviewToEdit.rating);
            setComment(reviewToEdit.comment);
        } else {
            setEditingReview(null);
            setRating(5);
            setComment("");
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!comment.trim()) {
            setErrorMsg("Please write a short comment before submitting.");
            return;
        }

        try {
            setSubmitting(true);
            setErrorMsg(null);

            const isEdit = Boolean(editingReview);
            const method = isEdit ? "PATCH" : "POST";
            const payload = isEdit
                ? { id: editingReview!.id, rating, comment: comment.trim() }
                : { rating, comment: comment.trim() };

            const res = await fetch("/api/reviews", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setModalOpen(false);
                setComment("");
                await fetchReviews();
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErrorMsg(errorData.error || "Failed to submit review. Please try again.");
            }
        } catch {
            setErrorMsg("Network error. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchReviews();
            }
        } catch {
            // handle error gracefully
        }
    };

    const safeStats = stats || calculateReviewStats(reviews);
    const avgRating = typeof safeStats?.average_rating === "number" ? safeStats.average_rating : 5;
    const totalCount = typeof safeStats?.total_count === "number" ? safeStats.total_count : reviews.length;

    return (
        <section id="visitors" className="section" style={{ position: "relative" }}>
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-isometric" />
            </div>

            <div className="section-header-wrap" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header-top">
                    <h2 className="section-title">
                        Community <span className="gradient-text">Reviews</span>
                    </h2>
                </div>
            </div>

            <div className="visitors-section">
                <div className="visitors-header">
                    <div className="visitors-stats-grid">
                        <div className="visitors-stat-card">
                            <span className="visitors-stat-number">{avgRating.toFixed(1)}</span>
                            <span className="visitors-stat-label">Average Rating</span>
                            <StarRating variant="display" rating={Math.round(avgRating)} size="sm" />
                        </div>
                        <div className="visitors-stat-card">
                            <span className="visitors-stat-number">{totalCount}</span>
                            <span className="visitors-stat-label">Community Reviews</span>
                        </div>
                    </div>

                    <div>
                        {user ? (
                            userReview ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenModal(userReview)}
                                    leftIcon={<Pencil size={16} />}
                                >
                                    Edit Your Review
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => handleOpenModal()}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Leave a Review
                                </Button>
                            )
                        ) : (
                            <Button
                                variant="secondary"
                                onClick={() => setShowSignInModal(true)}
                                leftIcon={<LogIn size={16} />}
                            >
                                Sign in to Review
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <FetchBoundary loading={true} variant="card" lines={3} />
                ) : (
                    <div className="visitors-reviews-grid">
                        {reviews.map((rev) => {
                            const isOwner = Boolean(user && user.id === rev.user_id);
                            const isAdmin = Boolean(user?.app_metadata?.role === "admin");
                            return (
                                <ReviewCard
                                    key={rev.id}
                                    review={rev}
                                    isOwnerOrAdmin={isOwner || isAdmin}
                                    onEdit={isOwner ? () => handleOpenModal(rev) : undefined}
                                    onDelete={isOwner || isAdmin ? () => handleDelete(String(rev.id)) : undefined}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Review Dialog */}
            <Dialog
                open={modalOpen}
                onOpenChange={setModalOpen}
                className="dialog-content-compact"
            >
                <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)" }}>
                            {editingReview ? "Edit Your Review" : "Leave a Review"}
                        </h3>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                            Rating
                        </label>
                        <StarRating variant="interactive" rating={rating} onRatingChange={setRating} size="md" />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                            Your Feedback / Message
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your impressions or feedback..."
                            className="visitors-textarea"
                            required
                        />
                    </div>

                    {errorMsg && (
                        <p style={{ color: "#fb7185", fontSize: "0.8125rem" }}>{errorMsg}</p>
                    )}

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                        <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit" disabled={submitting} rightIcon={<Send size={14} />}>
                            {submitting ? "Publishing..." : editingReview ? "Save Changes" : "Publish Review"}
                        </Button>
                    </div>
                </form>
            </Dialog>

            {showSignInModal && (
                <SignInModal
                    onClose={() => setShowSignInModal(false)}
                    title="Sign in to Review"
                    subtitle="Connect your account to write a review on Angelo's portfolio."
                />
            )}
        </section>
    );
}
