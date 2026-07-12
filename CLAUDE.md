# CLAUDE.md — GLTS Frontend Instructions

Read this file before making changes inside `foundation/`. It is the concise project-wide instruction file for the GLTS frontend.

GLTS is a Vite + React + TypeScript frontend using a page-first architecture. This file is the primary rules source.

## Read First

Use these as extended references when needed:

1. `docs/DEVELOPER_ONBOARDING.md` — architecture, routing, folders, ownership, and current status.
2. `docs/PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md` — surface-specific UX direction and deeper implementation context.
3. `docs/ADMIN_MODULE_IMPLEMENTATION_GUIDE.md` — admin module recipes (listing, detail, dashboard, forms) with copy-from files and checklists.

Live implementation references:

- Component library: `/admin/tools/component-library`
- Template showcase hub: `/admin/tools/templates`
- Listing reference: `/admin/tools/templates/listing`
- Listing source module: `src/pages/admin/_tools/TemplateShowcase/pages/ListingTemplatePage.tsx`
- Template registry: `src/pages/admin/_tools/TemplateShowcase/config/templateRegistry.ts`
- Form/button tokens: `src/design-system/formControl.ts`

## Architecture

- `src/app/` owns global app bootstrapping and top-level routing.
- `src/pages/website/` owns the retail/public website experience.
- `src/pages/customer/` owns the signed-in retail and B2B customer portal experience.
- `src/pages/admin/` owns the GLTS Admin Portal, internal operations workflows, internal tools, and admin-only scaffolds.
- `src/pages/auth/` owns sign-in, portal selection, and password reset surfaces.
- `src/shared/` owns cross-surface contracts, services, auth/session, permissions, hooks, utilities, and stable mock/API-shaped data.
- `src/design-system/UIComponents/` owns reusable UI primitives and enterprise components.
- `src/design-system/UIComponents/Templates/` is scaffold/reference only.
- `src/pages/admin/_tools/` is for internal tools such as the component library.
- `src/pages/admin/_legacy/` is for removable admin-era scaffolds.

## UI Strategy

Website and Customer Portal are customer-facing experience surfaces:

- Use flexible, modern, interactive, travel-tech UI.
- Reuse foundation/design-system components selectively where they improve consistency.
- Allow custom visual sections, cards, layouts, empty states, illustrations, and interaction patterns.
- Do not force these surfaces into the full enterprise admin component model.

GLTS Admin Portal is a strict enterprise application:

- Follow the predefined design system and component library.
- Prefer standardized shells, tables, forms, filters, drawers, modals, tabs, badges, and confirmation patterns.
- Optimize for consistency, operational efficiency, scalability, and predictable workflows.
- Avoid one-off custom UI when a design-system pattern exists.

## Component Rules

- Admin pages should use `AdminListingShell`, `DataTable`, `FilterPanel`, `RowActions`, `Drawer`, `Modal`, `ConfirmDialog`, `FormSection`, `FormField`, `Badge`, `Tabs`, and related DS patterns where applicable.
- Website/customer pages may use custom customer-facing components when the experience requires it.
- `src/pages/customer/` should develop a customer-specific shared component layer for portal framing, page headers, cards, status badges, timelines, progress, empty states, mobile navigation, and search.
- Customer page components should feel lighter and more interactive than admin screens; prefer cards, guided flows, progress indicators, and friendly next-action surfaces over dense enterprise tables when the workflow allows.
- Reuse admin-style tables, filters, and management layouts in the customer portal only for genuinely enterprise-like B2B workflows such as booker management or bulk application management.
- Keep customer-specific shared UI under `src/pages/customer/features/shared/components/`; keep page-only UI inside the relevant feature/page folder.
- Do not promote one-off website/customer visual sections into `src/design-system/UIComponents` too early.
- Promote UI into the design system only when it is business-neutral, reusable across surfaces, and stable.
- Keep domain rules, route assumptions, permissions, and mock data out of design-system components.

## Brand and theme

- **Single palette:** `src/shared/theme/publicBrand.ts` is the source of truth for brand colors across website, customer, admin, and auth.
- **Mode only:** users may toggle light/dark (`glts:theme-mode`). Keep brand values locked (no runtime hex editing, no per-tenant palettes).
- **In pages:** use `usePublicBrandColors()` and `getPrimaryButtonSx(colors)`; avoid new hex literals and the removed `publicColors` export.
- **Admin DS:** components consume MUI theme from `src/design-system/generateTheme.ts` (`generateTheme(mode)`), which maps `publicBrand` into:
  - MUI `palette` (primary/secondary/etc)
  - `theme.foundation.navigation` tokens used by the admin `AppShell` sidebar/topbar (should visually align with the customer portal navigation palette)

### Form control dimensions (all surfaces)

Use one field spec everywhere to avoid style drift:

- Field height: `34px` (`sm`, **default**), `40px` (`md` — opt-in only)
- Border radius: `10px`
- Field font: `13px`
- Field padding: `8px` horizontal and vertical (`FORM_CONTROL.paddingX` / `paddingY`)
- Textarea default `minRows`: `2` (`FORM_CONTROL.textareaMinRows`)
- Label: `13px`, `fontWeight: 600`, `text.primary`
- Helper/error text: `12px`

Implementation rules:

- Default to DS primitives: `FormField` + `Input`/`Select`/`Textarea` from `@/design-system/UIComponents`. Form controls default to `size="sm"`; pass `size="md"` only when a taller field is explicitly required.
- **Admin form patterns** (component library **Forms** tab + `src/pages/admin/components/`):
  - **Full-page:** `AdminFullPageFormShell` + `AdminFullPageFormFooter` — primary/secondary section cards (`adminFullPageFormLayout.ts`).
  - **Modal (2–8 fields):** `Modal` + `FormSection` (1 col) + `FormField` — no section cards inside dialog (`adminOverlayFormLayout.ts`).
  - **Drawer (4–12 fields):** `Drawer` + stacked `AdminOverlayFormSection` (primary then secondary) + same footer tokens.
  - **Stepper:** `BaseCard` + DS `Stepper` + `AdminOverlayFormSection` per step + neutral review panel.
  - Live templates: `/admin/tools/templates/forms/page`, `/modal`, `/drawer`, `/stepper`.
- Raw MUI `TextField` is allowed only when inheriting theme defaults from `generateTheme.ts`.
- Do not set per-page field `sx` for `fontSize`, `borderRadius`, border color, or focus ring unless explicitly approved.
- Listing filters must use the same field spec (typically `size="sm"`).

### Button dimensions (all surfaces)

- Button height: `36px` (`md`, **default**), `32px` (`sm` — compact/toolbar only), `40px` (`lg` — hero/marketing CTAs)
- Border radius: `10px` (matches form fields)
- Button font: `13px` (`md`/`lg`), `12px` (`sm`)

Implementation rules:

- Default to DS `Button` / `IconButton` without a `size` prop (both default to `md`).
- Pass `size="sm"` only for intentionally compact affordances (e.g. component-library size demos, dense table chrome).
- Raw MUI `Button` inherits `size="medium"` from `generateTheme.ts`; avoid `size="small"` in product UI.

### Listing acceptance checklist

Before marking a listing module complete, verify:

- Listing page composition follows `src/pages/admin/_tools/TemplateShowcase/pages/ListingTemplatePage.tsx` unless a documented exception is approved
- Sticky page header (`AdminPageHeader` for admin)
- KPI row when useful
- Tabs when workflow has multiple record views (e.g. single/bulk/draft/submitted)
- Toolbar: search, Filter popover, export, column picker, table/grid toggle
- Tab-specific columns and empty states with CTA
- Table and grid view modes
- Pagination footer
- Toast feedback on export/refresh
- Row actions and row click to detail (admin modules)
- Column widths: use `widthSize` with `LISTING_COLUMN_WIDTHS`; see `templateDemoColumns.tsx` — avoid ad-hoc pixel literals in new admin listings
- Actions column: `key: 'actions'`, sticky right, fixed width, header label **Actions**, `RowActions` per row; other columns must ellipsis and not bleed into actions column

### DataTable action column

- Define actions column last with `key: 'actions'`, `label: ''`, `hideable: false`, `width: 56–60`, `sortable/filterable/searchable: false`.
- `DataTable` pins `key === 'actions'` to the sticky right edge with opaque row background.
- Header shows **Actions** text (via `ColumnHeader`); row cells use `RowActions` (⋮ menu).
- Prefer `AdminListingTable` in admin listings — embeds `DataTable` with column filters and listing-appropriate chrome.

### Listing reference standard

All new listing modules must use `src/pages/admin/_tools/TemplateShowcase/pages/ListingTemplatePage.tsx` as the composition reference.
Do not use separate queue or customer-listing template variants as listing scaffolds.

Required composition order:

1. Sticky header
2. Optional KPI row
3. Optional tabs
4. Toolbar (search, Filter popover, export, table/grid toggle, column picker)
5. Table or grid listing content
6. Pagination footer
7. Empty/loading states and row actions

Exception policy:

- Allowed only for explicit product constraints (regulatory, embedded third-party constraints, or critical performance limits).
- Exception PRs must include: reason template cannot be followed, reused pieces, intentional differences, and screenshots.

## Import Rules

- Use `@/design-system/UIComponents` for public reusable UI.
- Treat `@/design-system/components` as a compatibility barrel only.
- Use `@/shared/...` for shared business contracts, services, auth/session, utilities, and durable mock/API-shaped data.
- Use `@/pages/...` only when cross-surface imports are truly needed.
- Do not deep-import `UIComponents/Templates` internals into product pages.
- Keep `src/shared` and `src/design-system` independent from page-specific code.

## Development Rules

- Use folder-per-page inside each page surface when a page may grow.
- Keep page-specific components inside that page folder.
- Put components shared across a surface in that surface's `components/` folder.
- Keep changes scoped to the requested surface, feature, or cleanup.
- Do not recreate removed legacy scaffolds such as the old Billings demo or BillingTemplate.
- Do not remove tools, scaffolds, or shared code unless the cleanup decision is explicit.

## Verification

- Run `npm run build` after route, import, folder, or TypeScript-significant changes.
- Run or inspect lint for changed files when practical.
- Treat known broad lint failures separately from change-specific issues.
- After structural changes, search for stale paths such as `src/portals`, `PortalRouter`, or old deleted folders.

