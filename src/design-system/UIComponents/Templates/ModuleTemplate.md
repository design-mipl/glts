# Module Template — Foundation

This document explains how to build new modules in Foundation using the **Billings** template as reference.

## Module structure

Every module should have:

1. **Listing page** — DataTable (or grid), filters, search, pagination, bulk actions
2. **Form pages** — Create/edit via Modal, Drawer, full-page, or Stepper
3. **Detail page** — Read-only two-column layout with actions
4. **Navigation** — Sidebar entry with collapsible sub-items

## Billings reference layout

```
src/
├── design-system/UIComponents/Templates/BillingTemplate/
│   ├── types.ts
│   ├── index.ts
│   └── components/          ← copy-paste presentational building blocks
├── pages/Billings/
│   ├── index.tsx            ← <Outlet /> layout
│   ├── hooks/useBillingData.ts
│   └── components/
│       ├── ListingPage.tsx
│       ├── DetailPage.tsx
│       ├── FormPage.tsx
│       ├── StepperFormPage.tsx
│       └── PaymentsPage.tsx
└── App.tsx                  ← navConfig + routes
```

## Creating a new module

### 1. Copy the template folder

Duplicate `BillingTemplate` → `YourModuleTemplate`, rename components (`BillingTable` → `YourModuleTable`, etc.).

### 2. Define types

Add entity interfaces in `types.ts` (entity, line items, form data, filters).

### 3. Add mock data hook

Create `pages/YourModule/hooks/useYourModuleData.ts` with mock rows, KPIs, and helpers (`formatINR`, `getById`, `filterByStatus`, `search`).

### 4. Wire pages

| Route | Page |
|-------|------|
| `/your-module` | Listing |
| `/your-module/create` | Full-page form |
| `/your-module/stepper` | Stepper form (optional) |
| `/your-module/:id` | Detail |
| `/your-module/:id/edit` | Full-page edit |

Register static routes **before** `:id` in `App.tsx`.

### 5. Update navigation

Use existing `NavConfig` shape — collapsible group with `children`:

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

`isNavActive()` in `Sidebar/index.tsx` supports prefix matching for `/billings`. Extend the helper if your module needs the same “list + detail” highlighting.

## Design system usage

- Import UI from `@/design-system/components` (never raw MUI inputs/buttons in pages).
- Layout: `Box`, `Grid`, `Typography`, `useMediaQuery` from MUI only.
- Icons: `lucide-react` at 16px, `strokeWidth={1.75}`.
- Colors/spacing: `tokens` and theme palette — no hardcoded hex or px.
- Types: `import type` for type-only imports.

## Component mapping

| Billings | Your module |
|----------|-------------|
| `BillingKPICards` | `YourModuleKPICards` |
| `BillingStatusTabs` | `YourModuleStatusTabs` |
| `BillingTable` | `YourModuleTable` (wraps `DataTable`) |
| `BillingGridView` | `YourModuleGridView` |
| `BillingFilters` | `YourModuleFilters` |
| `BillingModal` / `BillingDrawer` | Popup / drawer forms |
| `BillingFormSections` | Shared form fields |
| `BillingDetailSections` | Read-only detail layout |

## Example: Customers module

1. Rename Billing → Customer in types and components.
2. Replace invoice fields with customer fields.
3. Add `Customers` group to `navConfig`.
4. Add routes under `/customers`.

## Checklist before client demo

- [ ] `npm run build` passes
- [ ] Listing: KPI, tabs, search, filters, table/grid toggle, pagination
- [ ] Modal + drawer forms from listing
- [ ] Full-page + stepper forms via nav sub-items
- [ ] Detail page with edit modal and delete confirm
- [ ] Nav: no badges, sub-items expand, correct active state
- [ ] Responsive at 320px, 1024px, 1920px
- [ ] Dark mode via Settings

## Tips

1. Keep template components presentational (props in, callbacks out).
2. Put routing and toast logic in `pages/`, not in template components.
3. Reuse `DataTable` instead of building tables from scratch.
4. Use one `TableState` for table and grid views when sharing pagination.
