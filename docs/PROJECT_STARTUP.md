# Foundation — Project Startup Guide

This guide explains how to start a new project using Foundation as the base template.

**Related docs:** [MODULE_GUIDE.md](./MODULE_GUIDE.md) · [FORM_PATTERNS.md](./FORM_PATTERNS.md) · [CLAUDE.md](./CLAUDE.md)

---

## Quick Start (5 minutes)

### 1. Clone Foundation Template

```bash
cp -r foundation my-new-project
cd my-new-project
npm install
npm run dev
```

Open `http://localhost:5173` to see the app running.

### 2. Update Project Metadata

**File:** `package.json`

```json
{
  "name": "my-new-project",
  "description": "Your project description",
  "version": "1.0.0"
}
```

**File:** `src/App.tsx`

Update navigation labels, routes, and user mock data. The app shell (`AppShell`) reads `navConfig` and nested `Routes` from this file.

### 3. Remove Demo Content

Delete or replace demo pages you do not need:

```bash
# Optional — remove component showcase
rm -rf src/pages/ComponentLibrary/
```

**Keep:**

- `src/pages/Settings/` — theme customization (brand color, fonts, light/dark mode)
- `src/pages/Billings/` — reference module (listing, forms, detail, stepper)

There is no separate `Preview/` or `ResponsiveExamples/` page folder; responsive demos live under `src/design-system/UIComponents/ResponsiveExamples/`.

### 4. Clean Build

```bash
npm run build
npm run dev
```

Foundation is ready for your modules.

---

## Module Structure

Every feature module should follow this layout:

```
src/pages/YourModule/
├── index.tsx                 # Layout shell (<Outlet />) for nested routes
├── components/
│   ├── ListingPage.tsx       # KPI, tabs, search, table/grid, pagination
│   ├── DetailPage.tsx        # Read-only 2-column view + actions
│   ├── FormPage.tsx          # Full-page form (create/edit)
│   └── StepperFormPage.tsx   # Optional multi-step wizard
└── hooks/
    └── useYourModuleData.ts  # Mock data + filter/search helpers
```

**Reusable template components** (copy from Billings):

```
src/design-system/UIComponents/Templates/BillingTemplate/
├── components/
│   ├── BillingKPICards.tsx
│   ├── BillingStatusTabs.tsx
│   ├── BillingToolbar.tsx
│   ├── BillingTable.tsx
│   ├── BillingGridView.tsx
│   ├── BillingPagination.tsx
│   ├── BillingModal.tsx
│   ├── BillingDrawer.tsx
│   ├── BillingFormCard.tsx
│   ├── BillingFormSections.tsx
│   └── BillingDetailSections.tsx
├── types.ts
└── index.ts
```

Copy the folder to `YourModuleTemplate/` and rename components (`Billing*` → `YourModule*`).

---

## Navigation Setup

**File:** `src/App.tsx`

Foundation uses a typed `NavConfig` with `type: 'group'` and `type: 'item'`. Icons are React nodes (Lucide, 16px).

```tsx
import { LayoutDashboard, BarChart2, FileText, Folder } from 'lucide-react'
import type { NavConfig } from '@/design-system/components'

const navConfig: NavConfig[] = [
  {
    type: 'group',
    label: 'Main',
    children: [
      {
        type: 'item',
        label: 'Dashboard',
        icon: <LayoutDashboard size={16} strokeWidth={1.75} />,
        href: '/',
      },
      {
        type: 'item',
        label: 'Analytics',
        icon: <BarChart2 size={16} strokeWidth={1.75} />,
        href: '/analytics',
      },
    ],
  },
  {
    type: 'group',
    label: 'Management',
    children: [
      {
        type: 'group',
        label: 'Your Module',
        icon: <FileText size={16} strokeWidth={1.75} />,
        children: [
          { type: 'item', label: 'All Items', href: '/your-module' },
          { type: 'item', label: 'Create Item', href: '/your-module/create' },
          { type: 'item', label: 'Stepper Demo', href: '/your-module/stepper' },
        ],
      },
      {
        type: 'item',
        label: 'Records',
        icon: <Folder size={16} strokeWidth={1.75} />,
        href: '/records',
      },
    ],
  },
]
```

Pass `navConfig` to `AppShell`:

```tsx
<AppShell navConfig={navConfig} user={mockUser} onSignOut={...}>
  <Routes>...</Routes>
</AppShell>
```

---

## Adding Routes

**File:** `src/App.tsx`

Use React Router v7 nested routes with a layout component (see Billings):

```tsx
import BillingsLayout from '@/pages/Billings'
const ListingPage = lazy(() => import('@/pages/Billings/components/ListingPage'))
const DetailPage = lazy(() => import('@/pages/Billings/components/DetailPage'))
const FormPage = lazy(() => import('@/pages/Billings/components/FormPage'))
const StepperFormPage = lazy(() => import('@/pages/Billings/components/StepperFormPage'))

<Route path="/your-module" element={<YourModuleLayout />}>
  <Route index element={<LazyPage><ListingPage /></LazyPage>} />
  <Route path="create" element={<LazyPage><FormPage /></LazyPage>} />
  <Route path="stepper" element={<LazyPage><StepperFormPage /></LazyPage>} />
  <Route path=":id/edit" element={<LazyPage><FormPage /></LazyPage>} />
  <Route path=":id" element={<LazyPage><DetailPage /></LazyPage>} />
</Route>
```

**Billings routes (reference):**

| Path | Page |
|------|------|
| `/billings` | Listing |
| `/billings/create` | Full-page form |
| `/billings/stepper` | Stepper form |
| `/billings/:id` | Detail |
| `/billings/:id/edit` | Full-page form (edit) |
| `/billings/payments` | Payments sub-page |

---

## Using Billings as Template Reference

**Location:** `src/pages/Billings/` + `src/design-system/UIComponents/Templates/BillingTemplate/`

### Listing Page

- **KPI cards** — Total Invoiced, Received, Outstanding, TDS Deducted (`BillingKPICards`)
- **Status tabs** — All, Draft, Sent, Partially Paid, Overdue, Paid (`BillingStatusTabs`)
- **Toolbar** — Search, export, columns, table/grid toggle (`BillingToolbar`)
- **Table** — Sortable columns, row selection, column filters (`BillingTable`)
- **Pagination** — Page size + range (`BillingPagination`)
- **Modal** — Quick add from listing (`BillingModal`)

### Form Pages (4 variants)

| Variant | Component | Width / layout |
|---------|-----------|----------------|
| Modal | `BillingModal` | Foundation `Modal`, size `md` (~500–600px) |
| Drawer | `BillingDrawer` | Foundation `Drawer`, `width={500}` |
| Full-page | `FormPage` + `BillingFormCard` | Dedicated route, header + footer actions |
| Stepper | `StepperFormPage` | 4 steps with `Stepper` + step content |

All forms share **`BillingFormSections`** built with `FormField` + `FormSection`.

### Detail Page

- `BackButton` + `Breadcrumb` outside the card
- Title + actions (Edit, Delete, Download, Print)
- `BillingDetailSections` — 2-column read-only layout

### How to adapt for your module

1. Copy `BillingTemplate/` → `YourModuleTemplate/`
2. Rename files and exports (`BillingModal` → `YourModuleModal`, etc.)
3. Update `types.ts` (`Invoice` → `Item`, field names)
4. Update `useYourModuleData.ts` mock data and filters
5. Wire routes and `navConfig` in `App.tsx`
6. Replace mock data with API calls when ready

See [MODULE_GUIDE.md](./MODULE_GUIDE.md) for step-by-step instructions.

---

## Coming Soon Pages (Optional)

Placeholder for modules not yet built:

```tsx
// src/pages/YourModule/components/ComingSoonPage.tsx
import { Box, Typography, Button } from '@mui/material'
import { Construction } from 'lucide-react'

export default function ComingSoonPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
      }}
    >
      <Construction size={64} style={{ opacity: 0.4 }} />
      <Typography variant="h2">Coming Soon</Typography>
      <Typography variant="body2" color="text.secondary">
        This module is under development
      </Typography>
      <Button variant="contained" href="/">
        Back to Dashboard
      </Button>
    </Box>
  )
}
```

Register the route in `App.tsx` and point `navConfig` `href` to it.

---

## Design System Resources

| Resource | Path |
|----------|------|
| UI components (90+) | `src/design-system/UIComponents/` |
| Barrel import | `@/design-system/components` |
| Design tokens | `src/design-system/tokens.ts` |
| Breakpoints (10 tiers) | `src/design-system/breakpoints.ts` |
| Theme factory | `src/design-system/generateTheme.ts` |
| Theme context | `src/design-system/ThemeContext.tsx` |
| Settings UI | `src/pages/Settings/` |
| Icons | `lucide-react` (16px in nav; `strokeWidth={1.75}`) |

```tsx
import { Button, Input, Modal, FormField, FormSection } from '@/design-system/components'
import { tokens, BORDER_RADIUS, SHADOWS } from '@/design-system/tokens'
```

---

## Development Workflow

1. Define types in `Templates/YourModuleTemplate/types.ts` (or `pages/YourModule/types.ts`)
2. Create `hooks/useYourModuleData.ts` with mock data and helpers
3. Copy and adapt `BillingTemplate` components
4. Build page components under `pages/YourModule/components/`
5. Add `index.tsx` layout with `<Outlet />`
6. Register nested routes and `navConfig` in `App.tsx`
7. Test responsive breakpoints: 320px, 1024px, 1920px
8. Connect APIs (replace `MOCK_*` constants)
9. Validate forms and toast feedback (`useToast`)

---

## Common Patterns

### Listing Page

```
┌─────────────────────────────────────────────────────────┐
│ KPI │ KPI │ KPI │ KPI                                    │
└─────────────────────────────────────────────────────────┘
Status tabs: All | Draft | Sent | ...

[ Search............... ]     [Export] [Columns] [Grid/Table]

┌─────────────────────────────────────────────────────────┐
│ ☐  Invoice No  │ Client │ Amount │ Status │ Actions    │
│ ☐  INV-001     │ ...    │ ...    │ Draft  │ ...        │
└─────────────────────────────────────────────────────────┘
Showing 1–10 of 12          Rows per page [10▼]  < 1 2 >
```

### Full-Page Form

```
[Back]  Breadcrumb > Add Invoice

┌─────────────────────────────────────────────────────────┐
│ Add Invoice                    [Cancel] [Draft] [Save]  │
├─────────────────────────────────────────────────────────┤
│ INVOICE DETAILS                                         │
│ [Field] [Field]                                         │
│ [Field] [Field]                                         │
├─────────────────────────────────────────────────────────┤
│                         [Cancel] [Draft] [Save]         │
└─────────────────────────────────────────────────────────┘
```

### Detail Page

```
[Back]  Breadcrumb > Invoice INV-001          [Edit] [Delete] ...

┌──────────────────────┐  ┌──────────────────────┐
│ Section A            │  │ Section B            │
│ Label: Value         │  │ Label: Value         │
└──────────────────────┘  └──────────────────────┘
```

---

## Styling & Theming

### Border radius (`tokens.ts`)

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 2px | Badges |
| `sm` | 4px | Buttons, inputs |
| `md` | 6px | Modals, cards |
| `lg` | 8px | Large containers |
| `xl` | 12px | Major panels |

### Shadows

`SHADOWS.xs` · `sm` · `md` · `lg` — use for cards, modals, dropdowns.

### Spacing

MUI theme uses an **8px grid**: `p={2}` = 16px, `gap={3}` = 24px.

### Colors

- Brand: `BRAND_COLOR` in `tokens.ts` (all scales derive via chroma-js)
- Semantic: `theme.palette.success`, `error`, `warning`, `info`
- Prefer `tokens.color.*` or `theme.palette` — avoid hardcoded hex

### Dark mode

Toggle via Settings FAB (`src/pages/Settings/`). Test both modes for new modules.

---

## Best Practices

1. **Single barrel import** — `@/design-system/components`
2. **Reuse form primitives** — `FormField`, `FormSection`, shared section components
3. **TypeScript types** — colocate with template (`types.ts`)
4. **Lazy-load pages** — `React.lazy` + `Suspense` (see `App.tsx`)
5. **Mock first, API later** — same shape as future API responses
6. **Lucide for UI icons** — MUI icons only inside MUI widgets
7. **Responsive early** — `sx={{ display: { xs: 'block', md: 'flex' } }}`
8. **Toast on save** — `useToast()` for user feedback
9. **Nested routes + layout** — stable shell, swapping child routes only
10. **Copy Billings before inventing** — proven listing/form/detail patterns

---

## Checklist for New Module

- [ ] `src/pages/YourModule/` with `index.tsx` (`<Outlet />`)
- [ ] Types in template `types.ts`
- [ ] `hooks/useYourModuleData.ts` with mock data
- [ ] Template folder copied from `BillingTemplate`
- [ ] `navConfig` updated in `App.tsx`
- [ ] Nested routes registered
- [ ] Listing page: KPI, tabs, search, table, pagination
- [ ] At least one form variant (modal or full-page)
- [ ] Detail page (optional)
- [ ] Tested at 320px, 1024px, 1920px
- [ ] No console errors; `npm run build` passes
- [ ] Imports from `@/design-system/components`
- [ ] Dark mode checked

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Component not found | Export in `UIComponents` barrel; import from `@/design-system/components` |
| Styles wrong | Use `tokens`, `BORDER_RADIUS`, `SHADOWS`; avoid raw px/hex |
| Form layout broken | Wrap inputs in `FormField`; group with `FormSection` |
| Nav highlight wrong | `href` must match route `path` exactly |
| Route blank | Parent layout must render `<Outlet />` |

---

## Next Steps

1. [MODULE_GUIDE.md](./MODULE_GUIDE.md) — build a module step by step
2. [FORM_PATTERNS.md](./FORM_PATTERNS.md) — modal, drawer, full-page, stepper
3. [CLAUDE.md](./CLAUDE.md) — design system and component reference
4. Explore `src/pages/Billings/` and `BillingTemplate/` in the repo
