import { cx } from "./cx.js";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  src?: string;
  alt?: string;
  /** Initials or icon shown when there's no `src` (or it fails to load). */
  fallback: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt = "", fallback, size = "md", className }: AvatarProps) {
  return (
    <span className={cx("mo-avatar", `mo-avatar-${size}`, className)}>
      {src ? (
        <img src={src} alt={alt} className="mo-avatar-img" />
      ) : (
        <span className="mo-avatar-fallback">{fallback}</span>
      )}
    </span>
  );
}
