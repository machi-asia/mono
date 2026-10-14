import type { VisitorReview, ReviewStats } from "./types";

export const initialVisitorReviews: VisitorReview[] = [
    {
        id: 1,
        user_id: "demo-user-1",
        user_name: "Sarah Jenkins",
        user_avatar: "/images/avatar_sarah.webp",
        rating: 5,
        comment: "Outstanding portfolio! The agentic AI features and clean design system make this one of the most impressive developer showcases I've seen.",
        created_at: "2026-07-28T14:32:00Z"
    },
    {
        id: 2,
        user_id: "demo-user-2",
        user_name: "Alex Rivera",
        user_avatar: "/images/avatar_alex.webp",
        rating: 5,
        comment: "Extremely smooth user experience. The interactive work experience diagrams and dark theme customize capabilities are top notch.",
        created_at: "2026-07-29T09:15:00Z"
    },
    {
        id: 3,
        user_id: "demo-user-3",
        user_name: "Elena Rostova",
        user_avatar: "/images/avatar_emma.webp",
        rating: 4,
        comment: "Great work experience section and skill progress visualizations. Really enjoyed reading through the wiki and tech stack graph.",
        created_at: "2026-07-31T18:45:00Z"
    },
    {
        id: 4,
        user_id: "demo-user-4",
        user_name: "Marcus Vance",
        user_avatar: "/images/avatar_marcus.webp",
        rating: 5,
        comment: "The visual clarity, responsive performance, and architectural diagrams are world-class. Fantastic engineering depth!",
        created_at: "2026-08-05T11:20:00Z"
    }
];

export function calculateReviewStats(reviews: VisitorReview[]): ReviewStats {
    const total_count = reviews.length;
    if (total_count === 0) {
        return {
            average_rating: 0,
            total_count: 0,
            breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }

    const breakdown: { [stars: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const review of reviews) {
        sum += review.rating;
        const clampedRating = Math.max(1, Math.min(5, Math.round(review.rating)));
        breakdown[clampedRating] = (breakdown[clampedRating] || 0) + 1;
    }

    const average_rating = Number((sum / total_count).toFixed(1));

    return {
        average_rating,
        total_count,
        breakdown
    };
}
