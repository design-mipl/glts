# Dashboard UI Kit

Reusable visual language for GLTS **Dashboard Next**. Built on:

1. **Public API** — executive layout / metric / chart / table primitives (unchanged exports)
2. **Internal shadcn layer** — Radix + CVA primitives (`Card`, `Tabs`, `Progress`, `Alert`, …)
3. **Design System tokens** — colors, radius, type, elevation via MUI theme + `tokens` / `publicBrand`

Business widgets and dashboards must **only** import from this kit’s public barrel — never from `shadcn/`.

## Location

`src/pages/admin/dashboard-next/shared/dashboard-ui-kit/`

```ts
import {
  HeroSection,
  ExecutiveMetric,
  ChartContainer,
  ExecutiveTable,
} from '@/pages/admin/dashboard-next/shared/dashboard-ui-kit'
```

## Architecture

```
Dashboard Pages → Business Widgets → Dashboard UI Kit → shadcn (internal) → DS tokens
```

## Design philosophy

- Executive, spacious, data-first (Fabric / Power BI / Stripe-like clarity)
- Sections answer a **business question** (`question` prop on section headers)
- Less chrome, more information; whitespace is intentional
- Subtle elevation; avoid nested double borders
- Tables with many columns get **full page width**
- Large charts use **hero / full-width** containers

## Folder map

| Folder | Responsibility |
|--------|----------------|
| `shadcn/` | **Internal** Radix/CVA primitives (not a public API) |
| `layout/` | Page/section rhythm, grids, story sections |
| `metrics/` | Hero / executive / trend / health / progress metrics |
| `cards/` | Executive, insight, financial, glass, risk, action surfaces |
| `charts/` | Chart chrome only — pass chart nodes as `children` |
| `analytics/` | Story aliases for chart containers |
| `lists/` | Activity, alerts, rankings, recommendations, timeline |
| `tables/` | Full-width–aware executive tables |
| `navigation/` | Workspace tabs, filter bar, in-page story nav |
| `feedback/` | Loading / empty / error / restricted frames |
| `motion/` | Hover elevation, fade-in, reduced-motion aware |
| `hooks/` | Breakpoints, reduced motion, animated numbers |
| `utils/` | View-state resolution, table width heuristic |
| `tokens.ts` | Spacing / shadow / radius **aliases** onto DS + `publicShadows` |

## Accessibility

- Visible `:focus-visible` rings on interactive kit controls
- Semantic section / alert / status roles on feedback surfaces
- `useUiKitReducedMotion()` disables hover lift and KPI animation

## What this kit is not

- Not a second design system
- Not a place for domain widgets
- Not a place for dashboards to import Radix/shadcn directly
