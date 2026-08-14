# 多源异构大数据处理与质量治理平台设计规范

This file is the source of truth for UI/UX review and future changes.

## Product Direction

- Product: big data processing and governance console for retail data lake operations.
- Aesthetic: engineering control console with blue signal color, crisp panels, data-flow canvas, and compact operational density.
- Priority: access control, pipeline observability, data quality, governance, and acceptance evidence.

## Core Rules

- Authentication is a hard gate. Do not reveal business or platform metrics before login.
- Role login must show supported roles and credentials, then provide submit feedback and inline failure messaging.
- All interactive elements must be at least 44 x 44 px, including links styled as buttons and workflow nodes.
- Focus-visible must be present on buttons, links, inputs, selects, and canvas nodes.
- Do not rely on color alone for pipeline states. Legends and status pills must include text labels.
- Respect `prefers-reduced-motion`; smooth scrolling and transitions must reduce when requested.
- Mobile layouts must collapse to one column without body-level horizontal scrolling. Data tables and canvases may scroll inside their own regions.
- Charts need labels, accessible names, legends, and textual summaries.

## Tokens

- Surface: `#fbfcfd`
- Canvas: `#f1f4f6`
- Alternate surface: `#eef2f7`
- Text: `#0e1624`
- Muted text: `#56657b`
- Blue: `#1138b7`
- Green: `#0f8b4c`
- Amber: `#96610a`
- Red: `#c4382f`
- Borders: `#d5dde8`
- Typography: Helvetica Neue, Arial, Microsoft YaHei, sans-serif; mono labels use SFMono-Regular/Consolas.

## Accessibility Checklist

- Skip link remains first focusable control.
- Global search uses a real label or screen-reader-only label.
- Toasts use `role="status"` and `aria-live="polite"`.
- Workflow canvas nodes are buttons with descriptive `aria-label`.
- Status dots are decorative only when adjacent text labels exist.

## Components

- Buttons and button-like links: 44 px min height, clear hover/active/focus states.
- Status pills: visible text plus semantic color.
- Workflow node: button element, 44 px minimum interactive size.
- Data table: horizontal scroll is constrained to `.table-wrap`; mobile keeps controls reachable.
