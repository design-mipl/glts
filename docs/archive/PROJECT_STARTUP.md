# Archived Project Startup Guide

This document replaces the old generic Foundation startup guide.

The old guide described cloning `foundation/` as a reusable SaaS template, copying Billings, wiring demo routes, and adapting `BillingTemplate`. That workflow is no longer the default for GLTS product work.

## Current Guidance

For GLTS development, use:

- [root CLAUDE.md](../../CLAUDE.md) as the primary implementation rules source.
- [Developer Onboarding](../DEVELOPER_ONBOARDING.md) for platform architecture and ownership.
- [Product UI Architecture & UX Standards](../PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md) for portal UI and UX rules.

## Legacy Use Only

Use this archived note only if the project is intentionally being treated as a generic Foundation template again.

Legacy startup flow:

1. Clone or copy the Foundation app.
2. Install dependencies with `npm install`.
3. Start Vite with `npm run dev`.
4. Remove demo pages that are not needed.
5. Replace Foundation-specific metadata.
6. Build product routes under the correct owner.

For current GLTS work, new screens belong under `src/pages/{website,auth,customer,admin}/`, internal operations screens belong under `src/pages/admin/operations/`, reusable UI belongs under `src/design-system/UIComponents/`, and shared contracts/services belong under `src/shared/`.

