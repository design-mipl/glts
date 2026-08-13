# Application Management — Status, QC, and Queue Flow

Product overview for Marine / Corporate / B2B Application Management listings.

**Processing stage** (embassy journey labels) is deferred. This document defines **Status** and **listing tabs** only.

---

## Two columns (do not mix)

| Column | Meaning | Source |
|--------|---------|--------|
| **Status** | Ops / Docs work-queue signal | QC outcomes + queue handoffs |
| **Processing stage** | Embassy / appointment / dispatch journey | Define later — leave mock values as-is for now |

---

## Listing tabs (work queues)

| Tab | Who works it |
|-----|----------------|
| Verification Pending | Ops |
| Submission Pending | Docs (form QC / form submit) |
| Pending Payment | Ops **or** Docs (payment can be recorded by either) |
| Embassy / VFS Submission Pending | After the application is **completely submitted** |
| Collection / Collected / Dispatched | Later pipeline (unchanged) |

### Dual queue (important)

After Ops marks **all passengers** Verified & Ready for Submission:

- The same application appears in **both**:
  - **Submission Pending**
  - **Pending Payment**
- Payment does not block Docs form work, and form work does not block payment.

When the application is **completely submitted** (form / portal submit done):

- It **leaves** Submission Pending and Pending Payment
- It moves to **Embassy / VFS Submission Pending**

---

## QC outcomes → Status

### Ops — Verification Pending (Document tab)

Verification outcome options:

- Verified & Ready for Submission
- Correction Required
- Document Missing

| Outcome | Listing Status | Tab |
|---------|----------------|-----|
| Verified & Ready (all passengers) | `Submission Pending` | Submission Pending **and** Pending Payment |
| Correction Required | `Ops · Correction Required` | Verification Pending |
| Document Missing | `Ops · Document Missing` | Verification Pending |

Do **not** keep “Verified & Ready for Submission” as the ongoing listing Status after success — that label is the QC choice only.

### Docs — Submission Pending (Document QC + Form view QC)

QC outcome options:

- Verified & ready for submission
- Correction required
- Document missing / blocked

| Outcome | Listing Status | Tab |
|---------|----------------|-----|
| Verified & ready | `Form Pending` (until form is submitted) | Still Submission Pending (+ Pending Payment if payment open) |
| Correction required | `Docs · Correction Required` | Back to **Verification Pending** |
| Document missing / blocked | `Docs · Document Missing / Blocked` | Back to **Verification Pending** |

### After form is completely submitted

| Event | Listing Status | Tab |
|-------|----------------|-----|
| Form / portal submit complete | `Embassy/VFS Submission Pending` | Embassy / VFS Submission Pending |

---

## Ops vs Docs rejection (how to tell them apart)

Use the **prefix** on Status:

| Prefix | Meaning |
|--------|---------|
| `Ops · …` | Bounced by Operations (Verification Pending) |
| `Docs · …` | Bounced by Documentation (Submission Pending / Form QC) |

When Docs bounces, Ops sees the app again on **Verification Pending** with the Docs mark so they know it is a re-open, not a first-time verify.

After Ops fixes and re-submits Verified & Ready:

- Clear the Docs / Ops bounce mark
- Status → `Submission Pending`
- Tabs → Submission Pending **and** Pending Payment again

---

## End-to-end flow

```
Customer submits application
        │
        ▼
Verification Pending (Ops)
        │
        ├─ Correction / Missing ──► Status: Ops · …  (stay here)
        │
        └─ Verified & Ready (all pax)
                │
                ├──────────────────────┐
                ▼                      ▼
        Submission Pending      Pending Payment
        (Docs form QC)          (Ops or Docs)
                │                      │
                ├─ Docs bounce ────────┼──► Verification Pending
                │   Status: Docs · …   │    (Ops re-works)
                │                      │
                └─ Form completely submitted
                           │
                           ▼
                Embassy / VFS Submission Pending
```

---

## Implementation notes (code)

- Tab membership is **not always exclusive**: post-verify apps may match **two** tabs.
- Primary workspace mode (verify vs form vs payment UI) still picks one mode from priority + listing entry point.
- Shared helpers live in `src/shared/utils/applicationQueueStatus.ts`.
- Listing Status is `operationalStatus` on mock application rows (`applicationFlowData.ts`).
- Docs QC submit and form portal submit sync Status via listing helpers.
- Processing stage column remains display-only until the embassy journey is designed.

---

## Status badge colors (standard)

Shared via `getApplicationOperationalBadgeColor()`:

| Color | Statuses |
|-------|----------|
| Neutral | Draft |
| Info | Verification Pending, Under Review, Submitted, Appointment Booked |
| Primary | Submission Pending, Embassy/VFS Submission Pending |
| Secondary | Form Pending |
| Warning | Pending Documents, Pending Payment, On Hold, Correction Required, Ops · Correction Required, Docs · Correction Required |
| Error | Document Rejected, Ops · Document Missing, Docs · Document Missing / Blocked, Rejected |
| Success | Passport Ready, Completed |

---

## Mock data coverage

Seed rows in `src/pages/customer/features/applications/data/applicationFlowData.ts` cover the Status / tab scenarios:

| Scenario | Example Status | Example IDs (segment) |
|----------|----------------|------------------------|
| Verification Pending (first Ops) | `Verification Pending` | `GL-887` (marine) |
| Ops bounce — correction | `Ops · Correction Required` | `GL-891` (marine), `GL-814` (b2b) |
| Ops bounce — missing | `Ops · Document Missing` | `GL-881` (marine), `GL-821` (corporate) |
| Dual queue after Ops ready | `Submission Pending` | `GL-884` (marine), `GL-824` (corporate), `GL-817` (b2b), `GL-021` |
| Dual queue — payment done | `Submission Pending` + `paymentComplete: true` | `GL-882` (marine only on Submission Pending tab) |
| Dual queue — Docs QC ready | `Form Pending` | `GL-883` (marine), `GL-822` (corporate), `GL-023` |
| Docs bounce — correction | `Docs · Correction Required` | `GL-878` (marine), `GL-823` (corporate), `GL-818` (b2b) |
| Docs bounce — missing | `Docs · Document Missing / Blocked` | `GL-879` (marine), `GL-022` |
| Completely submitted | `Embassy/VFS Submission Pending` | `GL-872` (marine), `GL-816` (b2b), `GL-029` |

---

## Out of scope (for later)

- Processing stage labels and embassy timeline mapping
- Customer-portal copy for Ops · / Docs · statuses
- Collection / dispatch refinements
