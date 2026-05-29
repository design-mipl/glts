# Admin Module Implementation Guide

Practical cookbook for building new **GLTS Admin Portal** modules with consistent UX. Use this alongside the live demos — docs point to code; demos show behavior.

**Enforcement rules (short):** [`../CLAUDE.md`](../CLAUDE.md)  
**Architecture context:** [`DEVELOPER_ONBOARDING.md`](./DEVELOPER_ONBOARDING.md)  
**UX standards:** [`PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md`](./PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md)

---

## Live references

| Resource | URL | Source |
|----------|-----|--------|
| Component library | `/admin/tools/component-library` | `src/pages/admin/_tools/ComponentLibrary/` |
| Template showcase hub | `/admin/tools/templates` | `src/pages/admin/_tools/TemplateShowcase/` |
| Template registry | — | `src/pages/admin/_tools/TemplateShowcase/config/templateRegistry.ts` |

### Component library tabs → when to use

| Tab | Use when building… |
|-----|-------------------|
| **Primitives** | Buttons, inputs, selects, checkboxes, date pickers — base controls |
| **Display** | Badges, tags, avatars, activity feed |
| **Cards** | KPI cards, summary cards, list cards |
| **Charts** | Dashboard analytics panels |
| **DataTable** | Table engine, filters, pagination, row actions (see listing recipe) |
| **Feedback** | Modal, drawer, confirm dialog, toast, loading |
| **Forms** | FormField, FormSection, admin form pattern guide (modal/drawer/page/stepper) |
| **Navigation** | Breadcrumb, tabs, stepper |
| **Responsive** | Breakpoint behavior for admin layouts |
| **Colors** | Brand tokens via `publicBrand.ts` and theme generation |

---

## Design tokens (do not drift)

Canonical dimensions live in code — keep pages aligned with these sources:

| Concern | Source file |
|---------|-------------|
| Form field height, radius, label size | `src/design-system/formControl.ts` (`FORM_CONTROL`) |
| Button height, radius, padding | `src/design-system/formControl.ts` (`BUTTON`) |
| Brand palette | `src/shared/theme/publicBrand.ts` |
| MUI theme mapping | `src/design-system/generateTheme.ts` |
| Spacing, radius, shadows | `src/design-system/tokens.ts` |

**Defaults:** form controls `size="sm"` (34px); buttons default `md` (36px). See [`CLAUDE.md`](../CLAUDE.md) for full spec.

---

## Folder structure for a new admin module

```text
src/pages/admin/<domain>/<feature>/
├── pages/
│   ├── <Feature>ListingPage.tsx      # listing recipe
│   ├── <Feature>DetailPage.tsx       # detail recipe (optional)
│   └── forms/
│       ├── Create<Feature>Page.tsx   # full-page form (optional)
│       └── Edit<Feature>Drawer.tsx   # drawer form (optional)
├── components/
│   ├── <Feature>TableColumns.tsx     # Column[] + RowActions
│   ├── <Feature>KpiRow.tsx           # optional
│   └── <Feature>AdvancedFilters.tsx  # or reuse AdminListingAdvancedFilters pattern
├── hooks/
│   └── use<Feature>Listing.ts        # data + filter state (or shared hook)
├── data/                             # mock/config until API
└── utils/
    └── <feature>ListingUtils.ts      # search match, tab filter, export map
```

**Ownership:** domain columns, routes, permissions, mock data, and mutations stay in the feature folder. Shells and DS components stay in `src/pages/admin/components/` and `@/design-system/UIComponents`.

---

## Recipe: Listing module {#listing-modules}

**Live demo:** `/admin/tools/templates/listing`  
**Copy from:** `src/pages/admin/_tools/TemplateShowcase/pages/ListingTemplatePage.tsx`  
**Columns example:** `src/pages/admin/_tools/TemplateShowcase/components/templateDemoColumns.tsx`

### Required composition order

1. `AdminListingShell`
2. Sticky page header — `AdminListingStickyHeader` (title + primary CTA)
3. Optional KPI row
4. Optional tabs (segment record views)
5. Toolbar — `AdminListingToolbar` (search, export, table/grid toggle, column picker, more menu)
6. Advanced filters — `AdminListingAdvancedFilters` (module-specific selects)
7. Listing content — `AdminListingTable` **or** `AdminListingGrid`
8. Pagination footer — DS `Pagination`
9. Empty / loading states + toast feedback on export/refresh

### Shell components

| Component | Location | Role |
|-----------|----------|------|
| `AdminListingShell` | `src/pages/admin/components/AdminListingShell.tsx` | Page frame: header, KPIs, tabs, toolbar slot, content, footer |
| `AdminListingStickyHeader` | `src/pages/admin/components/listing/` | Sticky title + actions |
| `AdminListingToolbar` | `src/pages/admin/components/listing/` | Search, view toggle, export, column picker |
| `AdminListingAdvancedFilters` | `src/pages/admin/components/listing/` | Module filter row (country, status, etc.) |
| `AdminListingTable` | `src/pages/admin/components/listing/` | Embedded `DataTable` + column filters |
| `AdminListingGrid` | `src/pages/admin/components/listing/` | Card grid alternative |

### DataTable conventions

- Always add an actions column with `key: 'actions'`, `hideable: false`, fixed width (~56–60px), `RowActions` in `render`.
- The actions column is **sticky on the right**; cell content in other columns must not overflow into it (ellipsis + opaque sticky background).
- Action column header shows **Actions** label (not a menu icon).
- Use `sortable: false`, `filterable: false`, `searchable: false` on the actions column.
- Prefer `AdminListingTable` over raw `DataTable` in admin listings — it wires column filters and embedded table chrome.

### Module-specific (keep in feature folder)

- Column definitions and `RowActions` handlers
- Tab definitions and tab-specific column sets
- Advanced filter fields and options
- Routes (row click → detail, CTA → create)
- Permissions, export format, bulk action logic

### Listing done checklist

- [ ] Composition matches `ListingTemplatePage.tsx`
- [ ] Sticky header with primary CTA in header row (not toolbar)
- [ ] Search resets page; filters reset page
- [ ] Table **and** grid modes if applicable
- [ ] Tab-specific empty states with CTA where useful
- [ ] Row actions + row click to detail
- [ ] Toast on export / refresh / bulk actions
- [ ] Responsive: mobile card view via `DataTable` built-in behavior

---

## Recipe: Detail module {#detail-modules}

**Live demo:** `/admin/tools/templates/detail`  
**Copy from:** `src/pages/admin/_tools/TemplateShowcase/pages/DetailTemplatePage.tsx`

### Required parts

- `AdminDetailShell` with breadcrumbs
- Summary header (title, status badge, metadata)
- Primary actions (Edit, etc.)
- Tabs or read-only sections (`BaseCard`, `FormSection`, read-only fields)
- Optional activity / audit block

### Shell components

| Component | Location |
|-----------|----------|
| `AdminDetailShell` | `src/pages/admin/components/AdminDetailShell.tsx` |
| `AdminPageHeader` / `AdminRecordPageChrome` | `src/pages/admin/components/` |

Keep status semantics, edit routes, and audit data module-owned.

---

## Recipe: Dashboard module {#dashboard-modules}

**Live demo:** `/admin/tools/templates/dashboard`  
**Copy from:** `src/pages/admin/_tools/TemplateShowcase/pages/DashboardTemplatePage.tsx`

### Required parts

- Page header
- KPI row (`StatCard`, `MetricCard`)
- Quick actions (`ActionCard`)
- Recent activity / alerts (`ListCard`, `ActivityFeed`)
- Optional charts (`ChartCard`)

Dashboards summarize and route to work — do not embed full listings.

---

## Recipe: CRUD / Form modules {#crud-modules}

Forms are composed from listing + detail surfaces; pick the shell by field count and workflow complexity.

| Variant | Live demo | Copy from | Use when |
|---------|-----------|-----------|----------|
| **Modal** | `/admin/tools/templates/forms/modal` | `ModalFormTemplatePage.tsx` | 2–8 fields, quick create/edit |
| **Drawer** | `/admin/tools/templates/forms/drawer` | `DrawerFormTemplatePage.tsx` | 4–12 fields, stay on listing |
| **Full page** | `/admin/tools/templates/forms/page` | `FullPageFormTemplatePage.tsx` | Complex create/edit, many sections |
| **Stepper** | `/admin/tools/templates/forms/stepper` | `StepperFormTemplatePage.tsx` | Multi-step with review |

**Forms tab guide:** `src/pages/admin/_tools/ComponentLibrary/components/AdminFormPatternsGuide.tsx`

### Shell components

| Pattern | Shell | Layout tokens |
|---------|-------|---------------|
| Full page | `AdminFullPageFormShell` + `AdminFullPageFormFooter` | `adminFullPageFormLayout.ts` |
| Modal | DS `Modal` + `FormSection` + `FormField` | `adminOverlayFormLayout.ts` (`ADMIN_MODAL_FORM_*`) |
| Drawer | `AdminDrawerFormShell` + `AdminOverlayFormSection` | `adminOverlayFormLayout.ts` (`ADMIN_DRAWER_FORM_*`) |
| Stepper | `AdminStepperFormShell` + DS `Stepper` | `adminOverlayFormLayout.ts` (`ADMIN_STEPPER_FORM_*`) |

### Section cards (full page / drawer / stepper)

- **Primary section** — required/core record fields (tinted primary surface)
- **Secondary section** — optional/metadata fields (neutral surface)

Do not use section cards inside modals.

### Form rules

- Default `FormField` + DS `Input`/`Select`/`Textarea` at `size="sm"`.
- Modal: content-driven height, viewport-capped `max-height` — no fixed modal heights.
- Drawer/Modal headers: use overlay header typography (`overlayHeaderTypography.ts`), not raw `variant="h6"`.
- Destructive actions separated from save; confirm high-impact changes.

---

## Exception policy

One-off layouts are allowed only for documented constraints (regulatory, third-party embed, critical performance).

Exception PRs must include:

1. Why the reference module cannot be followed
2. Which reference components are still reused
3. Screenshots of intentional differences

---

## Sync rule (templates ↔ product ↔ docs)

When changing a reusable admin pattern:

1. Implement in the owning production location (`src/pages/admin/components/` or design system).
2. Mirror in template showcase and/or component library demo.
3. Update `templateRegistry.ts` if recipes change.
4. Update this guide and [`PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md`](./PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md).

Template files are **reference only** — product modules must not depend on `_tools` paths at runtime.
