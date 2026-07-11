import type { HTMLAttributes } from "react";
import { cx } from "./cx.js";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return <span className={cx("mo-badge", `mo-badge-${variant}`, className)} {...props} />;
}
