# Design

> Auto-generated and maintained by frontend-god-mode.
> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any subsequent session.

## Aesthetic direction

Industrial data-operations console for a retail group data lake: practical, dense, grid-based, with visible ETL, quality, lineage, scheduling, and governance controls.

## Dials

- DESIGN_VARIANCE: 5 / 10
- MOTION_INTENSITY: 3 / 10
- VISUAL_DENSITY: 8 / 10

## Type stack

- Display: Helvetica Neue
- Body: Helvetica Neue + Microsoft YaHei fallback
- Mono: SFMono-Regular / Consolas for IDs, counters, and runtime labels
- Banned: Inter, emoji icons, decorative data-science slogans

## Color tokens

```css
:root {
  --surface: #fbfcfd;
  --canvas: #f1f4f6;
  --line: #d5dde8;
  --text: #0e1624;
  --muted: #56657b;
  --blue: #1138b7;
  --green: #0f8b4c;
  --amber: #96610a;
  --red: #c4382f;
}
```

## Layout

- Login gate first; no API requests and no business console before authentication.
- Sticky left navigation, sticky command bar, and dense sections for dashboard, sources, pipeline, quality, assets, governance, operations, and acceptance.
- Diagrams use functional grid canvases for DAG and lineage rather than decorative illustrations.
- Tables remain horizontally scrollable where data density requires it.

## Project-specific bans

- No generic “big data platform” sample data without industry context.
- No business data before login.
- No broken external images; this project should not rely on remote imagery.
- No purely decorative animation on charts or workflow nodes.

## Last updated

2026-06-26 by Worker D: added login gate and recast the platform as a retail group data lake covering ETL, quality rules, lineage, scheduling, and governance.
