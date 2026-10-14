"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const componentVariants = [
    { label: "Primary", props: { variant: "primary" as const } },
    { label: "Secondary", props: { variant: "secondary" as const } },
    { label: "Ghost", props: { variant: "ghost" as const } },
    { label: "Danger", props: { variant: "danger" as const } },
    { label: "Icon", props: { variant: "icon" as const } },
];

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant,
            size = "md",
            loading = false,
            leftIcon,
            rightIcon,
            className = "",
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const classNames = [
            "btn",
            `btn-${variant}`,
            `btn-${size}`,
            loading ? "btn-loading" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <button
                ref={ref}
                className={classNames}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <span className="btn-skeleton-wave" aria-hidden="true" />
                )}
                {!loading && leftIcon}
                {children}
                {!loading && rightIcon}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
