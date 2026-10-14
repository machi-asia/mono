"use client";

type CardVariant = "default" | "interactive" | "metric";
type CardPadding = "sm" | "md" | "lg" | "none";

interface CardProps {
    variant?: CardVariant;
    padding?: CardPadding;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
}

export const componentVariants = [
    { label: "Default", props: { variant: "default" as const, children: "Card content" } },
    { label: "Interactive", props: { variant: "interactive" as const, children: "Hover me" } },
    { label: "Metric", props: { variant: "metric" as const, children: "Metric card" } },
];

export default function Card({
    variant = "default",
    padding = "md",
    className = "",
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    style,
}: CardProps) {
    const classNames = [
        "card-comp",
            variant !== "default" ? `card-comp-${variant}` : "",
            padding !== "md" ? `card-comp-padding-${padding}` : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={classNames}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={style}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
        >
            {children}
        </div>
    );
}
