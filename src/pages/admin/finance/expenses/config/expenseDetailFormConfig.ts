import type {
  ApplicationExpenseApprovalStatus,
  ApplicationExpenseBillTo,
  ApplicationExpensePaidBy,
  ApplicationExpenseProofDocumentType,
  ApplicationExpenseServiceSource,
  ApplicationExpenseSource,
  ApplicationExpenseType,
} from '@/shared/types/applicationExpenseManagement'

export interface ExpenseServiceDefinition {
  value: ApplicationExpenseType
  label: string
  expenseSource: ApplicationExpenseSource
  defaultSource: ApplicationExpenseServiceSource
  defaultVendor: string
}

export const EXPENSE_SERVICE_OPTIONS: ExpenseServiceDefinition[] = [
  {
    value: 'visa_processing_fee',
    label: 'Visa Processing Fee',
    expenseSource: 'application_service',
    defaultSource: 'glts_service',
    defaultVendor: 'GLTS Operations',
  },
  {
    value: 'vfs_booking_service',
    label: 'VFS Appointment',
    expenseSource: 'application_service',
    defaultSource: 'vfs_service',
    defaultVendor: 'VFS Global',
  },
  {
    value: 'courier_service',
    label: 'Courier',
    expenseSource: 'vendor_service',
    defaultSource: 'courier_partner',
    defaultVendor: 'Blue Dart Logistics',
  },
  {
    value: 'travel_insurance',
    label: 'Insurance',
    expenseSource: 'insurance_related',
    defaultSource: 'insurance_vendor',
    defaultVendor: 'Travel Guard India',
  },
  {
    value: 'flight_ticket',
    label: 'Flight Ticket',
    expenseSource: 'ticket_related',
    defaultSource: 'ticket_vendor',
    defaultVendor: 'Skyline Travel Desk',
  },
  {
    value: 'ground_operation_service',
    label: 'Ground Staff Travel',
    expenseSource: 'ground_operations',
    defaultSource: 'ground_staff_service',
    defaultVendor: 'Mumbai Ground Ops Team',
  },
  {
    value: 'vendor_service',
    label: 'Vendor Documentation Support',
    expenseSource: 'vendor_service',
    defaultSource: 'vendor_service',
    defaultVendor: 'Documentation Partner',
  },
]

export const EXPENSE_SOURCE_OPTIONS: { value: ApplicationExpenseServiceSource; label: string }[] = [
  { value: 'glts_service', label: 'GLTS' },
  { value: 'vendor_service', label: 'Vendor' },
  { value: 'vfs_service', label: 'VFS' },
  { value: 'ground_staff_service', label: 'Ground Operations' },
  { value: 'insurance_vendor', label: 'Insurance Vendor' },
  { value: 'ticket_vendor', label: 'Ticket Vendor' },
  { value: 'other', label: 'Other' },
]

export const EXPENSE_VENDOR_OPTIONS = [
  'GLTS Operations',
  'VFS Global',
  'Blue Dart Logistics',
  'Travel Guard India',
  'Skyline Travel Desk',
  'Mumbai Ground Ops Team',
  'Documentation Partner',
  'Embassy Liaison Services',
  'Other Vendor',
]

export const EXPENSE_PAID_BY_OPTIONS: { value: ApplicationExpensePaidBy; label: string }[] = [
  { value: 'glts_team', label: 'GLTS Team' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'customer', label: 'Customer' },
  { value: 'ground_team', label: 'Ground Team' },
]

export const EXPENSE_BILL_TO_OPTIONS: { value: ApplicationExpenseBillTo; label: string }[] = [
  { value: 'client', label: 'Client' },
  { value: 'glts_cost', label: 'GLTS Cost' },
  { value: 'vendor_adjustment', label: 'Vendor Adjustment' },
]

export const EXPENSE_PROOF_TYPE_OPTIONS: { value: ApplicationExpenseProofDocumentType; label: string }[] = [
  { value: 'bill', label: 'Bill' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'supporting_document', label: 'Supporting Document' },
]

export function getExpenseServiceDefinition(service: ApplicationExpenseType): ExpenseServiceDefinition | undefined {
  return EXPENSE_SERVICE_OPTIONS.find(option => option.value === service)
}

export function getDisplaySourceLabel(source: ApplicationExpenseServiceSource): string {
  return EXPENSE_SOURCE_OPTIONS.find(option => option.value === source)?.label ?? source
}

export function getPaidByLabel(value?: ApplicationExpensePaidBy): string {
  return EXPENSE_PAID_BY_OPTIONS.find(option => option.value === value)?.label ?? '—'
}

export function getBillToLabel(value?: ApplicationExpenseBillTo): string {
  if (!value || value === 'client') return 'Client'
  return EXPENSE_BILL_TO_OPTIONS.find(option => option.value === value)?.label ?? 'Client'
}

export function getProofDocumentTypeLabel(value?: ApplicationExpenseProofDocumentType): string {
  return EXPENSE_PROOF_TYPE_OPTIONS.find(option => option.value === value)?.label ?? 'Document'
}

export function getSimpleExpenseStatusLabel(status: ApplicationExpenseApprovalStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'pending_approval':
    case 'clarification_required':
      return 'Pending Approval'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    default:
      return status
  }
}

export function computeExpenseGstAmount(
  amount: number,
  gstApplicable: boolean,
  gstPercent: number,
): number {
  if (!gstApplicable || gstPercent <= 0 || amount <= 0) return 0
  return Math.max(0, Math.round(amount * gstPercent) / 100)
}

export function computeExpenseTotalAmount(
  amount: number,
  gstApplicable: boolean,
  gstPercent: number,
): number {
  const gst = computeExpenseGstAmount(amount, gstApplicable, gstPercent)
  return Math.max(0, Math.round((amount + gst) * 100) / 100)
}
