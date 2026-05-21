# Foundation — Developer Reference (CLAUDE.md)

Comprehensive reference for the Foundation React template: design system, modules, forms, theming, and conventions.

**Guides:** [PROJECT_STARTUP.md](./PROJECT_STARTUP.md) · [MODULE_GUIDE.md](./MODULE_GUIDE.md) · [FORM_PATTERNS.md](./FORM_PATTERNS.md)

**Root copy:** Also see `/CLAUDE.md` at repository root for AI agent rules.

---

## Overview

**Foundation** is a reusable React SPA template for SaaS applications. Clone it, strip demo pages, add modules, and ship.

| Area | What's included |
|------|-----------------|
| Design system | 90+ components under `src/design-system/UIComponents/` |
| Theming | Runtime brand color, font, light/dark — persisted in localStorage |
| Layout | `AppShell`, sidebar, topbar, command palette |
| Reference module | Billings — listing, 4 form variants, detail |
| Responsive | 10 min-width breakpoints (320px → 2560px) |

### Tech stack

- React 19 + Vite 8 + TypeScript 5.9
- MUI v7 + Emotion
- React Router 7
- Recharts, Tiptap, Zustand (toast), chroma-js, dayjs
- **lucide-react** — primary icon set (16px in navigation)

### Architecture (simplified)

```
src/
├── App.tsx                          # Routes + navConfig + AppShell
├── design-system/
│   ├── tokens.ts                    # Brand color, scales, shadows, responsive arrays
│   ├── breakpoints.ts               # 10 Foundation breakpoint keys
│   ├── generateTheme.ts             # MUI theme factory
│   ├── ThemeContext.tsx             # useFoundationTheme()
│   ├── components/index.ts          # Barrel → UIComponents
│   └── UIComponents/                # Primitives, Display, DataTable, Forms, Navigation…
├── pages/
│   ├── Billings/                    # Reference module
│   ├── ComponentLibrary/            # Component showcase (optional demo)
│   └── Settings/                    # Theme customization panel
└── main.tsx
```

---

## Design System

### Tokens (`src/design-system/tokens.ts`)

**Rebrand in one place:**

```typescript
export const BRAND_COLOR = '#6366F1'
```

chroma-js generates 11-stop scales for primary, neutral, error, success, warning, and info.

**Common exports:**

```typescript
import {
  tokens,
  BRAND_COLOR,
  BORDER_RADIUS,
  BORDER_WIDTH,
  SHADOWS,
  RESPONSIVE_SPACING,
  RESPONSIVE_FONT_SIZE,
} from '@/design-system/tokens'
```

| Category | Keys / notes |
|----------|----------------|
| Border radius | `xs` 2px, `sm` 4px, `md` 6px, `lg` 8px, `xl` 12px |
| Border width | `thin` 1px, `medium` 2px, `thick` 3px |
| Shadows | `xs`, `sm`, `md`, `lg` |
| Spacing scale | `tokens.spacing[n]` — 8px-based semantic scale |
| Colors | `tokens.color.primary[500]`, semantic scales |

### Typography

Defined in `generateTheme.ts` — variants `h1`–`h6`, `body1`, `body2`, `caption`, `overline`. Form section titles use `variant="overline"` (12px, uppercase).

### Theme runtime (`ThemeContext.tsx`)

```typescript
import { useFoundationTheme } from '@/design-system/ThemeContext'

const { config, setBrandColor, setMode, toggleMode, isDark, muiTheme } = useFoundationTheme()
```

- Persisted key: `foundation:theme`
- Settings UI: `src/pages/Settings/` (FAB opens drawer)
- Presets: brand colors and Google Fonts in `themeConfig.ts`

---

## Components

### Import rule (critical)

```typescript
// ✅ UI components
import { Button, Input, Modal, FormField, DataTable } from '@/design-system/components'

// ✅ Layout only from MUI
import { Box, Stack, Typography } from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'

// ❌ Do not use MUI Button, TextField, etc. for app UI
```

`@/design-system/components` re-exports `src/design-system/UIComponents/`.

### Categories

| Folder | Examples |
|--------|----------|
| `Primitives/` | Button, Input, Select, Textarea, Toggle, DatePicker, FileUpload |
| `Display/` | Badge, Avatar, Chip, Tag, Spinner |
| `Cards/` | BaseCard, StatCard, MetricCard, ListCard |
| `Charts/` | LineChart, BarChart, PieChart, AreaChart, RadarChart, … |
| `DataTable/` | DataTable, TableToolbar, GlobalSearch, ColumnHeader |
| `Feedback/` | Modal, Drawer, Toast, ConfirmDialog, Skeleton |
| `Forms/` | **FormField**, **FormSection**, FormActions, RichTextEditor, TagInput |
| `Navigation/` | AppShell, Sidebar, Topbar, Stepper, Breadcrumb, BackButton |
| `Infographics/` | Timeline, GaugeChart, ProgressRing, … |
| `Templates/` | **BillingTemplate** (module blueprint) |

### Frequently used components

```typescript
import {
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  FormField,
  FormSection,
  DataTable,
  useToast,
  AppShell,
  Breadcrumb,
  BackButton,
  Stepper,
  type NavConfig,
  type TableState,
} from '@/design-system/components'
```

**Button** — `variant`: `contained` | `outlined` | `text`; `color`: `primary` | `secondary` | `warning` | …

**Input** — `onChange: (value: string) => void` (not DOM event)

**Modal** — `title`, `subtitle`, `size`, `footer`, `children`

**Drawer** — `width`, `title`, `subtitle`, `footer`, `children`

Details and examples: [FORM_PATTERNS.md](./FORM_PATTERNS.md)

---

## Forms

### Primitives

- **FormField** — label, required/optional, hint, error, helperText
- **FormSection** — titled grid (`columns` 1–3), optional collapse

### Four variants (Billings)

| Variant | Component | Doc |
|---------|-----------|-----|
| Modal | `BillingModal` → Foundation `Modal` | [FORM_PATTERNS.md §1](./FORM_PATTERNS.md#1-modal-form) |
| Drawer | `BillingDrawer` → Foundation `Drawer` | [FORM_PATTERNS.md §2](./FORM_PATTERNS.md#2-drawer-form) |
| Full-page | `FormPage` + `BillingFormCard` | [FORM_PATTERNS.md §3](./FORM_PATTERNS.md#3-full-page-form) |
| Stepper | `StepperFormPage` + `Stepper` | [FORM_PATTERNS.md §4](./FORM_PATTERNS.md#4-stepper-form) |

Shared body: **`BillingFormSections`** in template folder.

---

## Module Structure

### Page folder

```
src/pages/YourModule/
├── index.tsx              # <Outlet /> layout
├── components/
│   ├── ListingPage.tsx
│   ├── DetailPage.tsx
│   ├── FormPage.tsx
│   └── StepperFormPage.tsx
└── hooks/
    └── useYourModuleData.ts
```

### Template folder

```
src/design-system/UIComponents/Templates/YourModuleTemplate/
├── types.ts
├── index.ts
└── components/            # KPI, table, modal, form sections, …
```

### Routes (nested)

```tsx
<Route path="/billings" element={<BillingsLayout />}>
  <Route index element={<ListingPage />} />
  <Route path="create" element={<FormPage />} />
  <Route path=":id" element={<DetailPage />} />
  <Route path=":id/edit" element={<FormPage />} />
</Route>
```

Full walkthrough: [MODULE_GUIDE.md](./MODULE_GUIDE.md) · Setup: [PROJECT_STARTUP.md](./PROJECT_STARTUP.md)

---

## Responsive Design

### 10 breakpoints (`breakpoints.ts`)

| Key | Min width | Typical device |
|-----|-----------|----------------|
| `xs` | 320px | Mobile small |
| `sm` | 375px | Mobile medium |
| `md` | 428px | Mobile large |
| `lg` | 600px | Tablet portrait |
| `xl` | 900px | Tablet landscape |
| `desktop` | 1024px | Desktop small |
| `desktopMd` | 1280px | Desktop medium |
| `desktopLg` | 1536px | Desktop large |
| `desktopXl` | 1920px | Full HD |
| `desktopUhd` | 2560px | 4K |

```typescript
import { FOUNDATION_BREAKPOINT_VALUES } from '@/design-system/breakpoints'

// sx prop
sx={{
  display: { xs: 'block', desktop: 'flex' },
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  p: { xs: 2, desktop: 4 },
}}
```

### Responsive token arrays

`RESPONSIVE_SPACING`, `RESPONSIVE_FONT_SIZE`, etc. in `tokens.ts` — each array has **10 entries** aligned with breakpoint tiers. Use `useResponsiveValue` hook when needed:

```typescript
import { useResponsiveValue } from '@/design-system/hooks/useResponsiveValue'
```

### App shell breakpoint

Sidebar permanent at `theme.breakpoints.up('lg')` (600px in Foundation theme — tablet portrait). Below that: temporary drawer + hamburger.

---

## Theming

### Customize brand

1. **Code default:** `BRAND_COLOR` in `tokens.ts`
2. **Runtime:** Settings panel → color picker → `setBrandColor`
3. **Navigation chrome:** Settings → navigation color section

### Light / dark

```typescript
const { setMode, toggleMode, isDark } = useFoundationTheme()
```

Test new UI in both modes.

### Do not hardcode

```typescript
// ❌
sx={{ color: '#6366F1', padding: '16px' }}

// ✅
sx={{ color: 'primary.main', p: 2 }}
sx={{ color: tokens.color.primary[500] }}
```

---

## Icons

| Context | Library | Size |
|---------|---------|------|
| Nav, toolbar, page actions | `lucide-react` | 16px (`strokeWidth={1.75}`) |
| Inside MUI widgets (sort, close) | `@mui/icons-material` | default |

```tsx
import { FileText, Plus, ChevronLeft } from 'lucide-react'

<FileText size={16} strokeWidth={1.75} />
```

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `ListingPage.tsx` |
| Hooks | camelCase, `use` prefix | `useBillingData.ts` |
| Template components | `ModuleName` + role | `BillingKPICards.tsx` |
| Types / interfaces | PascalCase | `Invoice`, `InvoiceFormData` |
| Constants | UPPER_SNAKE | `MOCK_INVOICES`, `EMPTY_FORM` |
| Route paths | kebab-case | `/billings`, `/your-module/create` |

---

## Best Practices

### Organization

- One module per `pages/YourModule/` + optional `Templates/YourModuleTemplate/`
- Barrel exports from template `index.ts`
- Lazy-load page components in `App.tsx`

### Design

- Use FormField + FormSection for all forms
- Use tokens for radius, shadow, color
- KPI + tabs + toolbar + table pattern for listings

### Imports

- `@/design-system/components` for UI
- `import type { ... }` for type-only imports (`verbatimModuleSyntax`)

### Styling

- Prefer `sx` with theme keys
- 8px spacing grid via MUI (`p={2}` = 16px if theme spacing is 8 — verify `generateTheme` spacing multiplier)

---

## Common Tasks

### Start a new project

1. Clone repo, `npm install`, `npm run dev`
2. Follow [PROJECT_STARTUP.md](./PROJECT_STARTUP.md)

### Add a module

1. Copy Billings + BillingTemplate
2. Follow [MODULE_GUIDE.md](./MODULE_GUIDE.md)

### Add a form

1. Create `YourFormSections.tsx` with FormField/FormSection
2. Wire modal, drawer, or page per [FORM_PATTERNS.md](./FORM_PATTERNS.md)

### Add a design system component

1. Create under `UIComponents/<Category>/ComponentName/`
2. Export from category `index.ts` and `UIComponents/index.ts`
3. Add showcase in `ComponentLibrary` if useful

### Style with brand colors

```typescript
import { tokens } from '@/design-system/tokens'
import { useTheme } from '@mui/material/styles'

const theme = useTheme()
sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
```

---

## File Locations Reference

| Purpose | Path |
|---------|------|
| App entry + routes | `src/App.tsx` |
| Design tokens | `src/design-system/tokens.ts` |
| Breakpoints | `src/design-system/breakpoints.ts` |
| Theme generation | `src/design-system/generateTheme.ts` |
| UI barrel | `src/design-system/components/index.ts` |
| All UI components | `src/design-system/UIComponents/` |
| Billings pages | `src/pages/Billings/` |
| Billings template | `src/design-system/UIComponents/Templates/BillingTemplate/` |
| FormField | `src/design-system/UIComponents/Forms/FormField/` |
| FormSection | `src/design-system/UIComponents/Forms/FormSection/` |
| Settings / theme UI | `src/pages/Settings/` |
| Component showcase | `src/pages/ComponentLibrary/` |
| Module template doc | `src/design-system/UIComponents/Templates/ModuleTemplate.md` |

---

## Navigation Config Type

```typescript
type NavConfig =
  | { type: 'group'; label: string; children: NavConfig[] }
  | { type: 'item'; label: string; href: string; icon?: ReactNode; badge?: string }
```

Nested groups support sub-menus (e.g. Billings → All Invoices, Create, Stepper).

---

## Data Table State

Listings use `TableState` from the design system:

```typescript
interface TableState {
  page: number
  pageSize: number
  sortKey: string | null
  sortDirection: 'asc' | 'desc' | null
  filters: FilterChip[]
  searchQuery: string
  columnSearch: Record<string, string>
  selectedRows: string[]
  expandedRows: string[]
  hiddenColumnKeys: string[]
}
```

Billings listing: `src/pages/Billings/components/ListingPage.tsx`.

---

## Getting Help

1. **Billings module** — working reference for all page types
2. **ComponentLibrary** — visual demos per category
3. **ModuleTemplate.md** — short template notes in repo
4. **Guides in `docs/`** — startup, modules, forms (this folder)

---

## Summary

| Goal | Start here |
|------|------------|
| New project from template | [PROJECT_STARTUP.md](./PROJECT_STARTUP.md) |
| Build listing + CRUD module | [MODULE_GUIDE.md](./MODULE_GUIDE.md) |
| Modal / drawer / page / stepper forms | [FORM_PATTERNS.md](./FORM_PATTERNS.md) |
| Tokens, imports, breakpoints | This file |

Foundation optimizes for **consistent modules**: copy Billings, rename template components, wire routes, replace mock data, keep FormField/FormSection and design tokens throughout.
