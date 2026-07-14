"use client";

import { useEffect, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx.js";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

// Controlled modal: caller owns `open` state. Closes on Escape or a backdrop
// click, renders via a portal so it always sits above app stacking contexts.
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="mo-dialog-overlay"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="mo-dialog-panel" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mo-dialog-header", props.className)} {...props} />;
}

export function DialogTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx("mo-dialog-title", props.className)} {...props} />;
}

export function DialogDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mo-dialog-description", props.className)} {...props} />;
}

export function DialogFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mo-dialog-footer", props.className)} {...props} />;
}

export function DialogClose({
  onOpenChange,
  className,
}: {
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  return (
    <button type="button" className={cx("mo-dialog-close", className)} onClick={() => onOpenChange(false)} aria-label="Close">
      ×
    </button>
  );
}
