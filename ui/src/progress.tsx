import { cx } from "./cx.js";

export type ProgressProps = {
  /** 0-100. */
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cx("mo-progress", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="mo-progress-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
