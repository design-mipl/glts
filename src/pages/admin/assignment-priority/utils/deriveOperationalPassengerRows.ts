import {
  mockBulkBatches,
  mockSingleApplications,
  mockUploadQueue,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { resolveApplicationCreatorLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import { getMockInvoices } from '@/shared/data/mockInvoices'
import type {
  AssignmentPriority,
  OperationalPassengerOverlay,
  OperationalPassengerRow,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'
import type { InvoiceStatus, PaymentStatus } from '@/shared/types/invoice'

function isSubmitted(app: SingleApplicationRow | BulkBatchRow): boolean {
  return app.operationalStatus !== 'Draft' && Boolean(app.submissionDate?.trim())
}

function buildPassengerId(applicationId: string, applicantId: string): string {
  return `${applicationId}:${applicantId}`
}

function defaultApplicantId(applicationId: string): string {
  return `${applicationId}-APL-001`
}

function invoiceContextForApplication(applicationId: string): {
  invoiceStatus: InvoiceStatus | ''
  paymentStatus: PaymentStatus | ''
} {
  const invoice = getMockInvoices().find(
    inv =>
      inv.gltsReferences.includes(applicationId) ||
      inv.lineItems.some(li => li.applicationId === applicationId || li.batchId === applicationId),
  )
  if (!invoice) return { invoiceStatus: '', paymentStatus: '' }
  return {
    invoiceStatus: invoice.invoiceStatus,
    paymentStatus: invoice.paymentStatus,
  }
}

function localIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function defaultOverlay(
  priority: AssignmentPriority = 'Medium',
  passengerStatus: PassengerOperationalStatus = 'Pending Assignment',
): OperationalPassengerOverlay {
  const now = new Date()
  const operationalDate = localIsoDate(now)
  const slaDue = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
  return {
    priority,
    assignedTeam: '',
    assignedUser: '',
    operationalDate,
    passengerStatus,
    carryForward: false,
    escalated: false,
    slaDueAt: slaDue,
    operationalRemarks: '',
    assignmentHistory: [],
    timeline: [],
    attachmentNames: [],
    lastUpdated: now.toISOString(),
  }
}

function mergeOverlay(
  base: Omit<OperationalPassengerRow, keyof OperationalPassengerOverlay>,
  overlay?: Partial<OperationalPassengerOverlay>,
): OperationalPassengerRow {
  const defaults = defaultOverlay()
  const merged = { ...defaults, ...overlay }
  return { ...base, ...merged }
}

function baseFromApplication(
  app: SingleApplicationRow | BulkBatchRow,
  applicantId: string,
  sequenceNo: number,
  passengerName: string,
  passportNo: string,
): Omit<OperationalPassengerRow, keyof OperationalPassengerOverlay> {
  const invoice = invoiceContextForApplication(app.id)
  return {
    id: buildPassengerId(app.id, applicantId),
    gltsApplicantId: applicantId,
    gltsApplicationId: app.id,
    sequenceNo,
    passengerName,
    passportNo,
    companyName: resolveApplicationCompanyName(app),
    bookerName: resolveApplicationCreatorLabel(app.createdByEmail),
    country: app.country,
    countryFlag: app.countryFlag,
    visaType: app.visaType,
    jurisdiction: app.jurisdiction ?? '—',
    travelDate: app.travelDate,
    submissionDate: app.submissionDate,
    submissionStatus: app.operationalStatus,
    customerSegment: app.customerSegment,
    recordType: app.recordType,
    invoiceStatus: invoice.invoiceStatus,
    paymentStatus: invoice.paymentStatus,
    createdByEmail: app.createdByEmail,
    createdByRole: app.createdByRole,
    processingStage: app.processingStage,
    processingStageDates: app.processingStageDates,
  }
}

function deriveFromSingle(
  app: SingleApplicationRow,
  overlays: Map<string, OperationalPassengerOverlay>,
): OperationalPassengerRow {
  const applicantId = defaultApplicantId(app.id)
  const id = buildPassengerId(app.id, applicantId)
  const base = baseFromApplication(app, applicantId, 1, app.applicantName, app.passportNumber)
  return mergeOverlay(base, overlays.get(id))
}

function deriveFromBulk(
  app: BulkBatchRow,
  overlays: Map<string, OperationalPassengerOverlay>,
): OperationalPassengerRow[] {
  const queueRows = mockUploadQueue.filter(q => q.gltsApplicationId === app.id)
  if (queueRows.length) {
    return queueRows
      .filter(q => q.status !== 'processing' && q.travelerName !== '—')
      .map(q => {
        const id = buildPassengerId(app.id, q.gltsApplicantId)
        const base = baseFromApplication(
          app,
          q.gltsApplicantId,
          q.sequenceNo,
          q.travelerName,
          q.passportNo,
        )
        return mergeOverlay(base, overlays.get(id))
      })
  }

  const rows: OperationalPassengerRow[] = []
  for (let i = 0; i < app.totalApplicants; i += 1) {
    const applicantId = `${app.id}-APL-${String(i + 1).padStart(3, '0')}`
    const name =
      i === 0 && app.primaryApplicantName
        ? app.primaryApplicantName
        : `Traveler ${i + 1}`
    const id = buildPassengerId(app.id, applicantId)
    const base = baseFromApplication(app, applicantId, i + 1, name, '—')
    rows.push(mergeOverlay(base, overlays.get(id)))
  }
  return rows
}

export function deriveOperationalPassengerRows(
  segment: ApplicationCustomerSegment,
  overlays: Map<string, OperationalPassengerOverlay> = new Map(),
): OperationalPassengerRow[] {
  const rows: OperationalPassengerRow[] = []

  for (const app of mockSingleApplications) {
    if (app.customerSegment !== segment || !isSubmitted(app)) continue
    rows.push(deriveFromSingle(app, overlays))
  }

  for (const app of mockBulkBatches) {
    if (app.customerSegment !== segment || !isSubmitted(app)) continue
    rows.push(...deriveFromBulk(app, overlays))
  }

  return rows.sort((a, b) => {
    const priorityOrder: Record<AssignmentPriority, number> = {
      Urgent: 0,
      High: 1,
      Medium: 2,
      Low: 3,
    }
    const p = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (p !== 0) return p
    return a.operationalDate.localeCompare(b.operationalDate)
  })
}

export { defaultOverlay, buildPassengerId }
