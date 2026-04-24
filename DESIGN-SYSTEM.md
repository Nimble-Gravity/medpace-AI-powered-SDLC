# Design System Notes

This file captures layout and spacing rules that should be reused when adding new pages or expanding existing sections.

## Card Grids

- Shared card grids should use CSS Grid with `gap: 24px`.
- Card grids must set `align-items: stretch`.
- Cards inside shared grids should fill the row height of the largest card in that grid.
- In shared grid patterns, apply `height: 100%` to the direct grid children so equal-height behavior is explicit rather than accidental.
- If a card appears in a grid, equal-height presentation is the default. Opt out only when the layout is intentionally masonry-like or list-like.

## Card Internals

- Shared editorial cards should use a vertical stack pattern: `display: flex`, `flex-direction: column`, `gap: 12px`.
- Do not build card rhythm with one-off `margin-bottom` and `margin-top` rules on headings, labels, quotes, and metadata if the card can use a shared stack.
- Keep card padding consistent unless a card type is structurally different:
  `padding: 22px 24px`
- Section-level spacing should live on the grid or the section wrapper, not on the first or last child inside the card.
- If a card uses nested body wrappers, the wrapper should usually take `flex: 1` so the card content fills the available height cleanly.

## Development Page Pattern

For development-page cards in `shared.css`, the reference pattern is:

- Grid gap: `24px`
- Card internal gap: `12px`
- Card padding: `22px 24px`
- Grid items: stretched to equal height within the row

If a new development section introduces a new card type, match this pattern first and only diverge when the content structure actually requires it.

## Authoring Rule

- Before adding a new shared layout pattern, check whether it belongs in `shared.css` and should be documented here.
- If a spacing fix is needed in more than one place, fix the component pattern and update this file instead of patching a single page.
- When reviewing a grid of cards, check two things every time:
  equal-height rows across each grid
  consistent vertical spacing inside each card and between the grid and adjacent elements
