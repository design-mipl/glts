# Dashboard Intelligence

Shared **executive BI behaviour** layer for Dashboard Next.

```
Dashboard Pages → (optional) Dashboard Intelligence → Business Widgets / UI Kit
```

Widgets stay isolated. They never import each other. Pages subscribe to intelligence context and pass props into existing widgets.

## Location

`src/pages/admin/dashboard-next/shared/dashboard-intelligence/`

```ts
import {
  DashboardIntelligenceProvider,
  DashboardFilterBar,
  ExecutiveSectionNav,
  DrilldownHost,
  ExecutiveSearch,
} from '@/pages/admin/dashboard-next/shared/dashboard-intelligence'

// Or namespace from shared barrel:
import { DashboardIntelligence } from '@/pages/admin/dashboard-next/shared'
```

## Modules

| Folder | Responsibility |
|--------|----------------|
| `filters/` | Sticky filter bar + `DashboardFilterContext` |
| `navigation/` | Scroll spy + section jump nav |
| `drilldown/` | Drawer / dialog / slide-over drilldown engine |
| `insights/` | Insight banners / cards / recommendations |
| `alerts/` | Management alert center (business impact) |
| `comparisons/` | Period / branch / segment comparison models |
| `search/` | Ctrl/Cmd+K command search |
| `exports/` | PDF / Excel / CSV / PPTX framework |
| `refresh/` | Live refresh + last updated |
| `analytics/` | Predictive / forecast panels |
| `providers/` | Composed `DashboardIntelligenceProvider` |

## Rules

- Do **not** put Super Admin–only logic here
- Do **not** change Business Widget or UI Kit public APIs
- Prefer Context + hooks; memoize derived state
- Accessibility: sticky nav landmarks, command palette keyboard, focusable drilldowns
