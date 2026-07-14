import { OPERATIONAL_CASE_FORM_ASSIST_SEEDS } from '@/shared/data/mockOperationalCaseFormAssistSeeds'
import {
  applicationFormAssistService,
  type FormAssistPaymentMode,
  type FormAssistReceiptStatus,
  type FormAssistSubmissionDraft,
  type FormAssistVfsServiceChargeLine,
} from '@/shared/services/applicationFormAssistService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'

export type OperationalCaseSubmissionSource = 'form_assist' | 'seed'

export interface OperationalCaseSubmissionSnapshot {
  travelerRowId: string
  source: OperationalCaseSubmissionSource
  vfsServiceCharges: FormAssistVfsServiceChargeLine[]
  totalServiceCharges: number
  submissionDate?: string
  submissionReferenceNumber?: string
  submittedBy?: string
  vfsSubmissionDate?: string
  paymentDate?: string
  paymentMode?: FormAssistPaymentMode
  paymentReferenceNumber?: string
  amountPaid?: string
  receiptStatus?: FormAssistReceiptStatus
}

const PAYMENT_MODE_LABELS: Record<FormAssistPaymentMode, string> = {
  card: 'Card',
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
}

const RECEIPT_STATUS_LABELS: Record<FormAssistReceiptStatus, string> = {
  awaited: 'Awaited',
  received: 'Received',
  not_applicable: 'Not Applicable',
}

function normalizeServiceName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')
}

/** Matches VFS service names across submission, embassy master, and ground ops catalog. */
export function vfsServiceNamesMatch(left: string, right: string): boolean {
  const a = normalizeServiceName(left)
  const b = normalizeServiceName(right)
  if (!a || !b) return false
  if (a === b) return true

  const aliasGroups = [
    ['courier service', 'courier'],
    ['document uploading', 'document upload'],
    ['one way', 'one way courier'],
    ['two way', 'two way courier'],
  ]

  return aliasGroups.some(group => group.includes(a) && group.includes(b))
}

export function getPaymentModeLabel(mode?: FormAssistPaymentMode): string {
  if (!mode) return '—'
  return PAYMENT_MODE_LABELS[mode] ?? mode
}

export function getReceiptStatusLabel(status?: FormAssistReceiptStatus): string {
  if (!status) return '—'
  return RECEIPT_STATUS_LABELS[status] ?? status
}

function defaultTravelerRowId(passengerSequence: number): string {
  return `q${passengerSequence}`
}

export function resolveTravelerRowIdForOperationalCase(record: OperationalCase): string {
  const detail = marineApplicationAdminService.getDetail(record.applicationId)
  const rows = detail.uploadQueueRows.filter(row => row.status !== 'processing')

  if (rows.length > 0) {
    const bySequence = rows.find(row => row.sequenceNo === record.passengerSequence)
    if (bySequence) return bySequence.id

    const passport = record.passportNumber.replace(/\s/g, '').toUpperCase()
    const byPassport = rows.find(
      row => row.passportNo?.replace(/\s/g, '').toUpperCase() === passport,
    )
    if (byPassport) return byPassport.id

    const byApplicant = rows.find(row => row.gltsApplicantId === record.gltsApplicantId)
    if (byApplicant) return byApplicant.id

    const byIndex = rows[record.passengerSequence - 1]
    if (byIndex) return byIndex.id
  }

  return defaultTravelerRowId(record.passengerSequence)
}

function findSeedSnapshot(record: OperationalCase): OperationalCaseSubmissionSnapshot | null {
  const seed = OPERATIONAL_CASE_FORM_ASSIST_SEEDS.find(
    item =>
      item.applicationId === record.applicationId &&
      item.passengerSequence === record.passengerSequence,
  )
  if (!seed || seed.submission.vfsServiceCharges.length === 0) return null

  const vfsServiceCharges = seed.submission.vfsServiceCharges
  return {
    travelerRowId: defaultTravelerRowId(record.passengerSequence),
    source: 'seed',
    vfsServiceCharges,
    totalServiceCharges: vfsServiceCharges.reduce((sum, line) => sum + line.amount, 0),
    submissionDate: seed.submission.submissionDate,
    submissionReferenceNumber: seed.submission.submissionReferenceNumber,
    submittedBy: seed.submission.submittedBy,
    vfsSubmissionDate: seed.submission.vfsSubmissionDate,
    paymentDate: seed.submission.paymentDate,
    paymentMode: seed.submission.paymentMode,
    paymentReferenceNumber: seed.submission.paymentReferenceNumber,
    amountPaid: seed.submission.amountPaid,
    receiptStatus: seed.submission.receiptStatus,
  }
}

function buildSnapshotFromSubmission(
  travelerRowId: string,
  submission: FormAssistSubmissionDraft,
  source: OperationalCaseSubmissionSource,
): OperationalCaseSubmissionSnapshot | null {
  const vfsServiceCharges = submission.vfsServiceCharges ?? []
  if (vfsServiceCharges.length === 0) return null

  return {
    travelerRowId,
    source,
    vfsServiceCharges,
    totalServiceCharges: vfsServiceCharges.reduce((sum, line) => sum + line.amount, 0),
    submissionDate: submission.submissionDate,
    submissionReferenceNumber: submission.submissionReferenceNumber,
    submittedBy: submission.submittedBy,
    vfsSubmissionDate: submission.vfsSubmissionDate,
    paymentDate: submission.paymentDate,
    paymentMode: submission.paymentMode,
    paymentReferenceNumber: submission.paymentReferenceNumber,
    amountPaid: submission.amountPaid,
    receiptStatus: submission.receiptStatus,
  }
}

export function resolveOperationalCaseSubmissionSnapshot(
  record: OperationalCase,
): OperationalCaseSubmissionSnapshot | null {
  const travelerRowId = resolveTravelerRowIdForOperationalCase(record)
  const assistRecord = applicationFormAssistService.getRecord(record.applicationId, travelerRowId)
  const fromAssist = buildSnapshotFromSubmission(
    travelerRowId,
    assistRecord.submission,
    'form_assist',
  )
  if (fromAssist) return fromAssist

  return findSeedSnapshot(record)
}
