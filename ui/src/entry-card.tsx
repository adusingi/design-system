"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./cx.js";

export type EntryCardMeta = {
  icon: ReactNode;
  label: ReactNode;
  /** Renders in the accent color, e.g. a date or "now playing" tag. */
  emphasis?: boolean;
};

export type EntryCardActionVariant = "outline" | "accent";

export type EntryCardAction = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  /** Filled/toggled state, e.g. a "favorited" heart. Sets aria-pressed. */
  pressed?: boolean;
  variant?: EntryCardActionVariant;
};

export type EntryCardProps = {
  image: { src: string; alt: string };
  /** e.g. a photo-count chip like "1/2". */
  badge?: ReactNode;
  title: string;
  onTitleClick?: () => void;
  meta?: EntryCardMeta[];
  description?: string;
  highlights?: string[];
  /** Label for the expand toggle, e.g. "More about this place". Omit to hide the row. */
  moreLabel?: ReactNode;
  /** Content revealed when the toggle is expanded. */
  moreContent?: ReactNode;
  primaryAction?: EntryCardAction;
  secondaryAction?: EntryCardAction;
  className?: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="mo-entry-card-check">
      <path d="M5 12.5 10 17l9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="mo-entry-card-chevron"
      style={{ transform: expanded ? "rotate(180deg)" : undefined }}
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A media card generalized from the mytrip "place" card: image + badge,
// title, meta tags, description, an optional checklist, an optional
// expandable note, and up to two footer actions. Same shape works for a
// travel destination (meta = country + date, actions = Love it / Open) or a
// umuzika track (meta = artist + duration, actions = Favorite / Play) — only
// the content and icons change.
export function EntryCard({
  image,
  badge,
  title,
  onTitleClick,
  meta,
  description,
  highlights,
  moreLabel,
  moreContent,
  primaryAction,
  secondaryAction,
  className,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={cx("mo-entry-card", className)}>
      <button type="button" className="mo-entry-card-media" aria-label={`Open ${title}`}>
        <img src={image.src} alt={image.alt} className="mo-entry-card-img" loading="lazy" />
        {badge && <span className="mo-entry-card-badge">{badge}</span>}
      </button>

      <div className="mo-entry-card-body">
        <button type="button" className="mo-entry-card-title-btn" onClick={onTitleClick}>
          <h3 className="mo-entry-card-title">{title}</h3>
        </button>

        {meta && meta.length > 0 && (
          <p className="mo-entry-card-meta">
            {meta.map((item, index) => (
              <span
                key={index}
                className={cx("mo-entry-card-meta-item", item.emphasis && "mo-entry-card-meta-item-emphasis")}
              >
                {item.icon}
                {item.label}
              </span>
            ))}
          </p>
        )}

        {description && <p className="mo-entry-card-description">{description}</p>}

        {highlights && highlights.length > 0 && (
          <ul className="mo-entry-card-highlights">
            {highlights.map((highlight) => (
              <li key={highlight}>
                <CheckIcon />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {moreLabel && (
          <>
            <div className="mo-entry-card-divider" />
            <button
              type="button"
              className="mo-entry-card-more"
              aria-expanded={moreContent ? expanded : undefined}
              onClick={() => moreContent && setExpanded((v) => !v)}
            >
              <span className="mo-entry-card-more-label">{moreLabel}</span>
              <ChevronIcon expanded={expanded} />
            </button>
            {moreContent && expanded && <div className="mo-entry-card-more-content">{moreContent}</div>}
          </>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mo-entry-card-actions">
            {primaryAction && <EntryCardActionButton {...primaryAction} />}
            {secondaryAction && <EntryCardActionButton {...secondaryAction} />}
          </div>
        )}
      </div>
    </article>
  );
}

function EntryCardActionButton({ icon, label, onClick, pressed, variant = "outline" }: EntryCardAction) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx("mo-entry-card-action", `mo-entry-card-action-${variant}`, pressed && "mo-entry-card-action-pressed")}
    >
      {icon}
      {label}
    </button>
  );
}
