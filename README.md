# Detail Page Columns

A layout prototype for a detail page header with an adaptive two-column layout.

**Live demo:** https://adamhindman.github.io/detail-page-columns/

## Layout

The header has two layouts: **side-by-side**, where the description and properties sit in equal-width columns with a 40px gap, and **stacked**, where the description appears on top and the properties below in a single column.

After the page renders, the pixel heights of both columns are measured and compared as a ratio (left ÷ right). If the ratio falls below a threshold, the layout switches to stacked. The left column includes the description text, the optional "Show more" button, and an optional scorecard element.

The prototype includes interactive layout controls for tuning the threshold and testing different content configurations.

## Dev

```bash
npm install
npm run dev
```
