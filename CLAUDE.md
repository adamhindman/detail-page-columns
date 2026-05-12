# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production bundle
npm run preview  # Preview production build
```

No test runner or linter configured.

## Architecture

Single-page vanilla JS layout prototype. Three files make up the app:

- **`index.html`** — Page structure: entity header, two-column detail grid, floating config panel
- **`main.js`** — All logic (~130 lines): lorem ipsum generation, render functions, show-more toggle, config panel wiring
- **`styles.css`** — All styling: blue background (`#253578`), DM Sans font, CSS custom properties for layout dimensions

### Layout structure

```
.page
  .entity-header        ← entity type label + H1 title
  .detail-grid          ← CSS grid: 1fr | 440px fixed
    .description-col    ← lorem text + show-more button
    .properties-col     ← <dl> flat grid (auto | 1fr), no borders
.config-panel           ← fixed bottom, dark themed
```

### Key CSS patterns

**Property list alignment**: The `<dl>` uses `display: grid; grid-template-columns: auto 1fr` with `dt`/`dd` as direct children (not wrapped in divs). This keeps all values aligned to the same column regardless of key length.

**Line clamp**: Applied as both a CSS class (`is-clamped` sets `display: -webkit-box`) and an inline CSS property (`-webkit-line-clamp: N`). The show-more button visibility is checked via `scrollHeight > clientHeight` inside a `requestAnimationFrame` after render.

### Config panel controls

| Control | Effect |
|---------|--------|
| Description words | Word count passed to `loremWords(n)` |
| Line clamp | `0` disables clamping; any positive int clamps + shows "Show more" if needed |
| Properties | Number of `dt`/`dd` pairs rendered |

Hitting **Regenerate** also picks a new random entity type and title.
