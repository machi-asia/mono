"use client";

type BadgeVariant = "default" | "positive" | "negative" | "warning" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    children: React.ReactNode;
}

export const componentVariants = [
    { label: "Default", props: { variant: "default" as const, children: "Badge" } },
    { label: "Accent", props: { variant: "accent" as const, children: "Featured" } },
    { label: "Positive", props: { variant: "positive" as const, children: "Active" } },
    { label: "Negative", props: { variant: "negative" as const, children: "Inactive" } },
    { label: "Warning", props: { variant: "warning" as const, children: "Pending" } },
];

export default function Badge({
    variant = "default",
    size = "sm",
    className = "",
    children,
}: BadgeProps) {
    const classNames = [
        "badge",
        `badge-${variant}`,
        `badge-${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={classNames}>
            {children}
        </span>
    );
}
