"use client";

import { forwardRef } from "react";

type InputVariant = "default" | "ghost";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: InputVariant;
    error?: boolean;
}

export const componentVariants = [
    { label: "Default", props: { variant: "default" as const, placeholder: "Type something..." } },
    { label: "Ghost", props: { variant: "ghost" as const, placeholder: "Ghost input..." } },
];

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ variant = "default", error = false, className = "", ...props }, ref) => {
        const classNames = [
            "input-field",
            variant !== "default" ? `input-field-${variant}` : "",
            error ? "input-field-error" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return <input ref={ref} className={classNames} {...props} />;
    }
);

Input.displayName = "Input";

export default Input;
