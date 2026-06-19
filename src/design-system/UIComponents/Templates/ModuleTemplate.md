# Module Template — Foundation

This document explains how to build new modules using the standardized product template recipes.

For implementation rules, see [root CLAUDE.md](../../../../CLAUDE.md).

## Module structure

Every module should have:

1. **Listing page** — sticky header, KPIs, tabs (when needed), toolbar (search/Filter popover/export/columns/grid), tab-specific columns/empty states, table/grid, pagination, toasts, row actions.
2. **Form pages** — create/edit via modal, drawer, full-page, or stepper surface.
3. **Detail page** — summary header, status, primary actions, sections, and optional activity.
4. **Navigation** — page-surface-owned route entry with predictable active state.
5. **Optional dashboard or queue page** — when the module owns summary or operational work.

## Live template showcase (source of truth)

All module recipes are implemented as **live demos** under Admin → Tools → Template showcase:

- Hub: `/admin/tools/templates`
- Registry: `src/pages/admin/_tools/TemplateShowcase/config/templateRegistry.ts`

When adding or removing a recipe, update `templateRegistry.ts` first, then align this doc and `CLAUDE.md`.

## Reference-only usage policy

- Template showcase pages and this template document are reference-only.
- Build and ship module behavior from the actual owning module path (for example, `src/pages/admin/...` or `src/pages/customer/...`), not from template internals.
- Do not deep-import template internals into production modules.
- If a reusable pattern is required or changed:
  1. Update the actual implementation module first.
  2. Mirror the same pattern in the template reference flow.
  3. Update this document and any related docs.
- If something is one-off and module-specific, keep it in the actual module only.

## Reference layers

- The legacy `BillingTemplate` scaffold and `src/pages/Billings/` demo were removed during cleanup.
- `src/pages/customer/features/shared/components/listing/` is the preferred current listing pattern.
- `src/pages/customer/features/shared/hooks/useCustomerListing.ts` is the preferred current listing state pattern.
- `src/pages/admin/components/AdminListingShell.tsx` is the preferred admin listing shell reference.

Do not deep-import template internals from production pages. Promote reusable UI into `src/design-system/UIComponents/` before product code depends on it.

## Creating a new module

### 1. Choose ownership

Place the module under the owning page surface, such as `src/pages/customer` or `src/pages/admin`. Internal operations workflows belong under `src/pages/admin/operations`. Put cross-surface contracts and services under `src/shared/`.

### 2. Choose page recipes

Use the canonical recipes from `CLAUDE.md` and the live template showcase:

- Listing modules.
- Detail modules.
- Dashboard modules.
- CRUD form surfaces.
- Queue management modules.

### 3. Define types and services

Keep temporary page-surface-only mock data near the feature. Move durable contracts and service shapes to `src/shared/` when they are used across surfaces.

### 4. Compose pages

| Route | Page |
|-------|------|
| `/your-module` | Listing |
| `/your-module/create` | Full-page form |
| `/your-module/stepper` | Stepper form (optional) |
| `/your-module/:id` | Detail |
| `/your-module/:id/edit` | Full-page edit |

Register static routes before `:id` inside the owning page-surface app.

### 5. Update navigation

Use the existing `NavConfig` shape with page-surface-owned routes:

```tsx
{
  type: 'group',
  label: 'Your Module',
  icon: <Icon size={16} strokeWidth={1.75} />,
  children: [
    { type: 'item', label: 'All records', href: '/your-module' },
    { type: 'item', label: 'Create', href: '/your-module/create' },
  ],
},
```

Do not use count badges on nav items for production modules.

### 6. Sidebar active state

Do not add module-specific hardcoded paths to shared navigation. If nested route matching is needed, add or reuse generic route metadata in a later navigation refactor.

## Design system usage

- Import UI from `@/design-system/UIComponents` (never raw MUI inputs/buttons in pages).
- Layout: `Box`, `Grid`, `Typography`, `useMediaQuery` from MUI only.
- Icons: `lucide-react` at 16px, `strokeWidth={1.75}`.
- Colors/spacing: `tokens` and theme palette — no hardcoded hex or px.
- Types: `import type` for type-only imports.

## Standard component mapping

| Need | Start from |
|------|------------|
| Listing shell | `CustomerListingShell` / `AdminListingShell` reference |
| Listing state | `useCustomerListing` reference |
| Table | `DataTable`, `ColumnFilter`, `RowActions`, `Pagination` |
| Toolbar | `CustomerListingToolbar` reference |
| Detail layout | `DetailSection`, `DetailField`, `SummaryField` pattern |
| Form fields | `FormSection`, `FormField`, primitives |
| Form surface | Modal, Drawer, full-page form card, or Stepper |
| Dashboard | `StatCard`, `MetricCard`, `ListCard`, `ActionCard`, chart cards |
| Queue | Listing shell plus SLA, priority, assignment, status, and next-action slots |

## Example: Customers module

1. Place the feature under the owning page surface.
2. Define customer contracts and service/mock data.
3. Compose the listing with the standard listing shell, toolbar, table/grid, and pagination.
4. Compose create/edit using form surfaces and `FormSection` / `FormField`.
5. Compose detail using neutral detail sections and fields.
6. Add page-surface routes and navigation.

## Checklist before client demo

- [ ] `npm run build` passes
- [ ] Listing: header, KPI if useful, tabs if useful, toolbar with Filter popover, table/grid, pagination
- [ ] Modal, drawer, full-page, or stepper form chosen by workflow complexity
- [ ] Detail page with status, actions, sections, and activity/audit when relevant
- [ ] Nav: no badges, correct page-surface ownership, correct active state
- [ ] Responsive at 320px, 1024px, 1920px
- [ ] Dark mode via Settings

## Tips

1. Keep reusable components presentational: props in, callbacks out.
2. Put routing, toast, permissions, and workflow logic in page-surface pages or hooks.
3. Reuse `DataTable`, `ColumnFilter`, `Pagination`, and `RowActions`.
4. Use one table/listing state contract when table and grid share pagination.
5. Start from the customer listing/admin shell references; do not recreate the removed billing scaffold.
