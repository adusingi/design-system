---
type: Proposal
title: design.mobayilo.com redesign — rebalance borders and cards
description: Restructure the design-system site around scale, whitespace, and color fields, keeping borders/cards only where the border is the content.
tags: [site, design, proposal]
timestamp: 2026-07-15T00:00:00Z
---

# design.mobayilo.com redesign — rebalance borders and cards

**Interactive mockup:** https://claude.ai/code/artifact/b300760c-bcc0-4f91-b43f-a574319e2d63
(press `/` in the mockup to re-ink the page with the next theme — all 10 themes are wired in)

## Diagnosis

The current site does all of its structural work with 1px hairlines and bordered boxes:

- `SiteHeader` — `border-bottom` on the sticky header.
- `.mo-section` — `border-top` on every section.
- `.mo-panel` — a bordered card wrapping every component group; the gallery is a
  2-column grid of identical cards (cards holding cards, since many exhibits are
  themselves cards).
- `.mo-swatch-color` — every color token shown as a 72px bordered chip.
- Typography scale — `border-top` on every row.
- Section numbering `01–05` encodes nothing (the sections aren't a sequence, and
  03/04 share a row anyway); the pill eyebrow + two-button hero is the generic
  landing-page kit.
- Cormorant Garamond — the system's display face — never gets to perform beyond
  a 3.5rem headline and one "Aa" in a card.

Net effect: the page reads as a lattice of boxes, and the specimen (the tokens)
is smaller than the furniture around it.

## Direction: the drawdown sheet

Treat the site as what it actually is — a **specimen sheet** for the system.
Structure comes from scale, whitespace, and color fields meeting edge to edge;
borders and cards survive only where the border **is** the content.

**Signature element:** the hero is an *ink drawdown* of the active theme — the
theme's tokens poured as full-bleed horizontal strata (`background → panel-soft
→ panel → accent-wash → accent → accent-strong → foreground`), labeled on the
ink. Switching themes repaints the strata live, which makes "ten themes, zero
drift" the first thing a visitor *experiences* rather than reads.

### Where borders and cards stay (the balance)

1. **Documented components** keep their own borders and cards — they are the
   exhibits. `Card`, `Input`, `Dialog` render exactly as shipped.
2. **The `line` token** is rendered as an actual 1px rule with its label — the
   one place a hairline is literally the content.
3. **Shadow demos** keep their floating panels — elevation is the content.

Everything else — header, section boundaries, wrapper panels, swatch chips,
type-scale rows — loses its box.

## Section-by-section changes

| Area | Today | Proposed |
| --- | --- | --- |
| Header | Sticky + `border-bottom` | Sticky + backdrop blur; soft shadow appears only after scroll |
| Hero | Pill eyebrow, H1, two buttons | Mono kicker (`@mobayilo — themes · ui · auth-magic-link`), display headline at `clamp(3.25rem, 9vw, 6.75rem)`, one-line lede, `/`-to-re-ink hint, then the drawdown strata full-bleed |
| Section markers | `01–05` numbering | Real namespaces: `@mobayilo/themes`, `--mo-text-*`, `--mo-space-*`, `@mobayilo/ui` — structure that encodes ownership |
| Color | Bordered 72px chips in a grid | Full-bleed poured bands; band height maps to the token's role (grounds tall, accents bright, chrome thin); name + hex set on the ink itself; `line` shown as an actual rule |
| Theme gallery | Bordered mini-cards | Borderless 4-color drawdown strips; hover lifts with `shadow-md`; active theme marked in accent |
| Typography | Two panels + ruled scale rows | True waterfall specimen: each step at real size with a mono annotation above it; size contrast separates rows, no rules; display step set with real product names |
| Spacing / radius / shadow | Outlined radius squares | Radius shapes filled with `accent-wash` (no outline — the fill shows the curve); spacing bars and shadow chips unchanged in spirit |
| Components | 2-col grid of bordered `.mo-panel` cards | One full-bleed `panel-soft` field; component groups sit directly on it with mono captions; generous 64px vertical rhythm |
| Footer | `border-top` | Whitespace + a thin (8px) drawdown echo strip as the page's closing line |

## Implementation notes

- **No token changes.** Everything above uses existing `--mo-*` and theme
  variables; this is a redeployment of tokens, not a new palette.
- Site-level CSS: delete `border` from `.mo-section`, `.mo-panel`,
  `.mo-swatch-color`, header, and type-scale rows; add `.mo-pour-band`,
  `.mo-drawdown`, `.mo-field` (full-bleed background section), and a
  scroll-shadow header behavior.
- Push the site-local display size up via a `clamp()` override on the hero and
  section titles (the `--mo-text-display` token itself stays at 3.5rem — it's
  sized for product UIs, not specimen sheets).
- The drawdown + poured bands read token values from the active theme via the
  existing `useTheme()` / `getThemeById()` — same data the swatches use today.
- Scope: `site/` package only; `ui/` and `themes/` untouched.
- Branch: `feat/site-drawdown-redesign` once approved.

## Open questions

- Keep the `/` shortcut hint in the hero copy, or move it to the header next to
  the theme picker?
- The mockup trims the gallery to three exhibit groups for brevity; the real
  build keeps all seven (buttons/badges, inputs/avatars, card/dialog,
  form/selection, alerts, sign-in, entry cards) as stacked exhibits on the
  field.
