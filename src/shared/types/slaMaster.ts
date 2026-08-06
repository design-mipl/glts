import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

/** Top-level admin nav modules that own SLA policies. */
export type SlaModule =
  | 'application_management'
  | 'assignment_priority'
  | 'finance'
  | 'ground_operations'

/**
 * Submodule keys under each module (nav children).
 * Application + Assignment share marine/corporate/retail/b2b keys;
 * uniqueness is always (module, submodule).
 */
export type SlaSubmodule =
  | 'marine'
  | 'corporate'
  | 'retail'
  | 'b2b'
  | 'expenses'
  | 'invoices'
  | 'vendor_billing'
  | 'fund_allocation'
  | 'case_handling'
  | 'logistics'
  | 'funds'

/** @deprecated Use SlaModule */
export type SlaDomain = SlaModule
/** @deprecated Use SlaSubmodule — kept for older application listing helpers */
export type SlaSegment = Extract<SlaSubmodule, 'marine' | 'corporate' | 'retail' | 'b2b'>

export type SlaOpsStage =
  | 'draft'
  | 'verification_pending'
  | 'online_submission_pending'
  | 'pending_payment'
  | 'vfs_submission_pending'
  | 'collection_pending'
  | 'collected'
  | 'dispatched'

export type SlaAssignmentStage =
  | 'pending_assignment'
  | 'assigned'
  | 'in_progress'
  | 'carry_forward'
  | 'completed'

export type SlaInvoiceStage =
  | 'invoice_draft'
  | 'invoice_submitted'
  | 'invoice_shared'
  | 'invoice_paid'
  | 'invoice_overdue'

export type SlaFundAllocationStage =
  | 'fund_pending_allocation'
  | 'fund_allocated'
  | 'fund_claim_sheets'

export type SlaExpenseStage = 'expense_draft' | 'expense_submitted' | 'expense_approved' | 'expense_paid'

export type SlaVendorBillingStage =
  | 'vendor_awaiting_invoice'
  | 'vendor_billed'
  | 'vendor_settled'

export type SlaOperationsDeskStage =
  | 'desk_pending'
  | 'desk_document_submitted'
  | 'desk_moved_next_day'
  | 'desk_collected'
  | 'desk_dispatched'
  | 'desk_completed'

export type SlaLogisticsStage =
  | 'logistics_document_submitted'
  | 'logistics_collected'
  | 'logistics_dispatched'
  | 'logistics_completed'

export type SlaFundUtilizationStage =
  | 'funds_pending_settlement'
  | 'funds_settled'
  | 'funds_withdrawal'

export type SlaStageKey =
  | SlaOpsStage
  | SlaAssignmentStage
  | SlaInvoiceStage
  | SlaFundAllocationStage
  | SlaExpenseStage
  | SlaVendorBillingStage
  | SlaOperationsDeskStage
  | SlaLogisticsStage
  | SlaFundUtilizationStage

export type SlaBulkBandKey = '0_10' | '11_20' | '21_plus'

/** Application management listing tabs (excludes "All applications"). */
export const SLA_OPS_STAGES: readonly SlaOpsStage[] = [
  'draft',
  'verification_pending',
  'online_submission_pending',
  'pending_payment',
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
] as const

/** Assignment & Priority listing tabs (excludes "All"). */
export const SLA_ASSIGNMENT_STAGES: readonly SlaAssignmentStage[] = [
  'pending_assignment',
  'assigned',
  'in_progress',
  'carry_forward',
  'completed',
] as const

export const SLA_STAGE_LABELS: Record<SlaStageKey, string> = {
  draft: 'Draft',
  verification_pending: 'Verification Pending',
  online_submission_pending: 'Submission Pending',
  pending_payment: 'Pending Payment',
  vfs_submission_pending: 'Embassy/VFS Submission Pending',
  collection_pending: 'Collection Pending',
  collected: 'Collected',
  dispatched: 'Dispatched',
  pending_assignment: 'Pending assignment',
  assigned: 'Assigned',
  in_progress: 'In progress',
  carry_forward: 'Carry forward',
  completed: 'Completed',
  invoice_draft: 'Draft',
  invoice_submitted: 'Invoiced',
  invoice_shared: 'Shared',
  invoice_paid: 'Paid',
  invoice_overdue: 'Overdue',
  fund_pending_allocation: 'Pending allocation',
  fund_allocated: 'Allocated',
  fund_claim_sheets: 'Claim sheets',
  expense_draft: 'Draft',
  expense_submitted: 'Submitted',
  expense_approved: 'Approved',
  expense_paid: 'Paid',
  vendor_awaiting_invoice: 'Awaiting invoice',
  vendor_billed: 'Billed',
  vendor_settled: 'Settled',
  desk_pending: 'Pending',
  desk_document_submitted: 'Documents submitted',
  desk_moved_next_day: 'Moved to Next day',
  desk_collected: 'Collected',
  desk_dispatched: 'Dispatched',
  desk_completed: 'Completed',
  logistics_document_submitted: 'Documents submitted',
  logistics_collected: 'Collected',
  logistics_dispatched: 'In transit',
  logistics_completed: 'Completed',
  funds_pending_settlement: 'Pending settlement',
  funds_settled: 'Settled',
  funds_withdrawal: 'Withdrawal history',
}

/** @deprecated Prefer SLA_STAGE_LABELS */
export const SLA_OPS_STAGE_LABELS: Record<SlaOpsStage, string> = {
  draft: SLA_STAGE_LABELS.draft,
  verification_pending: SLA_STAGE_LABELS.verification_pending,
  online_submission_pending: SLA_STAGE_LABELS.online_submission_pending,
  pending_payment: SLA_STAGE_LABELS.pending_payment,
  vfs_submission_pending: SLA_STAGE_LABELS.vfs_submission_pending,
  collection_pending: SLA_STAGE_LABELS.collection_pending,
  collected: SLA_STAGE_LABELS.collected,
  dispatched: SLA_STAGE_LABELS.dispatched,
}

export interface SlaSubmoduleOption {
  value: SlaSubmodule
  label: string
}

export interface SlaModuleOption {
  value: SlaModule
  label: string
  submodules: readonly SlaSubmoduleOption[]
}

/** Mirrors admin nav groups + children used for operational SLA. */
export const SLA_MODULE_TREE: readonly SlaModuleOption[] = [
  {
    value: 'application_management',
    label: 'Application management',
    submodules: [
      { value: 'marine', label: 'Marine applications' },
      { value: 'corporate', label: 'Corporate applications' },
      { value: 'retail', label: 'Retail applications' },
      { value: 'b2b', label: 'B2B agents applications' },
    ],
  },
  {
    value: 'assignment_priority',
    label: 'Assignment & Priority Management',
    submodules: [
      { value: 'marine', label: 'Marine assignment' },
      { value: 'corporate', label: 'Corporate assignment' },
      { value: 'retail', label: 'Retail assignment' },
      { value: 'b2b', label: 'B2B assignment' },
    ],
  },
  {
    value: 'finance',
    label: 'Finance Operations',
    submodules: [
      { value: 'expenses', label: 'Expense management' },
      { value: 'invoices', label: 'Billing & invoice' },
      { value: 'vendor_billing', label: 'Vendor billing' },
      { value: 'fund_allocation', label: 'Fund allocation' },
    ],
  },
  {
    value: 'ground_operations',
    label: 'Ground operations',
    submodules: [
      { value: 'case_handling', label: 'Operations Desk' },
      { value: 'logistics', label: 'Tracking & logistics' },
      { value: 'funds', label: 'Fund utilization' },
    ],
  },
] as const

export const SLA_DOMAIN_OPTIONS = SLA_MODULE_TREE.map(({ value, label }) => ({ value, label }))

export const SLA_DOMAIN_LABELS: Record<SlaModule, string> = {
  application_management: 'Application management',
  assignment_priority: 'Assignment & Priority Management',
  finance: 'Finance Operations',
  ground_operations: 'Ground operations',
}

export const SLA_SEGMENT_OPTIONS: { value: SlaSegment; label: string }[] = [
  { value: 'marine', label: 'Marine' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retail', label: 'Retail' },
  { value: 'b2b', label: 'B2B' },
]

export const SLA_BULK_BANDS: readonly SlaBulkBandKey[] = ['0_10', '11_20', '21_plus'] as const

export const SLA_BULK_BAND_LABELS: Record<SlaBulkBandKey, string> = {
  '0_10': '0–10 applicants',
  '11_20': '11–20 applicants',
  '21_plus': '21+ applicants',
}

const STAGES_BY_SUBMODULE: Partial<Record<SlaSubmodule, readonly SlaStageKey[]>> = {
  expenses: ['expense_draft', 'expense_submitted', 'expense_approved', 'expense_paid'],
  invoices: [
    'invoice_draft',
    'invoice_submitted',
    'invoice_shared',
    'invoice_paid',
    'invoice_overdue',
  ],
  vendor_billing: ['vendor_awaiting_invoice', 'vendor_billed', 'vendor_settled'],
  fund_allocation: ['fund_pending_allocation', 'fund_allocated', 'fund_claim_sheets'],
  case_handling: [
    'desk_pending',
    'desk_document_submitted',
    'desk_moved_next_day',
    'desk_collected',
    'desk_dispatched',
    'desk_completed',
  ],
  logistics: [
    'logistics_document_submitted',
    'logistics_collected',
    'logistics_dispatched',
    'logistics_completed',
  ],
  funds: ['funds_pending_settlement', 'funds_settled', 'funds_withdrawal'],
}

export function getSlaModuleOption(module: SlaModule): SlaModuleOption {
  return SLA_MODULE_TREE.find((item) => item.value === module) ?? SLA_MODULE_TREE[0]
}

export function getSlaSubmoduleOptions(module: SlaModule): readonly SlaSubmoduleOption[] {
  return getSlaModuleOption(module).submodules
}

export function getSlaSubmoduleLabel(module: SlaModule, submodule: SlaSubmodule): string {
  return (
    getSlaSubmoduleOptions(module).find((item) => item.value === submodule)?.label ?? submodule
  )
}

export function getDefaultSlaSubmodule(module: SlaModule): SlaSubmodule {
  return getSlaSubmoduleOptions(module)[0]?.value ?? 'marine'
}

export function getSlaStagesForDomain(domain: SlaModule): readonly SlaStageKey[] {
  if (domain === 'application_management') return SLA_OPS_STAGES
  if (domain === 'assignment_priority') return SLA_ASSIGNMENT_STAGES
  return STAGES_BY_SUBMODULE.invoices ?? SLA_OPS_STAGES
}

/**
 * Listing-tab stages for the selected module + submodule.
 * Application / Assignment share one tab set per module; Finance / Ground vary by submodule.
 */
export function getSlaStagesForScope(
  module: SlaModule,
  submodule: SlaSubmodule,
): readonly SlaStageKey[] {
  if (module === 'application_management') return SLA_OPS_STAGES
  if (module === 'assignment_priority') return SLA_ASSIGNMENT_STAGES
  const bySubmodule = STAGES_BY_SUBMODULE[submodule]
  if (bySubmodule) return bySubmodule
  return getSlaStagesForDomain(module)
}

export type SlaStageHours = Partial<Record<SlaStageKey, number>>

export interface SlaHoursPlan {
  e2eHours: number
  stages: SlaStageHours
}

export interface SlaMaster extends MasterAuditFields {
  id: string
  /** Admin nav module */
  domain: SlaModule
  /** Admin nav submodule under that module */
  segment: SlaSubmodule
  name: string
  status: MasterRecordStatus
  single: SlaHoursPlan
  bulkBands: Record<SlaBulkBandKey, SlaHoursPlan>
}

export interface SlaMasterFormData {
  domain: SlaModule
  segment: SlaSubmodule
  name: string
  status: MasterRecordStatus
  single: SlaHoursPlan
  bulkBands: Record<SlaBulkBandKey, SlaHoursPlan>
}

export interface SlaMasterListFilters {
  status?: MasterRecordStatus | 'all'
  segment?: SlaSubmodule | 'all'
  domain?: SlaModule | 'all'
}

export function emptySlaStageHours(
  module: SlaModule = 'application_management',
  submodule?: SlaSubmodule,
): SlaStageHours {
  const resolvedSubmodule = submodule ?? getDefaultSlaSubmodule(module)
  const stages: SlaStageHours = {}
  for (const stage of getSlaStagesForScope(module, resolvedSubmodule)) {
    stages[stage] = 0
  }
  return stages
}

export function emptySlaHoursPlan(
  module: SlaModule = 'application_management',
  submodule?: SlaSubmodule,
): SlaHoursPlan {
  return {
    e2eHours: 0,
    stages: emptySlaStageHours(module, submodule),
  }
}

export function sumSlaStageHours(
  stages: SlaStageHours,
  module: SlaModule = 'application_management',
  submodule?: SlaSubmodule,
): number {
  const resolvedSubmodule = submodule ?? getDefaultSlaSubmodule(module)
  return getSlaStagesForScope(module, resolvedSubmodule).reduce(
    (total, stage) => total + (Number(stages[stage]) || 0),
    0,
  )
}

export function resolveSlaBulkBand(totalApplicants: number): SlaBulkBandKey {
  if (totalApplicants <= 10) return '0_10'
  if (totalApplicants <= 20) return '11_20'
  return '21_plus'
}
