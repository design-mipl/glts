import type { ApplicationExpenseListingRow } from '@/shared/types/applicationExpenseManagement'
import type { ApplicationExpenseListingFilters } from '@/shared/types/applicationExpenseManagement'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import {
  applyListingFilters,
  getListingCellValue,
  matchesListingSearch,
  segmentEmptyStateCopy,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { ExpenseListingTab } from '../config/expenseListingTabs'

export interface ExpenseListingFilterState {
  applicationId: string
  company: string
  vessel: string
  visaCountry: string
  jurisdiction: string
  submissionDateFrom: string
  submissionDateTo: string
  approvalStatus: ApplicationExpenseListingFilters['approvalStatus']
  paymentStatus: ApplicationExpenseListingFilters['paymentStatus']
}

export const EMPTY_EXPENSE_LISTING_FILTERS: ExpenseListingFilterState = {
  applicationId: '',
  company: '',
  vessel: '',
  visaCountry: '',
  jurisdiction: '',
  submissionDateFrom: '',
  submissionDateTo: '',
  approvalStatus: '',
  paymentStatus: '',
}

export function loadExpenseListingRows(tab: ExpenseListingTab): ApplicationExpenseListingRow[] {
  return applicationExpenseManagementService.listApplications(tab)
}

export function applyExpenseAdvancedFilters(
  rows: ApplicationExpenseListingRow[],
  filters: ExpenseListingFilterState,
): ApplicationExpenseListingRow[] {
  return applyListingFilters(rows, {
    applicationId: filters.applicationId || undefined,
    company: filters.company || undefined,
    vessel: filters.vessel || undefined,
    visaCountry: filters.visaCountry || undefined,
    jurisdiction: filters.jurisdiction || undefined,
    submissionDateFrom: filters.submissionDateFrom || undefined,
    submissionDateTo: filters.submissionDateTo || undefined,
    approvalStatus: filters.approvalStatus || undefined,
    paymentStatus: filters.paymentStatus || undefined,
  })
}

export function matchesExpenseListingSearch(row: ApplicationExpenseListingRow, query: string): boolean {
  const passengerNames = applicationExpenseManagementService.getPassengerNames(row.applicationId)
  return matchesListingSearch(row, query, passengerNames)
}

export { getListingCellValue as getExpenseListingCellValue }

export function getExpenseListingEmptyState(tab: ExpenseListingTab, hasSearch: boolean) {
  if (hasSearch) {
    return {
      title: 'No applications match your search',
      description: 'Try a different application ID, company, vessel, or passenger name.',
    }
  }
  return segmentEmptyStateCopy(tab)
}

export function getExpenseListingFilterOptions(rows: ApplicationExpenseListingRow[]) {
  const uniq = (values: string[]) => [...new Set(values.filter(Boolean))].sort()
  return {
    companies: uniq(rows.map(r => r.companyName)),
    vessels: uniq(rows.map(r => r.vesselName)),
    visaCountries: uniq(rows.map(r => r.visaCountry)),
    jurisdictions: uniq(rows.map(r => r.jurisdiction)),
    approvalStatuses: uniq(rows.map(r => r.approvalStatus)),
    paymentStatuses: uniq(rows.map(r => r.paymentStatus)),
  }
}

export function computeExpenseListingKpis(rows: ApplicationExpenseListingRow[]) {
  return {
    submittedApplications: rows.length,
    totalExpense: rows.reduce((sum, r) => sum + r.totalExpense, 0),
    pendingPayment: rows.reduce((sum, r) => sum + r.pendingExpense, 0),
    paidApplications: rows.filter(r => r.paymentStatus === 'paid').length,
  }
}

export function downloadExpenseListingCsv(rows: ApplicationExpenseListingRow[]) {
  const headers = [
    'Application ID',
    'Company',
    'Vessel',
    'Crew Count',
    'Visa Country',
    'Visa Type',
    'Jurisdiction',
    'Submission Date',
    'Total Expense',
    'Pending Payment',
    'Payment Status',
  ]
  const lines = rows.map(row =>
    [
      row.applicationId,
      row.companyName,
      row.vesselName,
      row.crewCount,
      row.visaCountry,
      row.visaType,
      row.jurisdiction,
      row.submissionDate,
      formatInr(row.totalExpense),
      formatInr(row.pendingExpense),
      row.paymentStatus,
    ]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )
  const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `expense-applications-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function mapExpenseRowsToGridItems(rows: ApplicationExpenseListingRow[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.applicationId,
    subtitle: row.companyName,
    description: `${row.vesselName} · ${row.visaCountry} · ${row.visaType}`,
    meta: `${formatInr(row.totalExpense)} total · ${row.paymentStatus}`,
  }))
}
