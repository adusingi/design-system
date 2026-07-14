import type { ReactNode } from "react";
import { cx } from "./cx.js";

export type AlertVariant = "success" | "warning" | "danger" | "info" | "neutral";

export type AlertProps = {
  variant?: AlertVariant;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
  switch (variant) {
    case "success":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M4 10.5 8 14.5 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 3 18 17H2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 8v4M10 14.2v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "danger":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 9v4.2M10 6.8v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

// Static banner/notification. Dismiss state (if any) is owned by the caller —
// pass `action` for a close button — which keeps this component hook-free.
export function Alert({ variant = "neutral", title, description, action, className }: AlertProps) {
  return (
    <div className={cx("mo-alert", `mo-alert-${variant}`, className)} role="status">
      <span className="mo-alert-icon">
        <AlertIcon variant={variant} />
      </span>
      <div className="mo-alert-body">
        <p className="mo-alert-title">{title}</p>
        {description && <p className="mo-alert-description">{description}</p>}
      </div>
      {action && <div className="mo-alert-action">{action}</div>}
    </div>
  );
}
