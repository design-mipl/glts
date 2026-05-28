# GLTS Frontend Documentation

Primary implementation rules now live in [`../CLAUDE.md`](../CLAUDE.md).

Keep this folder for extended reference docs only.

## Extended references

- [Developer Onboarding](./DEVELOPER_ONBOARDING.md) — architecture, routing, ownership, component inventory.
- [Product UI Architecture & UX Standards](./PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md) — deeper surface-level UX guidance.

## Cross-doc UI rule highlights

- **Form modal sizing:** use content-driven modal height (`height: auto`) with viewport-capped `max-height` (for example `min(100vh - 64px, 90vh)`), and avoid fixed modal heights for standard forms.

## Live UI references (admin)

- **Component library** — `/admin/tools/component-library` (design-system primitives and molecules).
- **Template showcase** — `/admin/tools/templates` (module recipes: listing, detail, dashboard, forms). Registry: `src/pages/admin/_tools/TemplateShowcase/config/templateRegistry.ts`.

## Reference-only policy (admin templates)

- Admin template pages and template docs are reference scaffolds for future implementation.
- Actual feature modules in the owning page-surface folder are the runtime source of truth.
- Do not treat template files as production dependency targets.
- If a reusable behavior or pattern is changed:
  - Implement it in the actual module location.
  - Mirror the same behavior in template reference location(s).
  - Update docs so implementation and reference stay aligned.
- If a change is module-specific and not reusable, keep it only in the actual module location.

## Archived

- [Project Startup](./archive/PROJECT_STARTUP.md) — legacy Foundation clone/startup guidance. Use only when reviving the generic template workflow.

## Deprecated

- `docs/CLAUDE.md` was removed because it duplicated the root `foundation/CLAUDE.md`, onboarding guide, module guide, and form guide.
- `src/pages/` is the production page root. Keep internal tools under `src/pages/admin/_tools`, removable scaffolds under `src/pages/admin/_legacy`, and reusable UI under `src/design-system/UIComponents/`.

