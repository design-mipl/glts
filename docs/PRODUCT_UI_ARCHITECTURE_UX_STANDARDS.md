# GLTS Product UI Architecture and UX Standards

This document defines how GLTS product surfaces should use the frontend architecture, design system, shared layer, layout patterns, and reusable product recipes.

Use it as:

- A frontend architecture guideline.
- A UX consistency standard.
- An onboarding reference.
- A future implementation rulebook.

It applies to new GLTS product work across `src/pages/`, `src/shared/`, and `src/design-system/UIComponents/`.

---

## 1. Product Surface Overview

GLTS has multiple product surfaces with different UX goals. Each surface should share brand, typography, spacing, theme, and interaction quality, but they should not all use the same layout strictness.

| Surface | Purpose | Primary owner | UX behavior | Flexibility level |
|---------|---------|---------------|-------------|-------------------|
| Public Website | Marketing, visa discovery, country browsing, public CTAs | `src/pages/website/` | Rich, persuasive, responsive, content-led | High flexibility |
| Retail Flow | Retail customer entry into visa discovery and application start | `src/pages/customer/` wrapper plus `src/pages/customer/` signed-in flow | Guided, simple, low-friction | Medium flexibility before login, strict inside portal |
| Customer Portal | Signed-in retail and B2B customer workspace | `src/pages/customer/` | Consistent workflows, listings, dashboards, upload flows | Strict |
| Admin Portal | Internal administration, masters, customers, users, finance, oversight | `src/pages/admin/` | Highly structured, operational, enterprise-grade | Strictest |
| Operations Portal | Internal case handling, document review, assignments, SLA work | `src/pages/admin/operations/` | Queue-driven, status-heavy, time-sensitive | Very strict, workflow-focused |

### Ownership Boundaries

- `src/pages/{website,auth,customer,admin}/` owns product routes, pages, layouts, navigation, page composition, and page-surface-specific components. Operations workflows are admin-owned under `src/pages/admin/operations/`.
- `src/shared/` owns cross-surface contracts, services, auth/session, permissions, hooks, and utilities.
- `src/design-system/UIComponents/` owns generic UI only.
- `src/design-system/UIComponents/Templates/` is a scaffold/example layer.
- `src/pages/admin/_tools` owns internal tools; `src/pages/admin/_legacy` owns removable scaffolds.

### Flexibility vs Strictness

Public website pages can use expressive layouts and custom sections. Authenticated product portals should converge on repeatable recipes so users do not need to relearn navigation, filtering, actions, forms, or status behavior.

As a rule:

- Public pages may vary by campaign and content type.
- Customer pages should reuse portal listing, dashboard, detail, form, upload, and tracking patterns.
- Admin and Operations pages should be the most standardized because they carry operational risk.

---

## 2. Public Website Rules

The Public Website is the flexible marketing and discovery surface. It should feel visually richer than internal portals while still belonging to the same GLTS product ecosystem.

### Standards

Use Public Website rules for:

- Landing pages.
- Country listing pages.
- Country detail pages.
- Public tracking lookup pages.
- Pricing or package pages.
- CTA and conversion sections.
- Visa discovery flows before login.

### Allowed Flexibility

Public pages may use:

- Custom hero sections.
- Editorial layouts.
- Destination cards.
- Rich imagery.
- Campaign-specific sections.
- Custom section ordering.
- Responsive visual compositions.
- Lighter motion than internal portals.

Public pages should avoid:

- Admin-style dense tables unless the content is truly tabular.
- Heavy portal chrome.
- Unstructured one-off spacing.
- Hardcoded styling that breaks global brand or theme consistency.
- Product workflow components that imply signed-in state.

### Reusable Public Components

Keep public-only components under `src/pages/website/components/` when they are tied to marketing or destination discovery.

Good public-only components:

- `PublicLayout`
- `PublicHeader`
- `PublicContainer`
- `DestinationListingCard`
- `MobileStickyCta`
- Public hero sections
- Country discovery filters
- CTA bands

Promote to `src/design-system/UIComponents/` only when the component is generic and useful outside public marketing.

### Spacing Rules

- Use theme spacing through `sx` and shared public tokens.
- Keep landing sections visually open.
- Use consistent horizontal page gutters through `PublicContainer`.
- Avoid arbitrary one-off margins that make adjacent public pages feel unrelated.
- Maintain mobile bottom spacing when sticky CTAs are present.

### Typography Rules

- Use GLTS brand typography and shared public typography helpers.
- Public pages may use larger headlines and marketing copy hierarchy.
- Body text should remain readable and consistent across landing, listing, and detail pages.
- Avoid mixing unrelated font families inside the same page.

### Responsive Behavior Rules

Public pages must be fully responsive:

- Mobile: stacked sections, prominent CTAs, simplified filters.
- Tablet: two-column where appropriate, no cramped cards.
- Desktop: richer layout, wider grids, sticky pricing or CTA panels where useful.

Responsive behavior should be implemented with MUI breakpoints, `sx`, and simple structural changes.

### Animation and Motion Guidance

Motion is allowed on public pages when it improves comprehension or conversion.

Use motion for:

- Subtle reveal effects.
- CTA hover states.
- Card hover affordances.
- Lightweight progress or discovery interactions.

Avoid motion that:

- Slows down interaction.
- Distracts from forms or CTAs.
- Makes responsive behavior unpredictable.
- Differs from GLTS brand tone.

### When To Create Public-Only Components

Create a public-only component when:

- It encodes marketing copy or imagery.
- It is tied to a destination discovery experience.
- It relies on public layout rules.
- It would add business assumptions to the design system if promoted.

Do not create public-only components for generic buttons, modals, tables, forms, tags, drawers, or feedback.

---

## 3. Customer Portal Rules

The Customer Portal is a signed-in workspace. It must prioritize consistency, task completion, and predictable navigation.

### Portal Shell Usage

Customer Portal pages should render inside `PortalShell`.

`PortalShell` owns:

- Sidebar and mobile drawer.
- Topbar.
- Main scroll container.
- Responsive portal frame.

Pages should not create their own full-screen shell unless they are a deliberate flow-level exception, such as a focused application creation flow.

### Sidebar and Topbar Behavior

Sidebar and topbar behavior should be consistent across Retail and B2B:

- Use `usePortalBase` for `/retail` vs `/business/app` navigation.
- Do not hardcode base paths inside shared customer pages.
- Gate B2B-only or marine-only navigation through session/config helpers.
- Keep account/profile actions in topbar or profile pages, not scattered across screens.

### Page Composition Standards

Customer Portal pages should usually follow:

1. Page title and optional subtitle.
2. Primary actions in the page header.
3. Optional KPI row.
4. Tabs when switching data segments.
5. Toolbar with search, filters, view toggle, export, and column controls.
6. Table/grid/list content.
7. Pagination or footer summary.
8. Empty/loading/error states.

Avoid one-off layouts when an existing portal recipe fits.

### Listing Pages

Customer listing pages should reuse:

- `PortalListingShell`
- `PortalListingToolbar`
- `PortalListingTable`
- `PortalListingGrid`
- `PortalListingPagination`
- `PortalListingKpis`
- `usePortalListing`

Listing standards:

- Search is available for meaningful list data.
- Filters reset pagination to page 1.
- Table and grid views use the same source data and state.
- Pagination is visible when data exceeds page size.
- Row actions are consistent and icon-labeled.
- Empty states explain what happened and what to do next.

### Application Flows

Application flows should be structured as guided workflows:

- One route owner for the flow.
- One state hook for flow state.
- Step components under a feature folder.
- Shared stepper/progress indicator.
- Explicit back/continue behavior.
- Review step before submit.

Recommended flow shape:

```text
applications/
  create/
    CreateApplicationFlowPage.tsx
    steps/
      ApplicationActionStep.tsx
      CountrySelectionStep.tsx
      VisaTypeSelectionStep.tsx
      TravelDateStep.tsx
      UploadStep.tsx
      ReviewStep.tsx
    components/
    hooks/
```

### Upload Workflows

Upload workflows should use a standard layout:

- Upload dropzone or file picker.
- Upload queue.
- Document checklist.
- OCR or extracted field review area.
- Validation states.
- Progress indicators.
- Review and submit action.

Upload pages should not hide errors. Use clear statuses such as `processing`, `verified`, `needs_review`, `missing`, `invalid`, and `uploaded`.

### Dashboard Structure

Dashboards should include:

- KPI cards.
- Quick actions.
- Recent applications or recent activity.
- Pending actions.
- Notifications or alerts.
- Optional charts when they answer a real user question.

Dashboards should not duplicate full listing behavior. Link users to the relevant listing page instead.

### Detail Pages

Detail pages should include:

- Breadcrumb or back action.
- Summary header card (entity title, status, meta row, actions).
- Tabs inside a single content panel card.
- Sections inside the panel (uppercase labels + dividers, not stacked nested cards).
- Timeline or activity feed when relevant.
- Related documents and notes when relevant.

Customer portal reference implementation: `CustomerDetailWorkspace`, `CustomerDetailHeader`, and `CustomerDetailSection` under `src/pages/customer/features/shared/components/detail/` (used by Profile & account).

Detail pages should load from a service or route param, not only from list row state.

### Profile and Account Pages

Profile/account pages should group content into a three-tab workspace:

- Company profile (organization visibility, documents, supported operations).
- Billing and agreement (commercial visibility, view only).
- Personal profile (self-account details, password, sessions).

Use read-only field groups for admin-managed data. Keep portal workflow preferences out of this module (corporate user management or separate preferences).

### Modal and Drawer Usage

Use:

- Drawer for side workflows such as booker create/edit or document upload.
- Modal for focused confirmation or short forms.
- Full page for complex workflows or multi-step flows.

Modal sizing rule (required for all new form modals):

- Modal paper height must be content-driven (`height: auto`) so short forms do not render with unnecessary empty space.
- Modal paper must define a viewport-safe `max-height` (for example `min(100vh - 64px, 90vh)`) so long forms scroll inside content.
- Do not force fixed modal height for standard form flows unless a product-approved exception exists.

Avoid mixing modal, drawer, and full-page behavior for the same action without a clear reason.

**Overlay header typography** (implemented in `Drawer`, `Modal`, and centered `ConfirmDialog` titles via `overlayHeaderTypography.ts`):

| Element | Spec | Notes |
|--------|------|--------|
| Title | `16px`, `fontWeight: 600`, `text.primary` | Do **not** use `Typography variant="h6"` — theme `h6` is `11px` (micro label tier). |
| Subtitle | `13px`, `fontWeight: 400`, `text.secondary` | Passport, progress, or context line below title. |
| Header padding | `tokens.spacing[3]` horizontal, `tokens.spacing[2]` vertical | Sticky header with divider. |
| Footer actions | `outlined` cancel + `contained` primary, `13px`, `textTransform: 'none'` | Use `overlayFooterButtonSx` + `getOutlinedButtonSx` / `getPrimaryButtonSx` so both share **`10px` border radius** (`BUTTON` / `FORM_CONTROL` in `formControl.ts`). Do not rely on raw MUI `Button` without these tokens. |

Customer wizard step titles may use `20px` / `800` for page H1; overlay titles stay at **16px** so drawers and modals read as panels, not full pages.

Overlay header alignment rule:

- For title-only overlays, vertically center the header row content (`title` and close icon) for balanced height.
- For title + subtitle overlays, top-align header content so subtitle spacing remains readable.
- Keep this behavior consistent in both shared `Drawer` and shared `Modal`.

---

## 4. Admin Portal Rules

The Admin Portal has the strictest consistency requirements. It is an enterprise control surface for internal administrative work.

### Admin Shell

Admin should have its own authenticated shell:

- `AdminShell`
- `AdminSidebar`
- `AdminTopbar`
- Admin route config
- Admin nav config

Admin must not use public website layout behavior in production. Public headers, public footers, marketing CTAs, and destination marketing sections do not belong in Admin.

### Admin UX Standard

Admin pages should feel:

- Dense but readable.
- Operational.
- Permission-aware.
- Audit-friendly.
- Consistent across modules.
- Optimized for repeat work.

### Listing Recipe

Admin listing pages should use:

- Page title and subtitle.
- KPI or summary row if useful.
- Dense toolbar.
- Global search.
- Saved or advanced filters where needed.
- DataTable with sorting and column controls.
- Pagination.
- Bulk actions.
- Row actions.
- Empty and loading states.

### Detail Recipe

Admin detail pages should use:

- Breadcrumb or back action.
- Summary header with status.
- Tabs for overview, records, documents, activity, settings, and audit.
- Side panels for notes or metadata when useful.
- Clear primary and destructive actions.
- Activity or audit trail.

### Form Recipe

Admin forms should use:

- Form sections.
- Explicit labels.
- Validation messages.
- Save/cancel actions.
- Sticky footer for long forms.
- Confirmation for destructive or high-impact changes.

Use full-page forms for complex admin tasks and drawers/modals for smaller edits.

### DataTable Usage

Admin tables should standardize:

- Column labels.
- Sort behavior.
- Filter behavior.
- Sticky right **Actions** column (`key: 'actions'`, fixed width, header label **Actions**, `RowActions` per row).
- Cell ellipsis so row data does not overflow into the sticky actions column.
- Status badge placement.
- Bulk selection.
- Pagination.
- Empty/loading states.
- Export only when useful and permission-allowed.

Prefer `AdminListingTable` (wraps embedded `DataTable` with column filters) inside `AdminListingShell` rather than standalone `DataTable` with its own toolbar on admin listing pages.

### Filters and Pagination

- Filters should be visible or discoverable from the toolbar.
- Applied filters should be clear to the user.
- Changing filters should reset pagination.
- Page size should be user-controlled when lists are large.
- Server-side pagination should be introduced through shared service contracts when APIs arrive.

### Status Badges

Status badges must use consistent semantics:

- Success for complete/approved/active.
- Warning for pending/requires action.
- Critical for failed/rejected/blocked.
- Info for in review/processing.
- Neutral for draft/archived/disabled.

Do not invent new color meanings per module.

### Confirmation Dialogs

Use confirmation dialogs for:

- Delete.
- Disable.
- Reject.
- Cancel.
- Permission changes.
- Role changes.
- Bulk state changes.
- Financial or billing changes.

Destructive actions should clearly describe impact and recovery.

### Permission Guards

Admin must be permission-aware:

- Hide unavailable modules when a role has no access.
- Disable unavailable actions when visibility is useful but action is restricted.
- Show clear permission messages.
- Keep permission decisions in shared contracts or admin guards, not scattered inline in every button.

### Audit and Activity Patterns

Admin pages should expose audit context:

- Who changed it.
- What changed.
- When it changed.
- Previous and new status where applicable.
- Comments or reasons for sensitive changes.

Audit trails should be a reusable admin pattern, with domain data supplied by shared services.

---

## 5. Operations Portal Rules

Operations is for internal execution work: case handling, document review, assignment, embassy coordination, and SLA management.

### Operations Standards

Operations pages should support:

- Operational queues.
- Work assignment.
- Case detail views.
- Status progression.
- SLA visibility.
- Timeline and activity feeds.
- Document review.
- Internal notes.
- Escalations.

### Queue Pages

Operational queues should emphasize:

- Priority.
- SLA deadline.
- Current status.
- Assigned owner.
- Customer type.
- Country/visa type.
- Next required action.

Queues should be filterable by status, assignee, SLA risk, country, customer type, and date.

### Case Handling

Case pages should include:

- Application summary.
- Applicant/traveler details.
- Documents.
- Status progression.
- Assignment controls.
- Notes.
- Timeline.
- Customer-visible vs internal-only communication.

### Status Progression

Operations status changes should be explicit and auditable.

Use controlled transitions instead of free-form status edits:

- New.
- Documents pending.
- Documents verified.
- In embassy review.
- Approved.
- Rejected.
- Delivered.
- Blocked.

### SLA Visibility

SLA indicators should be visible in queue and detail contexts:

- On track.
- At risk.
- Breached.
- Blocked by customer.
- Blocked by embassy/vendor.

### How Operations Differs From Customer Portal

Customer Portal shows customer-facing progress, uploads, and account actions. Operations owns internal processing, verification, assignment, and case resolution.

Customer Portal should not expose internal SLA, internal notes, assignment queues, or operator-only statuses.

### How Operations Differs From Admin Portal

Admin controls configuration, users, customers, masters, finance, and oversight. Operations executes cases.

Admin may view operational metrics and audit data, but case processing workflows should stay in Operations Portal.

---

## 6. Design System Usage Rules

The design system is the business-neutral UI layer. It should provide reusable interface components, not GLTS domain behavior.

### What Belongs In `design-system/UIComponents`

Generic UI belongs here:

- Button
- IconButton
- Input
- Select
- Modal
- Drawer
- DataTable
- ColumnFilter
- RowActions
- Pagination
- EmptyState
- Tabs
- Breadcrumb
- AppShell
- Cards
- Charts
- StatusBadge or Tag
- Upload primitives
- Form sections

### What Does Not Belong In Design System

GLTS business logic does not belong in design-system.

Bad design-system components:

- `VisaApprovalButton`
- `MarineCrewUploader`
- `InvoiceStatusWorkflowCard`
- `ApplicationSlaDecisionPanel`
- `CustomerAgreementRulesCard`
- `EmbassySubmissionStepper`

Those belong in portal feature folders unless generalized.

### Good vs Bad Examples

GOOD:

```text
Button
DataTable
Modal
Drawer
StatusBadge
ColumnFilter
UploadQueue
ActivityFeed
```

BAD:

```text
VisaApprovalButton
MarineCrewUploader
InvoiceStatusWorkflowCard
BookerPermissionWorkflow
SchengenDocumentChecklist
```

### When To Create Portal-Specific Components

Create a page-surface-specific component when it:

- Contains product copy.
- Knows GLTS routes.
- Uses portal session or permissions.
- Renders domain-specific fields.
- Encodes a workflow for one portal.

### When To Promote Into Design System

Promote a component when:

- It is used by more than one portal.
- It can be named generically.
- It has no GLTS business rules.
- It takes all content and behavior through props.
- It can be documented as reusable UI.

### Component Layering Rules

Use this dependency direction:

```text
page-surface pages -> portal components -> shared services/types
page-surface pages -> design-system UI
shared -> shared only
design-system -> tokens/theme/MUI only
```

Do not allow:

```text
shared -> portals
design-system -> portals
design-system -> GLTS business data
page-surface pages -> template internals
```

### Import Rules

Use the canonical barrel:

```ts
import { Button, DataTable, Modal } from '@/design-system/UIComponents'
```

Do not deep import component internals from product code:

```ts
// Do not do this.
import Button from '@/design-system/UIComponents/Primitives/Button'
```

Do not import template internals into product pages:

```ts
// Do not do this.
import { SomeTemplateInternal } from '@/design-system/UIComponents/Templates/SomeTemplate'
```

### Token Usage Rules

- Use theme values, tokens, and `sx`.
- Do not hardcode colors when a token or theme value exists.
- Do not introduce one-off spacing scales.
- Use consistent typography variants and public/customer/admin recipes.
- Keep responsive behavior aligned to the same breakpoint model.

---

## 7. Shared Layer Rules

`src/shared/` is the cross-surface product logic layer.

### What Belongs In `src/shared`

Use `shared` for:

- Auth/session contracts.
- Permissions and role helpers.
- API contracts.
- Mock/API services.
- Domain types.
- Application contracts.
- Document contracts.
- Customer/account contracts.
- User/role contracts.
- Tracking utilities.
- Status utilities.
- Cross-portal hooks.
- Pure utilities.
- Public brand helpers that are intentionally shared.

Recommended future shape:

```text
src/shared/
  auth/
  permissions/
  services/
    applicationService.ts
    documentService.ts
    customerService.ts
    trackingService.ts
    billingService.ts
  types/
    application.ts
    document.ts
    customer.ts
    user.ts
    billing.ts
    tracking.ts
  hooks/
  utils/
  theme/
```

### What Should Not Go Into Shared

Do not put these in `shared`:

- Portal routes.
- Product pages.
- Portal layouts.
- Portal sidebars/topbars.
- Portal-specific rendering logic.
- Marketing sections.
- Admin-only UI composition.
- Customer-only workflow screens.

Shared should not depend on portals.

### Service Boundary Rules

- Pages may transform data for display.
- Services own data retrieval and mutation shape.
- Types define contracts.
- Shared services should be shaped like future APIs.
- Portal-local mock data is allowed temporarily, but durable contracts should move to shared before API integration.

---

## 8. Page Recipes

Use these recipes before creating new page structures.

For reusable product template contracts, listing acceptance rules, and promotion rules, see [root CLAUDE.md](../CLAUDE.md).

For admin module step-by-step implementation (copy-from files, shell components, checklists), see [Admin Module Implementation Guide](./ADMIN_MODULE_IMPLEMENTATION_GUIDE.md).

Template showcase registry (live URLs and component lists): `src/pages/admin/_tools/TemplateShowcase/config/templateRegistry.ts`.

### Listing modules {#listing-modules}

Use for applications, bookers, customers, users, masters, invoices, queues, and documents.

**Live demo:** `/admin/tools/templates/listing`  
**Reference source:** `src/pages/admin/_tools/TemplateShowcase/pages/ListingTemplatePage.tsx`

Required parts:

- Page header.
- Optional KPI row.
- Toolbar.
- Search.
- Filters.
- Table or grid.
- Pagination.
- Row actions.
- Empty state.
- Loading state.

Optional parts:

- Bulk selection.
- Bulk actions.
- Export.
- Column visibility.
- Advanced filters.
- Saved views.

Standard order:

```text
Header
KPI row
Tabs, if needed
Toolbar
Advanced filters
Table/Grid
Pagination
```

Listing implementation standard:

- Use `ListingTemplatePage.tsx` as the reference source of truth for listing composition order and behavior.
- Do not use queue-template or customer-listing-template variants as separate scaffolds; compose all listings from the same canonical listing recipe.
- Compose each admin listing with: `AdminListingShell`, `AdminListingStickyHeader`, `AdminListingToolbar`, `AdminListingAdvancedFilters`, `AdminListingTable` or `AdminListingGrid`, and `Pagination` — or approved surface-specific wrappers that preserve the same UX sequence.
- Use design-system table primitives inside `AdminListingTable`: `DataTable`, `ColumnFilter`, `RowActions`, and `Pagination`.
- **Actions column:** last column, `key: 'actions'`, sticky right, fixed width, header **Actions**, `RowActions` in cells; data columns use ellipsis so content does not overflow into the action column.
- Keep module-specific columns, row actions, status tabs, export behavior, route paths, and permissions in the feature folder.
- Component library **DataTable** tab demonstrates the underlying table engine; admin listings should use the admin listing shell stack above.

Listing exception policy:

- One-off listing structures are allowed only with documented module constraints (regulatory/legal behavior, embedded third-party restrictions, or critical performance constraints).
- The PR must include: why the reference module is insufficient, which reference components are still reused, and screenshots that show intentional differences.

### Detail modules {#detail-modules}

Use for application detail, customer detail, account detail, user detail, invoice detail, and case detail.

**Live demo:** `/admin/tools/templates/detail`  
**Reference source:** `src/pages/admin/_tools/TemplateShowcase/pages/DetailTemplatePage.tsx`

Required parts:

- Breadcrumb or back action.
- Summary header.
- Status badge.
- Primary actions.
- Tabs or sections.
- Activity timeline when changes matter.

Recommended tabs:

- Overview.
- Documents.
- Activity.
- Notes.
- Settings or permissions.
- Audit, for Admin.

Detail implementation standard:

- Use `AdminDetailShell` for page frame and breadcrumbs.
- Promote neutral detail mechanics only: detail shell, read-only field blocks, `BaseCard`, `FormSection`.
- Keep status semantics, edit behavior, activity source, audit rules, and document data module-owned.

### Dashboard modules {#dashboard-modules}

Use for portal home screens and operational overview pages.

**Live demo:** `/admin/tools/templates/dashboard`  
**Reference source:** `src/pages/admin/_tools/TemplateShowcase/pages/DashboardTemplatePage.tsx`

Required parts:

- KPI cards.
- Quick actions.
- Recent activity.
- Alerts or pending actions.
- Notifications or updates.

Optional parts:

- Charts.
- Workload breakdowns.
- SLA cards.
- Team performance.
- Calendar or upcoming events.

Dashboard rules:

- Summarize and route users to work.
- Do not duplicate full listings.
- Keep primary actions visible.
- Show actionable alerts before passive charts.
- Prefer reusable cards such as `StatCard`, `MetricCard`, `ListCard`, `ActionCard`, `SummaryCard`, and chart cards.
- Keep dashboard data, greetings, workspace context, and route destinations portal-owned.

### CRUD modules {#crud-modules}

Use for create/edit workflows composed from listing, detail, and form surfaces.

**Live demos:**

| Form type | URL | Reference source |
|-----------|-----|------------------|
| Modal | `/admin/tools/templates/forms/modal` | `ModalFormTemplatePage.tsx` |
| Drawer | `/admin/tools/templates/forms/drawer` | `DrawerFormTemplatePage.tsx` |
| Full page | `/admin/tools/templates/forms/page` | `FullPageFormTemplatePage.tsx` |
| Stepper | `/admin/tools/templates/forms/stepper` | `StepperFormTemplatePage.tsx` |

**Forms patterns guide (component library):** `AdminFormPatternsGuide.tsx` in the Forms tab.

Required parts:

- Clear title.
- Grouped form sections.
- Explicit field labels.
- Validation messages.
- Save/cancel actions.
- Loading and disabled states.

Modal vs drawer vs full-page:

| Form type | Use when |
|-----------|----------|
| Modal | Short focused task, usually 2 to 8 fields. Use content-driven height with viewport-capped max-height; avoid fixed heights. |
| Drawer | Side edit or secondary workflow, usually 4 to 12 fields |
| Full page | Complex form, multi-step flow, review step, or high-impact change |
| Stepper | Staged workflow with review step |

Admin form shells and layout tokens:

| Pattern | Shell | Tokens |
|---------|-------|--------|
| Full page | `AdminFullPageFormShell`, `AdminFullPageFormFooter` | `adminFullPageFormLayout.ts` |
| Modal | DS `Modal`, `FormSection`, `FormField` | `adminOverlayFormLayout.ts` |
| Drawer | `AdminDrawerFormShell`, `AdminOverlayFormSection` | `adminOverlayFormLayout.ts` |
| Stepper | `AdminStepperFormShell`, DS `Stepper` | `adminOverlayFormLayout.ts` |

Form field spec (all surfaces): `src/design-system/formControl.ts` — default `size="sm"`, 34px height, 10px radius, 13px label.

Sticky actions:

- Use sticky footer for long forms.
- Keep destructive actions separated from save actions.
- Confirm high-impact changes.
- Keep fields, validation, save/draft semantics, and mutations module-owned.

### Listing Page (legacy heading — see Listing modules above)

The canonical admin listing recipe is documented under [Listing modules](#listing-modules). Customer portal listings may use `PortalListingShell` and related wrappers while preserving the same UX sequence where applicable.

### Detail Page (legacy heading — see Detail modules above)

See [Detail modules](#detail-modules).

### Dashboard Page (legacy heading — see Dashboard modules above)

See [Dashboard modules](#dashboard-modules).

### Form Page (legacy heading — see CRUD modules above)

See [CRUD modules](#crud-modules).

### Queue Page

Use for Operations queues, review queues, assignment queues, document queues, and SLA-driven work lists.

Required parts:

- Queue header and summary.
- Priority.
- SLA deadline or risk.
- Current status.
- Assigned owner.
- Customer type.
- Country or visa type when applicable.
- Next required action.
- Filters.
- Bulk assignment or escalation actions when applicable.

Queue rules:

- Build queues on the listing standard, then add queue-specific metadata and workflow actions.
- Support filters for status, assignee, SLA risk, country, customer type, and date when applicable.
- Use explicit, auditable status transitions instead of free-form status edits.
- Keep Operations workflow rules inside `OperationsPortal` or shared domain services; do not derive queue semantics from legacy invoice statuses.

### Upload Workflow Page

Use for passport upload, document upload, bulk crew upload, and future import workflows.

Required parts:

- Upload input/dropzone.
- Upload queue.
- Checklist panel.
- Progress indicators.
- Validation states.
- OCR/extracted review when applicable.
- Review and submit step.

Recommended statuses:

- Queued.
- Uploading.
- Processing.
- Verified.
- Needs review.
- Missing.
- Invalid.
- Failed.

Upload flow order:

```text
Select files
Upload/process
Review extracted data
Resolve validation issues
Confirm checklist
Submit
```

---

## 9. Reusability Rules

### Layer Ownership

| Concern | Owner |
|---------|-------|
| Generic UI | `src/design-system/UIComponents/` |
| GLTS business patterns | `src/pages/<surface>/` |
| Contracts and services | `src/shared/` |
| Templates and scaffolds | `src/design-system/UIComponents/Templates/` |
| Legacy demos | `src/pages/` |

### Promote vs Duplicate

Promote when:

- A component is used in multiple portals.
- The abstraction is stable.
- Business logic can be removed.
- Props can express all differences.
- The component has a generic name.

Duplicate or keep page-surface-specific when:

- The second use is uncertain.
- It contains portal copy.
- It contains route decisions.
- It knows permissions.
- It is still changing quickly.
- It belongs to one workflow.

### Generalization Checklist

Before promoting a component, ask:

- Can it be named without GLTS domain words?
- Can it work without portal session?
- Can it work without route imports?
- Can all text be passed as props?
- Can data shape be generic?
- Does it belong in a design-system category?

If the answer is no, keep it page-surface-specific.

### Templates Are Not Product Code

Templates may inform:

- Listing layouts.
- Detail layouts.
- Form layouts.
- Stepper patterns.
- Module scaffolds.

Templates should not be imported directly by product page-surface pages. Promote useful generic parts first.

### `src/pages` Is Legacy/Demo Only

Add new GLTS product pages under the owning `src/pages/<surface>/` folder.

Use it only for:

- Existing demos.
- Component showcase references.
- Temporary audit context.

---

## 10. Public vs Portal Flexibility Matrix

| Area | Flexible | Standardized |
|------|----------|--------------|
| Layouts | Public Website landing, country detail, campaign sections | Customer Portal, Admin Portal, Operations Portal page shells |
| Spacing | Public hero/CTA rhythm may vary within token system | Portal page padding, table spacing, form spacing, section gaps |
| Cards | Public destination and marketing cards may vary | KPI cards, summary cards, admin cards, detail cards |
| Tables | Rare on public pages, only when content requires it | DataTable patterns in Customer/Admin/Operations |
| Forms | Public lead/contact forms may be lighter | Portal forms use sections, validation, sticky actions |
| Navigation | Public header can support marketing priorities | Portal sidebar/topbar patterns must stay consistent |
| Animations | Public pages may use subtle marketing motion | Portals use restrained motion for feedback and state |
| Dashboards | Not usually applicable to public pages | KPI, activity, quick action, alert recipes |
| Filters | Public discovery filters can be visual and exploratory | Portal filters are structured, reset pagination, show applied state |
| Typography | Public headlines may be more expressive | Portal typography follows page hierarchy consistently |
| Responsive behavior | Public sections can rearrange heavily | Portals preserve workflow structure across breakpoints |
| CTAs | Public CTAs may be campaign-specific | Portal actions follow header/toolbar/detail action positions |
| Status | Public status is minimal | Portal statuses use semantic badge rules |

---

## 11. Architecture Guardrails

These rules are mandatory for new product work.

### Import Guardrails

- No deep imports from `UIComponents` internals in product code.
- No imports from `UIComponents/Templates` in product pages.
- Use `@/design-system/UIComponents` as the public UI API.
- Keep `@/design-system/components` only as temporary compatibility if it exists.

### Dependency Guardrails

- `shared` must not import page-surface pages.
- `design-system` must not import page-surface pages.
- `design-system` must not import GLTS product data.
- Portals may import `shared`.
- Portals may import `design-system`.
- Root routing should only import portal app entry points.

### Product Guardrails

- No new product pages under `src/pages`.
- No public website layout behavior in Admin.
- No operations-only workflow inside Admin.
- No admin-only configuration workflow inside Operations.
- No business logic in generic UI components.
- No one-off table/list implementation when an existing pattern fits.
- No template code in production modules unless promoted or migrated intentionally.

### Pattern Guardrails

- Use existing patterns first.
- Create page-surface-specific components before over-generalizing.
- Promote only after repeated use and business-neutral naming.
- Keep API-shaped services out of visual components.
- Keep routes close to portal owners.
- Keep workflow state in hooks or services, not scattered across step components.

---

## 12. Future Scaling Guidance

### How To Add A New Module

1. Choose the owning page surface.
2. Add routes under that portal only.
3. Create a feature folder under the portal.
4. Define page recipe: listing, detail, dashboard, form, upload, or workflow.
5. Use existing UI components and portal patterns first.
6. Put durable contracts in `shared/types`.
7. Put data/API behavior in `shared/services` when used across portals.
8. Keep temporary portal-only mock data near the portal.
9. Add permission and status rules before adding many actions.

### How To Add A Reusable Component

1. Start page-surface-specific.
2. Identify the second real use.
3. Remove business naming.
4. Move content into props.
5. Remove route/session assumptions.
6. Place it in the correct design-system category.
7. Export from `src/design-system/UIComponents/index.ts`.
8. Update product imports to the public barrel.

### How To Promote Patterns Into Design System

Promote UI mechanics, not product workflows.

Good promotion candidates:

- Generic column filter.
- Generic upload queue.
- Generic activity timeline.
- Generic form section.
- Generic empty state.
- Generic status badge.

Keep product-specific:

- Visa application workflow.
- Marine crew upload rules.
- Customer agreement settings.
- Admin role policy screens.
- Operations SLA transition rules.

### How Admin Should Evolve

Admin should grow as a structured portal:

```text
AdminPortal/
  config/
  layout/
  pages/
    dashboard/
    masters/
    applications/
    customers/
    operations/
    billing/
    users/
  components/
  hooks/
```

Introduce shared contracts for:

- Users.
- Roles.
- Permissions.
- Customer accounts.
- Applications.
- Master data.
- Billing.
- Audit events.

### How Operations Should Evolve

Operations should grow around work execution:

```text
OperationsPortal/
  config/
  layout/
  pages/
    queues/
    cases/
    documents/
    assignments/
    sla/
  components/
  hooks/
```

Operations should share domain contracts with Customer and Admin, but keep internal workflow screens under `OperationsPortal`.

### How To Avoid `CustomerPortal` Becoming A Mega-Monolith

Split by feature before the portal grows too large:

```text
CustomerPortal/
  features/
    dashboard/
    applications/
    documents/
    tracking/
    profile/
    bookers/
    marine/
```

Each feature should own:

- Pages.
- Portal-specific components.
- Hooks.
- Temporary mock data.
- Feature-local utilities.

Move cross-feature and cross-surface contracts into `shared`.

### Scaling Principle

The correct direction is:

```text
Start specific -> stabilize pattern -> extract shared contract -> promote generic UI
```

Avoid the reverse. Do not start by creating generic abstractions before the product workflow is understood.
