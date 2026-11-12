---
type: Architecture Decision
title: Shared site footer adoption
description: Every Mobayilo product uses the design-system footer and supplies only product-specific config.
timestamp: 2026-11-12T13:26:29+09:00
---

# Shared site footer adoption

Every product's footer comes from this component; a product only writes its
config file. The implementation lives in [`@mobayilo/ui`](/ui/README.md) and
accepts a `FooterConfig` validated by the package's JSON Schema and runtime
validator.

Products using React render `SiteFooter`. Static products use `mo-footer
render`, `mo-footer inject`, and `mo-footer check`; the latter keeps product CI
aligned with the canonical markup. Products without a bundler copy the
standalone stylesheet with `mo-footer css`.

The optional `brand.tag` is a string or `{ "text", "i18n" }`; it renders as a
small outlined label under the description and before the copyright. CSS
uppercases its text while preserving the configured value. Set
`--mo-footer-accent` (default `#2f4fd8`) to change its square mark, or
`--mo-footer-tag-font` to change its monospace text.

The config owns product copy and destinations. Footer structure, responsive
layout, accessibility attributes, link handling, and styling come from the
shared implementation. Inline SVG logos are trusted config content and must be
reviewed as such.
