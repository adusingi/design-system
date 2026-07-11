import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "./cx.js";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cx("mo-btn", `mo-btn-${variant}`, `mo-btn-${size}`, className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
