import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { getCurrentUser } from '@/shared/services/authService'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'
import type {
  ReconciliationFilters,
  ReconciliationItem,
  ReconciliationPeriodPreset,
  ReconciliationStatus,
  ReconciliationTab,
  RejectReconciliationInput,
  SubmitReconciliationInput,
} from '@/shared/types/reconciliation'

const STORAGE_KEY = 'glts:finance-reconciliation-submissions'

interface ReconciliationSubmission {
  referenceNumber?: string
  status: ReconciliationStatus
  reconciledAt: string
  reconciledBy: string
  rejectionReason?: string
}

type SubmissionStore = Record<string, ReconciliationSubmission>

interface ApplicationEnrichment {
  companyName: string
  visaCountry: string
  consultant: string
  passengerNames: string[]
}

/** Session cache — rebuild only after mutations or explicit invalidate. */
let projectedItemsCache: ReconciliationItem[] | null = null
let upstreamSynced = false

function invalidateProjectedCache() {
  projectedItemsCache = null
}

const TICKET_TYPES = new Set([
  'flight_ticket',
  'train_ticket',
  'bus_ticket',
  'marine_ticket',
])

const INSURANCE_TYPES = new Set(['travel_insurance', 'insurance'])

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function parseLocalDateString(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return startOfDay(new Date(isoDate))
  return startOfDay(new Date(year, month - 1, day))
}

function toDateKey(value?: string): string {
  if (!value?.trim()) return ''
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function resolveReconciliationDateRange(
  preset: ReconciliationPeriodPreset,
  from?: string,
  to?: string,
): { from: Date; to: Date } {
  const today = startOfDay(new Date())

  switch (preset) {
    case 'yesterday': {
      const y = addDays(today, -1)
      return { from: y, to: endOfDay(y) }
    }
    case 'last_7_days':
      return { from: addDays(today, -6), to: endOfDay(today) }
    case 'last_30_days':
      return { from: addDays(today, -29), to: endOfDay(today) }
    case 'mtd':
      return { from: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)), to: endOfDay(today) }
    case 'qtd': {
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3
      return {
        from: startOfDay(new Date(today.getFullYear(), quarterStartMonth, 1)),
        to: endOfDay(today),
      }
    }
    case 'ytd':
      return { from: startOfDay(new Date(today.getFullYear(), 0, 1)), to: endOfDay(today) }
    case 'custom': {
      const customFrom = from ? parseLocalDateString(from) : today
      const customTo = to ? endOfDay(parseLocalDateString(to)) : endOfDay(today)
      return { from: customFrom, to: customTo }
    }
    case 'today':
    default:
      return { from: today, to: endOfDay(today) }
  }
}

function readSubmissions(): SubmissionStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as SubmissionStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeSubmissions(store: SubmissionStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore mock storage failures
  }
}

function computeMarkup(costAmount: number, totalAmount: number): number {
  const cost = Number.isFinite(costAmount) ? Math.max(0, costAmount) : 0
  const total = Number.isFinite(totalAmount) ? Math.max(0, totalAmount) : 0
  return Math.max(0, Math.round((total - cost) * 100) / 100)
}

function hashSeed(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function demoPolicyNumber(id: string): string {
  const n = hashSeed(id) % 900000 + 100000
  return `POL-${n}`
}

function demoTrackingNumber(id: string): string {
  const n = hashSeed(id) % 900000000 + 100000000
  return `AWB${n}`
}

function demoRoute(id: string, kind: 'ticket' | 'courier'): { from: string; to: string } {
  const routes =
    kind === 'ticket'
      ? [
          { from: 'Mumbai (BOM)', to: 'Dubai (DXB)' },
          { from: 'Delhi (DEL)', to: 'Singapore (SIN)' },
          { from: 'Chennai (MAA)', to: 'Doha (DOH)' },
        ]
      : [
          { from: 'GLTS Mumbai office', to: 'VFS Mumbai' },
          { from: 'Applicant residence', to: 'GLTS documentation desk' },
          { from: 'Embassy collection', to: 'Client HQ' },
        ]
  return routes[hashSeed(id) % routes.length]
}

function demoCardUsed(id: string): string {
  const cards = ['HDFC **** 4412', 'ICICI **** 8821', 'Axis **** 1190']
  return cards[hashSeed(id) % cards.length]
}

function expenseTab(expense: ApplicationExpenseRecord): ReconciliationTab | null {
  if (INSURANCE_TYPES.has(expense.expenseType)) return 'insurance'
  if (TICKET_TYPES.has(expense.expenseType)) return 'ticket'
  if (expense.expenseType === 'courier_service') return 'courier'
  return null
}

function resolvePassengerName(expense: ApplicationExpenseRecord, passengerNames: string[]): string {
  if (expense.passengerMapping.displayLabel && expense.passengerMapping.scope !== 'application') {
    if (expense.passengerMapping.scope === 'passenger' || expense.passengerMapping.scope === 'multiple_passengers') {
      const ids = expense.passengerMapping.passengerIds
      if (ids?.length) {
        if (expense.passengerMapping.displayLabel !== 'Application') {
          return expense.passengerMapping.displayLabel
        }
        const matched = passengerNames.filter((_, index) => Boolean(ids[index] || ids[0]))
        if (matched.length) return matched.join(', ')
      }
      if (expense.passengerMapping.displayLabel) return expense.passengerMapping.displayLabel
    }
    return expense.passengerMapping.displayLabel
  }
  if (passengerNames.length === 1) return passengerNames[0]
  if (passengerNames.length > 1) return `${passengerNames[0]} +${passengerNames.length - 1}`
  return expense.passengerMapping.displayLabel || '—'
}

function buildExpenseItem(
  expense: ApplicationExpenseRecord,
  tab: ReconciliationTab,
  submissions: SubmissionStore,
  enrichment: ApplicationEnrichment | undefined,
): ReconciliationItem {
  const cost = typeof expense.costAmount === 'number' ? expense.costAmount : 0
  const total = expense.amount
  const markup = computeMarkup(cost, total)
  const bookingDate = toDateKey(expense.expenseDate) || toDateKey(expense.createdDate)
  const creationDate = toDateKey(expense.createdDate) || bookingDate
  const route =
    tab === 'ticket'
      ? demoRoute(expense.id, 'ticket')
      : tab === 'courier'
        ? demoRoute(expense.id, 'courier')
        : { from: '', to: '' }

  const itemId = `exp:${expense.id}:${tab}`
  const submission = submissions[itemId]

  const policyNumber = tab === 'insurance' ? demoPolicyNumber(expense.id) : ''
  const trackingNumber = tab === 'courier' ? demoTrackingNumber(expense.id) : ''
  const referenceNumber = submission?.referenceNumber || ''
  const passengerNames = enrichment?.passengerNames ?? []

  return {
    id: itemId,
    sourceKind: 'expense',
    sourceId: expense.id,
    tab,
    status: submission?.status ?? 'pending',
    refNo: expense.applicationId,
    gltsCreationDate: creationDate,
    passengerName: resolvePassengerName(expense, passengerNames),
    client: enrichment?.companyName ?? '—',
    bookedBy: expense.createdBy || expense.paidByUser || '—',
    consultant: enrichment?.consultant ?? '—',
    visaCountry: enrichment?.visaCountry ?? '—',
    vendor: expense.vendorStaffPartner ?? expense.serviceSourceLabel ?? '—',
    bookingDate,
    cost,
    markup,
    total,
    policyNumber,
    vendorInvoiceNumber: expense.vendorInvoiceNumber ?? '',
    locationFrom: route.from,
    locationTo: route.to,
    trackingNumber,
    courierBookedBy: expense.paidByUser || expense.createdBy || '—',
    chargesName: expense.expenseTypeLabel || expense.expenseName,
    paymentDate: bookingDate,
    paymentMode: expense.paymentMode ?? '',
    cardUsed: expense.paymentMode === 'card' || expense.paymentMode === 'card_cash' ? demoCardUsed(expense.id) : '',
    amountInr: cost > 0 ? cost : total,
    foreignCurrencyAmount: expense.paymentMode === 'card' ? Math.round(cost * 0.011 * 100) / 100 : 0,
    staffName: expense.paidByUser || expense.createdBy || '—',
    acPersonName: submission?.reconciledBy ?? '',
    acEntryNo: '',
    claimNumber: '',
    claimTeam: '',
    claimCasesCount: 0,
    claimGrandTotal: 0,
    claimReviewedAt: '',
    referenceNumber,
    reconciledAt: submission?.reconciledAt,
    reconciledBy: submission?.reconciledBy,
    rejectionReason: submission?.rejectionReason,
  }
}

function buildClaimSheetItems(sheet: GroundOpsClaimSheet, submissions: SubmissionStore): ReconciliationItem[] {
  const reviewedAt = toDateKey(sheet.reviewedAt) || toDateKey(sheet.generatedAt)
  if (sheet.cases.length === 0) {
    const itemId = `claim:${sheet.id}:summary`
    const submission = submissions[itemId]
    return [
      {
        id: itemId,
        sourceKind: 'claim_sheet',
        sourceId: sheet.id,
        tab: 'approved_claim_sheet',
        status: submission?.status ?? 'pending',
        refNo: sheet.claimNumber,
        gltsCreationDate: toDateKey(sheet.generatedAt),
        passengerName: '—',
        client: '—',
        bookedBy: sheet.generatedBy,
        consultant: '—',
        visaCountry: '—',
        vendor: '—',
        bookingDate: reviewedAt,
        cost: sheet.grandTotal,
        markup: 0,
        total: sheet.grandTotal,
        policyNumber: '',
        vendorInvoiceNumber: '',
        locationFrom: '',
        locationTo: '',
        trackingNumber: '',
        courierBookedBy: '',
        chargesName: 'Approved claim sheet',
        paymentDate: reviewedAt,
        paymentMode: '',
        cardUsed: '',
        amountInr: sheet.grandTotal,
        foreignCurrencyAmount: 0,
        staffName: sheet.generatedBy,
        acPersonName: submission?.reconciledBy ?? '',
        acEntryNo: '',
        claimNumber: sheet.claimNumber,
        claimTeam: sheet.team,
        claimCasesCount: 0,
        claimGrandTotal: sheet.grandTotal,
        claimReviewedAt: reviewedAt,
        referenceNumber: submission?.referenceNumber ?? '',
        reconciledAt: submission?.reconciledAt,
        reconciledBy: submission?.reconciledBy,
        rejectionReason: submission?.rejectionReason ?? sheet.rejectionReason,
      },
    ]
  }

  return sheet.cases.map(caseRow => {
    const itemId = `claim:${sheet.id}:${caseRow.caseId}`
    const submission = submissions[itemId]
    return {
      id: itemId,
      sourceKind: 'claim_sheet' as const,
      sourceId: sheet.id,
      tab: 'approved_claim_sheet' as const,
      status: submission?.status ?? ('pending' as const),
      refNo: caseRow.applicationId || sheet.claimNumber,
      gltsCreationDate: toDateKey(sheet.generatedAt),
      passengerName: caseRow.passengerName,
      client: caseRow.companyName,
      bookedBy: sheet.generatedBy,
      consultant: '—',
      visaCountry: caseRow.country,
      vendor: '—',
      bookingDate: reviewedAt,
      cost: caseRow.caseExpenseTotal,
      markup: 0,
      total: caseRow.caseExpenseTotal,
      policyNumber: '',
      vendorInvoiceNumber: '',
      locationFrom: '',
      locationTo: '',
      trackingNumber: '',
      courierBookedBy: '',
      chargesName: 'Approved claim sheet',
      paymentDate: reviewedAt,
      paymentMode: '',
      cardUsed: '',
      amountInr: caseRow.caseExpenseTotal,
      foreignCurrencyAmount: 0,
      staffName: sheet.generatedBy,
      acPersonName: submission?.reconciledBy ?? '',
      acEntryNo: '',
      claimNumber: sheet.claimNumber,
      claimTeam: sheet.team,
      claimCasesCount: sheet.cases.length,
      claimGrandTotal: sheet.grandTotal,
      claimReviewedAt: reviewedAt,
      referenceNumber: submission?.referenceNumber ?? '',
      reconciledAt: submission?.reconciledAt,
      reconciledBy: submission?.reconciledBy,
      rejectionReason: submission?.rejectionReason ?? sheet.rejectionReason,
    }
  })
}

function inPeriod(dateKey: string, range: { from: Date; to: Date }): boolean {
  if (!dateKey) return false
  const rowDate = parseLocalDateString(dateKey)
  return rowDate >= range.from && rowDate <= range.to
}

function ensureUpstreamSynced() {
  if (upstreamSynced) return
  applicationExpenseManagementService.syncAllSubmitted()
  upstreamSynced = true
}

function listProjectedItems(): ReconciliationItem[] {
  if (projectedItemsCache) return projectedItemsCache

  ensureUpstreamSynced()
  const submissions = readSubmissions()

  const allExpenseIds = new Set<string>()
  // Only marine currently returns listing rows; keep the loop for future segments.
  const items: ReconciliationItem[] = []

  for (const segment of ['marine', 'retail', 'corporate', 'b2bAgents'] as const) {
    const apps = applicationExpenseManagementService.listApplications(segment)
    for (const app of apps) {
      const detail = applicationExpenseManagementService.getApplicationDetail(app.applicationId)
      if (!detail) continue

      const enrichment: ApplicationEnrichment = {
        companyName: detail.companyName,
        visaCountry: detail.visaCountry,
        consultant: detail.assignedUser ?? detail.assignedTeam ?? '—',
        passengerNames: detail.passengers.map(p => p.passengerName),
      }

      for (const expense of detail.expenses) {
        if (allExpenseIds.has(expense.id)) continue
        allExpenseIds.add(expense.id)

        const typedTab = expenseTab(expense)
        if (typedTab) {
          items.push(buildExpenseItem(expense, typedTab, submissions, enrichment))
        }
        items.push(buildExpenseItem(expense, 'mode_of_payment', submissions, enrichment))
      }
    }
  }

  for (const sheet of groundOpsClaimSheetService.list()) {
    if (sheet.status !== 'approved' && sheet.status !== 'settled') continue
    items.push(...buildClaimSheetItems(sheet, submissions))
  }

  projectedItemsCache = items
  return items
}

export const reconciliationService = {
  list(tab: ReconciliationTab, filters: ReconciliationFilters = { period: 'today' }): ReconciliationItem[] {
    const range = resolveReconciliationDateRange(filters.period, filters.customFrom, filters.customTo)
    return listProjectedItems()
      .filter(item => item.tab === tab)
      .filter(item => {
        const dateKey =
          tab === 'approved_claim_sheet'
            ? item.claimReviewedAt || item.gltsCreationDate
            : tab === 'mode_of_payment'
              ? item.paymentDate || item.gltsCreationDate
              : item.bookingDate || item.gltsCreationDate
        return inPeriod(dateKey, range)
      })
      .filter(item => {
        if (tab === 'mode_of_payment' && filters.paymentMode) {
          return item.paymentMode === filters.paymentMode
        }
        return true
      })
      .filter(item => {
        if (!filters.status) return true
        return item.status === filters.status
      })
      .sort((a, b) => {
        const aDate = a.bookingDate || a.gltsCreationDate
        const bDate = b.bookingDate || b.gltsCreationDate
        return bDate.localeCompare(aDate)
      })
  },

  getById(id: string): ReconciliationItem | undefined {
    return listProjectedItems().find(item => item.id === id)
  },

  submitReference(input: SubmitReconciliationInput): { ok: true; item: ReconciliationItem } | { ok: false; error: string } {
    const existing = this.getById(input.id)
    if (!existing) return { ok: false, error: 'Reconciliation item not found.' }
    if (existing.status === 'submitted') {
      return { ok: false, error: 'This record is already reconciled.' }
    }
    if (existing.status === 'rejected') {
      return { ok: false, error: 'This record was rejected and cannot be reconciled.' }
    }

    const referenceNumber = input.referenceNumber.trim()
    if (!referenceNumber) return { ok: false, error: 'Book entry number is required.' }

    const user = getCurrentUser()
    const reconciledBy = user?.name?.trim() || 'Accounts user'
    const reconciledAt = new Date().toISOString()
    const store = readSubmissions()

    store[input.id] = {
      referenceNumber,
      status: 'submitted',
      reconciledAt,
      reconciledBy,
    }
    writeSubmissions(store)
    invalidateProjectedCache()

    const updated = this.getById(input.id)
    if (!updated) return { ok: false, error: 'Could not refresh reconciliation item.' }
    return { ok: true, item: updated }
  },

  submitMany(
    ids: string[],
    referenceNumber: string,
  ): { ok: true; submitted: number } | { ok: false; error: string } {
    const bookEntry = referenceNumber.trim()
    if (!bookEntry) return { ok: false, error: 'Book entry number is required.' }
    if (ids.length === 0) return { ok: false, error: 'Select at least one pending record.' }

    const user = getCurrentUser()
    const reconciledBy = user?.name?.trim() || 'Accounts user'
    const reconciledAt = new Date().toISOString()
    const store = readSubmissions()
    const byId = new Map(listProjectedItems().map(item => [item.id, item]))
    let submitted = 0

    for (const id of ids) {
      const existing = byId.get(id)
      if (!existing || existing.status !== 'pending') continue
      store[id] = {
        referenceNumber: bookEntry,
        status: 'submitted',
        reconciledAt,
        reconciledBy,
      }
      submitted += 1
    }

    if (submitted === 0) {
      return { ok: false, error: 'No pending records were selected to reconcile.' }
    }

    writeSubmissions(store)
    invalidateProjectedCache()
    return { ok: true, submitted }
  },

  reject(
    input: RejectReconciliationInput,
  ): { ok: true; rejected: number } | { ok: false; error: string } {
    const reason = input.reason.trim()
    if (!reason) return { ok: false, error: 'Rejection reason is required.' }

    const existing = this.getById(input.id)
    if (!existing) return { ok: false, error: 'Reconciliation item not found.' }
    if (existing.status === 'submitted') {
      return { ok: false, error: 'Submitted records cannot be rejected.' }
    }
    if (existing.status === 'rejected') {
      return { ok: false, error: 'This record is already rejected.' }
    }

    const user = getCurrentUser()
    const reconciledBy = user?.name?.trim() || 'Accounts user'
    const reconciledAt = new Date().toISOString()
    const store = readSubmissions()
    const projected = listProjectedItems()

    const relatedIds =
      existing.sourceKind === 'claim_sheet'
        ? projected
            .filter(item => item.sourceKind === 'claim_sheet' && item.sourceId === existing.sourceId)
            .map(item => item.id)
        : projected
            .filter(item => item.sourceKind === 'expense' && item.sourceId === existing.sourceId)
            .map(item => item.id)

    const idsToReject = relatedIds.length > 0 ? relatedIds : [existing.id]

    if (existing.sourceKind === 'claim_sheet') {
      const result = groundOpsClaimSheetService.rejectFromReconciliation(existing.sourceId, reason)
      if (!result.ok) {
        return { ok: false, error: result.error || 'Could not reject claim sheet.' }
      }
    } else {
      const result = applicationExpenseManagementService.reject(existing.sourceId, reason)
      if (!result.ok) {
        return { ok: false, error: result.error || 'Could not reject expense.' }
      }
    }

    for (const id of idsToReject) {
      store[id] = {
        status: 'rejected',
        reconciledAt,
        reconciledBy,
        rejectionReason: reason,
      }
    }
    writeSubmissions(store)
    invalidateProjectedCache()

    return { ok: true, rejected: idsToReject.length }
  },
}
