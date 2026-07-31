import type { Column } from '@/design-system/UIComponents'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import type { AccountsDashboardData } from '../types'

export type AccountsReportTypeId =
  // Executive finance (ops-style header catalog)
  | 'revenue_vs_daily_target'
  | 'cash_position'
  | 'collections_today_mtd'
  | 'weekly_gross_profit_flash'
  | 'gross_margin_by_vertical'
  | 'revenue_by_visa_country'
  | 'revenue_by_client_country'
  | 'outstanding_receivables_ageing'
  | 'embassy_fee_working_capital'
  | 'full_pl_vertical_breakdown'
  | 'revenue_forecast'
  | 'client_wise_profitability'
  | 'days_sales_outstanding'
  | 'daily_invoice_report'
  // Expenses
  | 'credit_card_spend'
  | 'insurance'
  | 'courier_cargo_delivery'
  | 'ticketing'
  | 'cash'
  | 'invoiced_uninvoiced'
  | 'expense_refunds'
  // Fund allocation
  | 'fund_pending'
  | 'fund_allocated'
  | 'claim_sheets'
  // Vendor billing
  | 'vendor_awaiting_invoice'
  | 'vendor_costing'
  | 'vendor_payments'
  // Invoicing
  | 'visa_submission_status'
  | 'invoice_exceptions'
  // Credit control / collections
  | 'pending_walkin_payments'
  | 'ageing'
  | 'collections'
  | 'collection_rate_vs_overdues'
  | 'follow_ups'
  // Supervisor daily packs
  | 'invoice_posted'
  | 'uninvoiced'
  | 'courier'
  | 'visa_submission_collection'
  | 'collection_daily'
  | 'outstanding'
  | 'overdue_invoices'
  | 'client_invoice_submissions'
  // Analytics / supervisor
  | 'revenue'
  | 'revenue_vs_targets'
  | 'visa_count'
  | 'top_country_revenue'
  | 'top_client_revenue'
  | 'revenue_by_segment'
  | 'submission_collection'
  | 'purchase_vs_revenue'
  | 'audit_log'

export type AccountsReportPeriodId =
  | 'day'
  | 'week'
  | 'fortnight'
  | 'month'
  | 'mtd'
  | 'ytd'
  | 'custom'

export interface AccountsReportPreviewRow {
  id: string
  [key: string]: string
}

export interface AccountsReportMeta {
  id: AccountsReportTypeId
  label: string
  category: string
  source: string
}

export const ACCOUNTS_REPORT_META: readonly AccountsReportMeta[] = [
  {
    id: 'revenue_vs_daily_target',
    label: 'Revenue vs Daily Target',
    category: 'Executive',
    source: 'Finance — daily / MTD / YTD revenue against targets.',
  },
  {
    id: 'cash_position',
    label: 'Cash Position (Available Funds)',
    category: 'Executive',
    source: 'Finance — available funds after blocked embassy/VFS cash and refunds.',
  },
  {
    id: 'collections_today_mtd',
    label: 'Collections Today & MTD',
    category: 'Executive',
    source: 'Credit control — payments received today and MTD vs target.',
  },
  {
    id: 'weekly_gross_profit_flash',
    label: 'Weekly Gross Profit Flash',
    category: 'Executive',
    source: 'Finance — weekly flash revenue, direct costs, and gross margin.',
  },
  {
    id: 'gross_margin_by_vertical',
    label: 'Gross Margin by Vertical',
    category: 'Executive',
    source: 'Finance — Marine / B2B / Corporate / B2C margin with RAG.',
  },
  {
    id: 'revenue_by_visa_country',
    label: 'Revenue by Visa Country',
    category: 'Executive',
    source: 'Finance — country-wise revenue, applications, and targets. Date & country filters via period.',
  },
  {
    id: 'revenue_by_client_country',
    label: 'Revenue by Client and Country',
    category: 'Executive',
    source: 'Finance — client × country revenue mix. Date, client & country filters via period.',
  },
  {
    id: 'outstanding_receivables_ageing',
    label: 'Outstanding Receivables Ageing',
    category: 'Executive',
    source: 'Credit control — AR ageing buckets with outstanding reasons.',
  },
  {
    id: 'embassy_fee_working_capital',
    label: 'Embassy Fee Working Capital',
    category: 'Executive',
    source: 'Finance — embassy/VFS fee blocked capital by country.',
  },
  {
    id: 'full_pl_vertical_breakdown',
    label: 'Full P&L – 4 Vertical Breakdown (Monthly)',
    category: 'Executive',
    source: 'Finance — monthly P&L by vertical with target and variance notes.',
  },
  {
    id: 'revenue_forecast',
    label: 'Revenue Forecast (Monthly / Quarterly / Half-Yearly / Yearly)',
    category: 'Executive',
    source: 'Finance — conservative / base / optimistic forecast scenarios.',
  },
  {
    id: 'client_wise_profitability',
    label: 'Client-Wise Profitability',
    category: 'Executive',
    source: 'Finance — client revenue, cost, margin, and MoM trend.',
  },
  {
    id: 'days_sales_outstanding',
    label: 'Days Sales Outstanding (DSO)',
    category: 'Executive',
    source: 'Credit control — DSO by vertical / client tier vs credit-day targets.',
  },
  {
    id: 'daily_invoice_report',
    label: 'Daily Invoice Report',
    category: 'Executive',
    source: 'Invoicing — case closed vs invoiced status with reason.',
  },
  {
    id: 'credit_card_spend',
    label: 'Daily Credit Card Spend',
    category: 'Expenses',
    source: 'Expense module — payment mode = credit card.',
  },
  {
    id: 'insurance',
    label: 'Daily Insurance Report',
    category: 'Expenses',
    source: 'Expense module — insurance lines with vendor.',
  },
  {
    id: 'courier_cargo_delivery',
    label: 'Daily Courier / Cargo / Airport Delivery',
    category: 'Expenses',
    source: 'Expense module — mode of delivery.',
  },
  {
    id: 'ticketing',
    label: 'Daily Ticketing Report',
    category: 'Expenses',
    source: 'Expense module — ticketing lines with vendor.',
  },
  {
    id: 'cash',
    label: 'Daily Cash Report',
    category: 'Expenses',
    source: 'Expense module — payment mode = cash.',
  },
  {
    id: 'invoiced_uninvoiced',
    label: 'Daily Invoiced & Un-invoiced',
    category: 'Expenses',
    source: 'Billing and invoice submodule.',
  },
  {
    id: 'expense_refunds',
    label: 'Expense Refunds Report',
    category: 'Expenses',
    source: 'Expense module — passenger / service refunds.',
  },
  {
    id: 'fund_pending',
    label: 'Pending Fund Allocation',
    category: 'Fund allocation',
    source: 'Fund allocation — Ops requests via Assignment Priority.',
  },
  {
    id: 'fund_allocated',
    label: 'Allocated Funds Report',
    category: 'Fund allocation',
    source: 'Fund allocation — completed allocations.',
  },
  {
    id: 'claim_sheets',
    label: 'Claim Sheets Report',
    category: 'Fund allocation',
    source: 'Ground Ops claim sheets — approve / reject queue.',
  },
  {
    id: 'vendor_awaiting_invoice',
    label: 'Vendor Charges Awaiting Invoice',
    category: 'Vendor billing',
    source: 'Vendor billing — charges awaiting vendor invoice.',
  },
  {
    id: 'visa_submission_status',
    label: 'Visa Submission & Status (Invoice Ready)',
    category: 'Invoicing',
    source: 'Cases ready for invoice posting by billing cycle.',
  },
  {
    id: 'invoice_exceptions',
    label: 'Unbilled / Refunds / Credit Notes',
    category: 'Invoicing',
    source: 'Invoice module — unbilled expenses, refunds, credit notes.',
  },
  {
    id: 'pending_walkin_payments',
    label: 'Pending Walk-in Payments',
    category: 'Credit control',
    source: 'Outstanding walk-in invoices with follow-up dates.',
  },
  {
    id: 'ageing',
    label: 'Client Ageing Report',
    category: 'Credit control',
    source: 'AR ageing buckets — 30 / 45 / 60 / 90 / 180 days.',
  },
  {
    id: 'collections',
    label: 'Collections Report',
    category: 'Credit control',
    source: 'Collections for the selected period.',
  },
  {
    id: 'collection_rate_vs_overdues',
    label: 'Collection Rate % vs Overdues',
    category: 'Credit control',
    source: 'Monthly collection rate compared with overdue AR.',
  },
  {
    id: 'follow_ups',
    label: 'Daily Follow-ups Report',
    category: 'Credit control',
    source: 'Follow-ups logged against client invoices.',
  },
  {
    id: 'invoice_posted',
    label: 'Daily Invoice Posted',
    category: 'Supervisor',
    source: 'Invoices posted today.',
  },
  {
    id: 'uninvoiced',
    label: 'Daily Un-invoiced Report',
    category: 'Supervisor',
    source: 'Billable cases without posted invoice.',
  },
  {
    id: 'courier',
    label: 'Daily Courier Report',
    category: 'Supervisor',
    source: 'Expense / logistics courier spend.',
  },
  {
    id: 'visa_submission_collection',
    label: 'Daily Visa Submission & Collection',
    category: 'Supervisor',
    source: 'Submission and collection outcomes for invoicing.',
  },
  {
    id: 'collection_daily',
    label: 'Daily Collection Report',
    category: 'Supervisor',
    source: 'Receipts allocated today.',
  },
  {
    id: 'outstanding',
    label: 'Outstanding Report',
    category: 'Supervisor',
    source: 'Open receivables across clients.',
  },
  {
    id: 'overdue_invoices',
    label: 'Daily Overdue Invoices',
    category: 'Supervisor',
    source: 'Overdue invoices flagged for chase.',
  },
  {
    id: 'client_invoice_submissions',
    label: 'Client Invoice Submissions (Date-wise)',
    category: 'Supervisor',
    source: 'Invoice submission calendar completions.',
  },
  {
    id: 'revenue',
    label: 'Revenue Report',
    category: 'Analytics',
    source: 'Revenue for day / week / fortnight / month / MTD / YTD.',
  },
  {
    id: 'revenue_vs_targets',
    label: 'Revenue vs Targets',
    category: 'Analytics',
    source: 'Actual vs target — monthly / MTD / yearly.',
  },
  {
    id: 'visa_count',
    label: 'Visa Count Report',
    category: 'Analytics',
    source: 'Visa volumes — monthly / MTD / yearly.',
  },
  {
    id: 'top_country_revenue',
    label: 'Top 10 Country-wise Revenue',
    category: 'Analytics',
    source: 'Country revenue ranking.',
  },
  {
    id: 'top_client_revenue',
    label: 'Top 10 Client-wise Revenue',
    category: 'Analytics',
    source: 'Client revenue ranking.',
  },
  {
    id: 'revenue_by_segment',
    label: 'Revenue by Segment',
    category: 'Analytics',
    source: 'Marine / B2B / Corporate / B2C.',
  },
  {
    id: 'submission_collection',
    label: 'Submission & Collection Report',
    category: 'Analytics',
    source: 'Submission vs collection volumes and value.',
  },
  {
    id: 'vendor_costing',
    label: 'Vendor Costing Report',
    category: 'Vendor billing',
    source: 'Vendor billing — cost breakdown by vendor.',
  },
  {
    id: 'vendor_payments',
    label: 'Vendor Payments Report',
    category: 'Vendor billing',
    source: 'Vendor billing — payables due and paid.',
  },
  {
    id: 'purchase_vs_revenue',
    label: 'Purchase vs Revenue Report',
    category: 'Analytics',
    source: 'Purchase cost, vendor cost, revenue, margin.',
  },
  {
    id: 'audit_log',
    label: 'Log Report (Invoice / Data Changes)',
    category: 'Analytics',
    source: 'Audit trail for invoice and data modifications.',
  },
] as const

export const ACCOUNTS_REPORT_TYPE_OPTIONS = ACCOUNTS_REPORT_META.map((meta) => ({
  label: `${meta.label} (${meta.category})`,
  value: meta.id,
}))

export const ACCOUNTS_REPORT_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Fortnight', value: 'fortnight' },
  { label: 'Month', value: 'month' },
  { label: 'MTD', value: 'mtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Custom', value: 'custom' },
] as const satisfies ReadonlyArray<{ label: string; value: AccountsReportPeriodId }>

function startOfDay(d: Date): Date {
  const next = new Date(d)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(d: Date): Date {
  const next = new Date(d)
  next.setHours(23, 59, 59, 999)
  return next
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

function formatDisplayDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function resolveAccountsReportRange(
  period: AccountsReportPeriodId,
  customRange: [Date | null, Date | null],
  now = new Date(),
): { from: Date; to: Date } {
  const today = startOfDay(now)
  const to = endOfDay(now)

  switch (period) {
    case 'day':
      return { from: today, to }
    case 'week':
      return { from: startOfDay(addDays(today, -6)), to }
    case 'fortnight':
      return { from: startOfDay(addDays(today, -13)), to }
    case 'month':
      return { from: startOfDay(addDays(today, -29)), to }
    case 'mtd':
      return { from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), to }
    case 'ytd':
      return { from: startOfDay(new Date(now.getFullYear(), 0, 1)), to }
    case 'custom': {
      const [start, end] = customRange
      const from = start ? startOfDay(start) : today
      const customTo = end ? endOfDay(end) : to
      return { from, to: customTo }
    }
    default:
      return { from: today, to }
  }
}

export function formatAccountsReportRangeLabel(from: Date, to: Date): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
}

export function getAccountsReportTypeLabel(id: AccountsReportTypeId): string {
  return ACCOUNTS_REPORT_META.find((meta) => meta.id === id)?.label ?? id
}

export function getAccountsReportSource(id: AccountsReportTypeId): string {
  return ACCOUNTS_REPORT_META.find((meta) => meta.id === id)?.source ?? ''
}

function textColumn(
  key: string,
  label: string,
  widthSize: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): Column<AccountsReportPreviewRow> {
  return {
    key,
    label,
    widthSize,
    sortable: false,
    filterable: false,
    searchable: false,
  }
}

export function getAccountsReportColumns(
  reportType: AccountsReportTypeId,
): Column<AccountsReportPreviewRow>[] {
  switch (reportType) {
    case 'revenue_vs_daily_target':
      return [
        textColumn('todaysRevenue', "Today's Revenue", 'md'),
        textColumn('mtdRevenue', 'MTD Revenue', 'md'),
        textColumn('mtdTarget', 'MTD Target', 'md'),
        textColumn('mtdVsTarget', 'MTD vs Target (%)', 'md'),
        textColumn('ytdRevenue', 'YTD Revenue', 'md'),
        textColumn('annualTarget', 'Annual Target', 'md'),
        textColumn('ytdVsTarget', 'YTD vs Target (%)', 'md'),
      ]
    case 'cash_position':
      return [
        textColumn('approxBalance', 'Approx. Balance', 'md'),
        textColumn('cashBlocked', 'Cash Blocked (Embassy/VFS)', 'lg'),
        textColumn('refunds', 'Refunds', 'md'),
        textColumn('actualCollections', 'Actual Collections Till Date', 'lg'),
        textColumn('availableFunds', 'Available Funds', 'md'),
        textColumn('asOf', 'As-of Date/Time', 'md'),
      ]
    case 'collections_today_mtd':
      return [
        textColumn('paymentsToday', 'Payments Received Today', 'md'),
        textColumn('mtdCollections', 'MTD Collections', 'md'),
        textColumn('mtdTarget', 'MTD Target', 'md'),
        textColumn('mtdVsTarget', 'MTD vs Target (%)', 'md'),
        textColumn('topOverdueAccount', 'Top Overdue Account', 'lg'),
        textColumn('daysOverdue', 'Days Overdue', 'sm'),
      ]
    case 'weekly_gross_profit_flash':
      return [
        textColumn('weekEnding', 'Week Ending', 'md'),
        textColumn('revenueBooked', 'Revenue Booked', 'md'),
        textColumn('directCosts', 'Direct Costs (Approx.)', 'md'),
        textColumn('grossProfit', 'Gross Profit (Approx.)', 'md'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('vsPriorWeek', 'vs Prior Week (%)', 'sm'),
      ]
    case 'gross_margin_by_vertical':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('revenueThisWeek', 'Revenue This Week', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('grossProfit', 'Gross Profit', 'md'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('vsLastWeek', 'vs Last Week', 'sm'),
        textColumn('ragStatus', 'RAG Status (Green / Amber / Red)', 'md'),
      ]
    case 'revenue_by_visa_country':
    case 'revenue_by_client_country':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('applications', 'No. of Applications', 'sm'),
        textColumn('revenueThisWeek', 'Revenue This Week', 'md'),
        textColumn('margin', 'Margin (%)', 'sm'),
        textColumn('revenueMtd', 'Revenue MTD', 'md'),
        textColumn('targetedRevenueMtd', 'Targeted Revenue MTD', 'md'),
        textColumn('targetedYtdRevenue', 'Targeted YTD Revenue', 'md'),
        textColumn('pctOfTotal', '% of Total Revenue for each Client', 'md'),
      ]
    case 'outstanding_receivables_ageing':
      return [
        textColumn('agingBucket', 'Aging Bucket', 'md'),
        textColumn('clients', 'Clients', 'xl'),
        textColumn('totalOutstanding', 'Total Outstanding (Age-wise)', 'md'),
        textColumn('reasons', 'Reasons of Outstandings (Free Text)', 'xl'),
      ]
    case 'embassy_fee_working_capital':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('totalBlocked', 'Total Blocked/Utilized', 'md'),
        textColumn('cases', 'No. of Cases', 'sm'),
        textColumn('avgDaysBlocked', 'Avg Days Blocked', 'sm'),
        textColumn('actualPaymentReceived', 'Actual Payment Received for Respective Case', 'lg'),
        textColumn('oldestCaseDays', 'Oldest Case (Days)', 'sm'),
      ]
    case 'full_pl_vertical_breakdown':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('overheadAllocation', 'Overhead Allocation', 'md'),
        textColumn('ebitda', 'EBITDA', 'md'),
        textColumn('vsPriorMonth', 'vs Prior Month', 'sm'),
        textColumn('vsMtdTarget', 'vs MTD Target', 'sm'),
        textColumn('vsYtdTarget', 'vs YTD Target', 'sm'),
        textColumn('variance', 'Variance', 'sm'),
        textColumn('note', 'Note (if >10%)', 'lg'),
      ]
    case 'revenue_forecast':
      return [
        textColumn('period', 'Period', 'md'),
        textColumn('conservative', 'Conservative', 'md'),
        textColumn('base', 'Base', 'md'),
        textColumn('optimistic', 'Optimistic', 'md'),
        textColumn('basis', 'Basis (Pipeline / Approval Rate / Seasonality)', 'xl'),
      ]
    case 'client_wise_profitability':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('grossProfit', 'Gross Profit', 'md'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('trendVsLastMonth', 'Trend vs Last Month', 'md'),
      ]
    case 'days_sales_outstanding':
      return [
        textColumn('verticalOrTier', 'Vertical / Client Tier', 'lg'),
        textColumn('avgDays', 'Avg Days (Invoice to Payment)', 'md'),
        textColumn('sixMonthTrend', '6-Month Trend', 'md'),
        textColumn('vsTarget', 'vs Target (Credit Days Client-wise)', 'lg'),
      ]
    case 'daily_invoice_report':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('invoiceStatus', 'Invoice Status (Invoiced / Not Invoiced)', 'md'),
        textColumn('reason', 'Reason (if Not Invoiced)', 'xl'),
        textColumn('daysSinceClosed', 'Days Since Case Closed', 'sm'),
      ]
    case 'credit_card_spend':
    case 'insurance':
    case 'courier_cargo_delivery':
    case 'ticketing':
    case 'cash':
    case 'courier':
      return [
        textColumn('reference', 'Reference', 'md'),
        textColumn('vendor', 'Vendor', 'lg'),
        textColumn('detail', 'Detail', 'lg'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('date', 'Date', 'md'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'expense_refunds':
      return [
        textColumn('applicationId', 'Application', 'md'),
        textColumn('passenger', 'Passenger', 'md'),
        textColumn('expenseType', 'Expense type', 'md'),
        textColumn('refundAmount', 'Refund', 'md'),
        textColumn('paymentMode', 'Payment mode', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('requestedDate', 'Requested', 'md'),
      ]
    case 'fund_pending':
    case 'fund_allocated':
      return [
        textColumn('glNumber', 'GL Number', 'md'),
        textColumn('applicant', 'Applicant', 'md'),
        textColumn('company', 'Company', 'lg'),
        textColumn('country', 'Country', 'md'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('allocationStatus', 'Status', 'sm'),
        textColumn('requestedBy', 'Requested by', 'md'),
      ]
    case 'claim_sheets':
      return [
        textColumn('claimSheetNo', 'Claim sheet', 'md'),
        textColumn('groundOpsUser', 'Ground Ops', 'md'),
        textColumn('casesCount', 'Cases', 'sm'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('submittedDate', 'Submitted', 'md'),
        textColumn('branch', 'Branch', 'md'),
      ]
    case 'vendor_awaiting_invoice':
      return [
        textColumn('vendorName', 'Vendor', 'lg'),
        textColumn('awaitingInvoiceCount', 'Awaiting invoice', 'sm'),
        textColumn('openBills', 'Open bills', 'sm'),
        textColumn('outstandingAmount', 'Outstanding', 'md'),
        textColumn('lastInvoiceDate', 'Last invoice', 'md'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'invoice_exceptions':
      return [
        textColumn('kindLabel', 'Type', 'md'),
        textColumn('reference', 'Reference', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('application', 'Application', 'md'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('date', 'Date', 'md'),
      ]
    case 'invoiced_uninvoiced':
    case 'uninvoiced':
      return [
        textColumn('caseOrInvoice', 'Case / Invoice', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('segment', 'Segment', 'md'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('status', 'Status', 'md'),
        textColumn('branch', 'Branch', 'md'),
      ]
    case 'visa_submission_status':
    case 'visa_submission_collection':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('country', 'Country', 'md'),
        textColumn('visaType', 'Visa type', 'md'),
        textColumn('submissionStatus', 'Submission status', 'md'),
        textColumn('billingCycle', 'Billing cycle', 'md'),
        textColumn('invoiceReady', 'Invoice ready', 'sm'),
      ]
    case 'pending_walkin_payments':
    case 'follow_ups':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('invoiceNumber', 'Invoice', 'md'),
        textColumn('outstandingAmount', 'Outstanding', 'md'),
        textColumn('followUpDate', 'Follow-up date', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('assignedExecutive', 'Assigned', 'md'),
      ]
    case 'ageing':
      return [
        textColumn('bucket', 'Age bucket', 'md'),
        textColumn('invoiceCount', 'Invoices', 'sm'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('sharePercent', 'Share %', 'sm'),
      ]
    case 'collections':
    case 'collection_daily':
      return [
        textColumn('invoiceNumber', 'Invoice', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('dueDate', 'Due date', 'md'),
        textColumn('assignedExecutive', 'Assigned', 'md'),
      ]
    case 'collection_rate_vs_overdues':
      return [
        textColumn('period', 'Period', 'md'),
        textColumn('collectionRate', 'Collection rate %', 'md'),
        textColumn('collected', 'Collected', 'md'),
        textColumn('overdue', 'Overdue', 'md'),
        textColumn('outstanding', 'Outstanding', 'md'),
      ]
    case 'invoice_posted':
    case 'overdue_invoices':
    case 'outstanding':
      return [
        textColumn('invoiceNumber', 'Invoice', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('date', 'Date', 'md'),
        textColumn('branch', 'Branch', 'md'),
      ]
    case 'client_invoice_submissions':
      return [
        textColumn('company', 'Company', 'lg'),
        textColumn('submissionDate', 'Submission date', 'md'),
        textColumn('billingCycle', 'Billing cycle', 'md'),
        textColumn('status', 'Status', 'sm'),
        textColumn('branch', 'Branch', 'md'),
      ]
    case 'revenue':
    case 'revenue_vs_targets':
      return [
        textColumn('label', 'Period / segment', 'lg'),
        textColumn('actual', 'Actual', 'md'),
        textColumn('target', 'Target', 'md'),
        textColumn('variance', 'Variance', 'md'),
        textColumn('achievement', 'Achievement %', 'sm'),
      ]
    case 'visa_count':
      return [
        textColumn('segment', 'Segment', 'md'),
        textColumn('country', 'Country', 'md'),
        textColumn('visaCount', 'Visa count', 'sm'),
        textColumn('period', 'Period', 'md'),
      ]
    case 'top_country_revenue':
    case 'top_client_revenue':
    case 'revenue_by_segment':
      return [
        textColumn('rank', '#', 'sm'),
        textColumn('name', 'Name', 'lg'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('sharePercent', 'Share %', 'sm'),
      ]
    case 'submission_collection':
      return [
        textColumn('metric', 'Metric', 'lg'),
        textColumn('submissions', 'Submissions', 'md'),
        textColumn('collections', 'Collections', 'md'),
        textColumn('value', 'Value', 'md'),
      ]
    case 'vendor_costing':
    case 'vendor_payments':
      return [
        textColumn('vendor', 'Vendor', 'lg'),
        textColumn('service', 'Service', 'lg'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('dueDate', 'Due date', 'md'),
        textColumn('paymentStatus', 'Status', 'sm'),
        textColumn('branch', 'Branch', 'md'),
      ]
    case 'purchase_vs_revenue':
      return [
        textColumn('label', 'Month', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('purchase', 'Purchase', 'md'),
        textColumn('margin', 'Margin', 'md'),
      ]
    case 'audit_log':
      return [
        textColumn('timestamp', 'Timestamp', 'md'),
        textColumn('user', 'User', 'md'),
        textColumn('action', 'Action', 'lg'),
        textColumn('reference', 'Reference', 'md'),
        textColumn('detail', 'Detail', 'xl'),
      ]
    default:
      return []
  }
}

function expenseRowsFromRecon(
  data: AccountsDashboardData,
  pack:
    | 'credit_card'
    | 'insurance'
    | 'courier'
    | 'ticketing'
    | 'cash'
    | 'invoiced_uninvoiced'
    | null,
  categoryMatch: (category: string) => boolean,
  detailFallback: string,
): AccountsReportPreviewRow[] {
  if (pack) {
    const fromExpense = data.expenseDailyRows.filter((row) => row.pack === pack)
    if (fromExpense.length > 0) {
      return fromExpense.map((row) => ({
        id: `expd-${row.id}`,
        reference: row.reference,
        vendor: row.vendor,
        detail: `${row.detail} · ${row.paymentMode}`,
        amount: row.amount,
        date: row.date,
        status: row.status,
      }))
    }
  }
  const matched = data.reconciliationRows.filter((row) => categoryMatch(row.category.toLowerCase()))
  const source = matched.length > 0 ? matched : data.reconciliationRows.slice(0, 5)
  return source.map((row) => ({
    id: `exp-${row.id}`,
    reference: row.reference,
    vendor: row.vendor,
    detail: detailFallback || row.category,
    amount: row.amount,
    date: row.dueDate,
    status: row.status,
  }))
}

export function buildAccountsReportRows(
  reportType: AccountsReportTypeId,
  data: AccountsDashboardData,
): AccountsReportPreviewRow[] {
  switch (reportType) {
    case 'revenue_vs_daily_target': {
      const mtd = data.revenueSnapshot.mtd
      const ytd = data.revenueSnapshot.ytd
      const mtdTarget = Math.round(mtd * 1.08)
      const annualTarget = Math.round(ytd * 1.35)
      const today = data.revenueSnapshot.trend[data.revenueSnapshot.trend.length - 1] ?? mtd / 22
      return [
        {
          id: 'rvdt-1',
          todaysRevenue: `₹${today.toFixed(1)}L`,
          mtdRevenue: `₹${mtd}L`,
          mtdTarget: `₹${mtdTarget}L`,
          mtdVsTarget: `${Math.round((mtd / mtdTarget) * 100)}%`,
          ytdRevenue: `₹${ytd}L`,
          annualTarget: `₹${annualTarget}L`,
          ytdVsTarget: `${Math.round((ytd / annualTarget) * 100)}%`,
        },
      ]
    }

    case 'cash_position': {
      const collections = data.collectionSummary.collected
      const refunds = data.expenseRefundRows.reduce((sum, row) => {
        const n = Number.parseFloat(row.refundAmount.replace(/[₹,\sL]/gi, '')) || 0
        return sum + n
      }, 0)
      const blocked = Math.round((data.fundAllocationRows.length || 4) * 2.4)
      const approx = Number.parseFloat(collections.replace(/[₹,\sL]/gi, '')) || 48
      const available = Math.max(0, approx - blocked - refunds / 10)
      const asOf = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      return [
        {
          id: 'cash-pos-1',
          approxBalance: `₹${approx.toFixed(1)}L`,
          cashBlocked: `₹${blocked.toFixed(1)}L`,
          refunds: `₹${(refunds / 10 || 1.2).toFixed(1)}L`,
          actualCollections: collections,
          availableFunds: `₹${available.toFixed(1)}L`,
          asOf,
        },
      ]
    }

    case 'collections_today_mtd': {
      const overdue = data.collectionRows
        .filter((row) => row.status.toLowerCase().includes('overdue'))
        .sort((a, b) => b.outstandingAmount.localeCompare(a.outstandingAmount))
      const top = overdue[0] ?? data.collectionRows[0]
      const mtdCollected = Number.parseFloat(data.collectionSummary.collected.replace(/[₹,\sL]/gi, '')) || 32
      const mtdTarget = Math.round(mtdCollected * 1.1)
      return [
        {
          id: 'col-today-1',
          paymentsToday: `₹${(mtdCollected / 18).toFixed(1)}L`,
          mtdCollections: data.collectionSummary.collected,
          mtdTarget: `₹${mtdTarget}L`,
          mtdVsTarget: `${Math.round((mtdCollected / mtdTarget) * 100)}%`,
          topOverdueAccount: top?.client ?? '—',
          daysOverdue: top?.ageBucket?.includes('90')
            ? '90+'
            : top?.ageBucket?.includes('60')
              ? '60+'
              : top?.ageBucket?.includes('45')
                ? '45+'
                : '30+',
        },
      ]
    }

    case 'weekly_gross_profit_flash': {
      const trend = data.purchaseVsRevenue.trend
      const latest = trend[trend.length - 1] ?? { label: 'WTD', revenue: 42, purchase: 18 }
      const prior = trend[trend.length - 2] ?? latest
      const gp = latest.revenue - latest.purchase
      const priorGp = prior.revenue - prior.purchase
      const margin = latest.revenue ? Math.round((gp / latest.revenue) * 100) : 0
      const vsPrior = priorGp ? Math.round(((gp - priorGp) / Math.abs(priorGp)) * 100) : 0
      return [
        {
          id: 'wgpf-1',
          weekEnding: latest.label,
          revenueBooked: `₹${latest.revenue}L`,
          directCosts: `₹${latest.purchase}L`,
          grossProfit: `₹${gp}L`,
          grossMargin: `${margin}%`,
          vsPriorWeek: `${vsPrior >= 0 ? '+' : ''}${vsPrior}%`,
        },
      ]
    }

    case 'gross_margin_by_vertical': {
      return data.revenueBySegment.map((row, index) => {
        const revenue = Number.parseFloat(row.revenue.replace(/[₹,\sL]/gi, '')) || row.sharePercent
        const cost = Math.round(revenue * (0.38 + (index % 3) * 0.04))
        const gp = Math.round(revenue - cost)
        const margin = revenue ? Math.round((gp / revenue) * 100) : 0
        const vs = index % 3 === 0 ? '+4%' : index % 3 === 1 ? '-2%' : '+1%'
        const rag = margin >= 55 ? 'Green' : margin >= 40 ? 'Amber' : 'Red'
        return {
          id: `gmv-${row.id}`,
          vertical: row.name,
          revenueThisWeek: `₹${revenue}L`,
          directCost: `₹${cost}L`,
          grossProfit: `₹${gp}L`,
          grossMargin: `${margin}%`,
          vsLastWeek: vs,
          ragStatus: rag,
        }
      })
    }

    case 'revenue_by_visa_country':
    case 'revenue_by_client_country': {
      const clients = data.topClients
      const countries = data.topCountries
      const totalShare = clients.reduce((sum, c) => sum + c.sharePercent, 0) || 1
      return clients.slice(0, 10).map((client, index) => {
        const country = countries[index % countries.length]
        const revenue = Number.parseFloat(client.revenue.replace(/[₹,\sL]/gi, '')) || client.sharePercent
        const mtdTarget = Math.round(revenue * 1.12)
        const ytdTarget = Math.round(revenue * 4.8)
        return {
          id: `rvc-${client.id}`,
          country: country?.name ?? '—',
          client: client.name,
          applications: String(8 + (index % 7) * 3),
          revenueThisWeek: `₹${(revenue / 4).toFixed(1)}L`,
          margin: `${48 + (index % 5) * 3}%`,
          revenueMtd: client.revenue,
          targetedRevenueMtd: `₹${mtdTarget}L`,
          targetedYtdRevenue: `₹${ytdTarget}L`,
          pctOfTotal: `${Math.round((client.sharePercent / totalShare) * 100)}%`,
        }
      })
    }

    case 'outstanding_receivables_ageing': {
      const byBucket = new Map<string, string[]>()
      for (const row of data.collectionRows) {
        const label = row.ageBucket || '0–30'
        const list = byBucket.get(label) ?? []
        if (!list.includes(row.client)) list.push(row.client)
        byBucket.set(label, list)
      }
      const reasons: Record<string, string> = {
        '0–30': 'Within credit terms',
        '31–45': 'Awaiting client confirmation',
        '46–60': 'Partial payment scheduled',
        '61–90': 'Dispute / documentation pending',
        '90+': 'Escalated — credit hold review',
      }
      if (data.ageingBuckets.length > 0) {
        return data.ageingBuckets.map((bucket, index) => {
          const label = AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id
          const clients =
            byBucket.get(label)?.slice(0, 3).join(', ') ||
            data.collectionRows.slice(index, index + 2).map((r) => r.client).join(', ') ||
            '—'
          return {
            id: `ora-${index}`,
            agingBucket: label,
            clients,
            totalOutstanding: `₹${(bucket.amount / 100000).toFixed(1)}L`,
            reasons: reasons[label] ?? 'Follow-up in progress',
          }
        })
      }
      return Array.from(byBucket.entries()).map(([bucket, clients], index) => ({
        id: `ora-${index}`,
        agingBucket: bucket,
        clients: clients.slice(0, 4).join(', '),
        totalOutstanding: data.collectionRows.find((r) => r.ageBucket === bucket)?.outstandingAmount ?? '—',
        reasons: reasons[bucket] ?? 'Follow-up in progress',
      }))
    }

    case 'embassy_fee_working_capital': {
      return data.topCountries.slice(0, 8).map((country, index) => {
        const cases = 4 + (index % 5) * 2
        const avgDays = 8 + (index % 6)
        const blocked = Number.parseFloat(country.revenue.replace(/[₹,\sL]/gi, '')) || country.sharePercent
        return {
          id: `efwc-${country.id}`,
          country: country.name,
          totalBlocked: `₹${(blocked * 0.22).toFixed(1)}L`,
          cases: String(cases),
          avgDaysBlocked: String(avgDays),
          actualPaymentReceived: `₹${(blocked * 0.15).toFixed(1)}L`,
          oldestCaseDays: String(avgDays + 6 + (index % 4)),
        }
      })
    }

    case 'full_pl_vertical_breakdown': {
      return data.revenueBySegment.map((row, index) => {
        const revenue = Number.parseFloat(row.revenue.replace(/[₹,\sL]/gi, '')) || row.sharePercent
        const direct = Math.round(revenue * 0.42)
        const overhead = Math.round(revenue * 0.12)
        const ebitda = Math.round(revenue - direct - overhead)
        const variance = index % 2 === 0 ? 8 : 14
        return {
          id: `pl-${row.id}`,
          vertical: row.name,
          revenue: `₹${revenue}L`,
          directCost: `₹${direct}L`,
          overheadAllocation: `₹${overhead}L`,
          ebitda: `₹${ebitda}L`,
          vsPriorMonth: index % 2 === 0 ? '+3%' : '-1%',
          vsMtdTarget: `${92 + (index % 5)}%`,
          vsYtdTarget: `${88 + (index % 6)}%`,
          variance: `${variance}%`,
          note: variance > 10 ? 'Review overhead allocation & seasonality' : '—',
        }
      })
    }

    case 'revenue_forecast': {
      const base = data.revenueSnapshot.mtd
      return [
        {
          id: 'rf-m',
          period: 'Monthly',
          conservative: `₹${Math.round(base * 0.9)}L`,
          base: `₹${base}L`,
          optimistic: `₹${Math.round(base * 1.12)}L`,
          basis: 'Pipeline',
        },
        {
          id: 'rf-q',
          period: 'Quarterly',
          conservative: `₹${Math.round(base * 2.6)}L`,
          base: `₹${Math.round(base * 3)}L`,
          optimistic: `₹${Math.round(base * 3.4)}L`,
          basis: 'Approval Rate',
        },
        {
          id: 'rf-h',
          period: 'Half-Yearly',
          conservative: `₹${Math.round(base * 5.1)}L`,
          base: `₹${Math.round(base * 5.8)}L`,
          optimistic: `₹${Math.round(base * 6.6)}L`,
          basis: 'Seasonality',
        },
        {
          id: 'rf-y',
          period: 'Yearly',
          conservative: `₹${Math.round(data.revenueSnapshot.ytd * 0.95)}L`,
          base: `₹${data.revenueSnapshot.ytd}L`,
          optimistic: `₹${Math.round(data.revenueSnapshot.ytd * 1.18)}L`,
          basis: 'Pipeline + Seasonality',
        },
      ]
    }

    case 'client_wise_profitability': {
      return data.topClients.slice(0, 10).map((client, index) => {
        const revenue = Number.parseFloat(client.revenue.replace(/[₹,\sL]/gi, '')) || client.sharePercent
        const cost = Math.round(revenue * (0.4 + (index % 4) * 0.03))
        const gp = Math.round(revenue - cost)
        const margin = revenue ? Math.round((gp / revenue) * 100) : 0
        const trend = index % 3 === 0 ? '↑ Improving' : index % 3 === 1 ? '→ Flat' : '↓ Softening'
        return {
          id: `cwp-${client.id}`,
          client: client.name,
          revenue: client.revenue,
          directCost: `₹${cost}L`,
          grossProfit: `₹${gp}L`,
          grossMargin: `${margin}%`,
          trendVsLastMonth: trend,
        }
      })
    }

    case 'days_sales_outstanding': {
      const tiers = [
        ...data.revenueBySegment.map((s) => s.name),
        'Tier A clients',
        'Tier B clients',
      ]
      return tiers.slice(0, 6).map((label, index) => {
        const avgDays = 28 + (index % 5) * 7
        const target = 30 + (index % 3) * 15
        const delta = avgDays - target
        return {
          id: `dso-${index}`,
          verticalOrTier: label,
          avgDays: String(avgDays),
          sixMonthTrend: index % 2 === 0 ? 'Improving' : 'Worsening',
          vsTarget: `${delta >= 0 ? '+' : ''}${delta} vs ${target} credit days`,
        }
      })
    }

    case 'daily_invoice_report': {
      const fromVisa = data.visaSubmissionRows.map((row, index) => {
        const invoiced = row.invoiceReady === 'Yes'
        return {
          id: `dir-v-${row.id}`,
          caseId: row.caseId,
          client: row.client,
          invoiceStatus: invoiced ? 'Invoiced' : 'Not Invoiced',
          reason: invoiced ? '—' : 'Awaiting billing cycle / docs',
          daysSinceClosed: String(1 + (index % 8)),
        }
      })
      if (fromVisa.length > 0) return fromVisa
      return data.invoicePostingQueue.map((row, index) => {
        const invoiced = !row.status.toLowerCase().includes('pending')
        return {
          id: `dir-${row.id}`,
          caseId: row.invoiceNo,
          client: row.company,
          invoiceStatus: invoiced ? 'Invoiced' : 'Not Invoiced',
          reason: invoiced ? '—' : row.status,
          daysSinceClosed: String(2 + (index % 6)),
        }
      })
    }

    case 'credit_card_spend':
      return expenseRowsFromRecon(
        data,
        'credit_card',
        (c) => c.includes('credit') || c.includes('card'),
        'Payment mode: Credit card',
      )
    case 'insurance':
      return expenseRowsFromRecon(data, 'insurance', (c) => c.includes('insurance'), 'Insurance · vendor')
    case 'courier_cargo_delivery':
    case 'courier':
      return expenseRowsFromRecon(
        data,
        'courier',
        (c) => c.includes('courier') || c.includes('cargo') || c.includes('delivery'),
        'Mode of delivery',
      )
    case 'ticketing':
      return expenseRowsFromRecon(data, 'ticketing', (c) => c.includes('ticket'), 'Ticketing · vendor')
    case 'cash':
      return expenseRowsFromRecon(
        data,
        'cash',
        (c) => c.includes('cash') || c.includes('application'),
        'Payment mode: Cash',
      )

    case 'expense_refunds':
      return data.expenseRefundRows.map((row) => ({
        id: `erf-${row.id}`,
        applicationId: row.applicationId,
        passenger: row.passenger,
        expenseType: row.expenseType,
        refundAmount: row.refundAmount,
        paymentMode: row.paymentMode,
        status: row.status,
        requestedDate: row.requestedDate,
      }))

    case 'fund_pending':
      return data.fundAllocationRows
        .filter((row) => row.allocationStatus === 'Pending')
        .map((row) => ({
          id: `fp-${row.id}`,
          glNumber: row.glNumber,
          applicant: row.applicant,
          company: row.company,
          country: row.country,
          amount: row.amount,
          allocationStatus: row.allocationStatus,
          requestedBy: row.requestedBy,
        }))

    case 'fund_allocated':
      return data.fundAllocationRows
        .filter((row) => row.allocationStatus === 'Allocated')
        .map((row) => ({
          id: `fa-${row.id}`,
          glNumber: row.glNumber,
          applicant: row.applicant,
          company: row.company,
          country: row.country,
          amount: row.amount,
          allocationStatus: row.allocationStatus,
          requestedBy: row.requestedBy,
        }))

    case 'claim_sheets':
      return data.claimSheetRows.map((row) => ({
        id: `cs-${row.id}`,
        claimSheetNo: row.claimSheetNo,
        groundOpsUser: row.groundOpsUser,
        casesCount: String(row.casesCount),
        amount: row.amount,
        status: row.status,
        submittedDate: row.submittedDate,
        branch: row.branch,
      }))

    case 'vendor_awaiting_invoice':
      return data.vendorBillingRows.map((row) => ({
        id: `vai-${row.id}`,
        vendorName: row.vendorName,
        awaitingInvoiceCount: String(row.awaitingInvoiceCount),
        openBills: String(row.openBills),
        outstandingAmount: row.outstandingAmount,
        lastInvoiceDate: row.lastInvoiceDate,
        status: row.status,
      }))

    case 'invoice_exceptions':
      return data.invoiceExceptionRows.map((row) => ({
        id: `iex-${row.id}`,
        kindLabel: row.kindLabel,
        reference: row.reference,
        client: row.client,
        application: row.application,
        amount: row.amount,
        status: row.status,
        date: row.date,
      }))

    case 'invoiced_uninvoiced': {
      const fromExpense = data.expenseDailyRows.filter((row) => row.pack === 'invoiced_uninvoiced')
      if (fromExpense.length > 0) {
        return fromExpense.map((row) => ({
          id: `invu-exp-${row.id}`,
          caseOrInvoice: row.reference,
          client: row.vendor === '—' ? '—' : row.vendor,
          segment: row.detail,
          amount: row.amount,
          status: row.status,
          branch: '—',
        }))
      }
      return data.invoicePostingQueue.map((row) => ({
        id: `invu-${row.id}`,
        caseOrInvoice: row.invoiceNo,
        client: row.company,
        segment: row.billingType,
        amount: row.invoiceAmount,
        status: row.status,
        branch: row.branch,
      }))
    }

    case 'uninvoiced':
      return data.invoicePostingQueue.map((row) => ({
        id: `invu-${row.id}`,
        caseOrInvoice: row.invoiceNo,
        client: row.company,
        segment: row.billingType,
        amount: row.invoiceAmount,
        status: row.status,
        branch: row.branch,
      }))

    case 'visa_submission_status':
    case 'visa_submission_collection':
      return data.visaSubmissionRows.map((row) => ({
        id: `visa-${row.id}`,
        caseId: row.caseId,
        client: row.client,
        country: row.country,
        visaType: row.visaType,
        submissionStatus: row.submissionStatus,
        billingCycle: row.billingCycle,
        invoiceReady: row.invoiceReady,
      }))

    case 'pending_walkin_payments': {
      const walkIns = data.followUpRows.filter((row) =>
        row.clientType.toLowerCase().includes('walk'),
      )
      const source = walkIns.length > 0 ? walkIns : data.followUpRows.slice(0, 6)
      return source.map((row) => ({
        id: `walk-${row.id}`,
        client: row.client,
        invoiceNumber: row.invoiceNumber,
        outstandingAmount: row.outstandingAmount,
        followUpDate: row.followUpDate,
        status: row.status,
        assignedExecutive: row.assignedExecutive,
      }))
    }

    case 'follow_ups':
      return data.followUpRows.map((row) => ({
        id: `fu-${row.id}`,
        client: row.client,
        invoiceNumber: row.invoiceNumber,
        outstandingAmount: row.outstandingAmount,
        followUpDate: row.followUpDate,
        status: row.status,
        assignedExecutive: row.assignedExecutive,
      }))

    case 'ageing': {
      const total = data.ageingBuckets.reduce((sum, b) => sum + b.amount, 0) || 1
      return data.ageingBuckets.map((bucket, index) => ({
        id: `age-${index}`,
        bucket: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
        invoiceCount: String(bucket.count ?? Math.max(1, Math.round(bucket.amount / 50000))),
        amount: `₹${(bucket.amount / 100000).toFixed(1)}L`,
        sharePercent: `${Math.round((bucket.amount / total) * 100)}%`,
      }))
    }

    case 'collections':
    case 'collection_daily':
      return data.collectionRows.map((row) => ({
        id: `col-${row.id}`,
        invoiceNumber: row.invoiceNumber,
        client: row.client,
        amount: row.outstandingAmount,
        status: row.status,
        dueDate: row.dueDate,
        assignedExecutive: row.assignedExecutive,
      }))

    case 'collection_rate_vs_overdues':
      return [
        {
          id: 'rate-1',
          period: 'MTD',
          collectionRate: `${data.collectionSummary.collectionRate}%`,
          collected: data.collectionSummary.collected,
          overdue: data.collectionSummary.overdue,
          outstanding: data.collectionSummary.outstanding,
        },
        {
          id: 'rate-2',
          period: 'This month',
          collectionRate: `${Math.max(0, data.collectionSummary.collectionRate - 4)}%`,
          collected: data.collectionSummary.collected,
          overdue: data.collectionSummary.overdue,
          outstanding: data.collectionSummary.outstanding,
        },
      ]

    case 'invoice_posted': {
      const posted = data.invoiceRows.filter((row) => row.status.toLowerCase().includes('post'))
      const source = posted.length > 0 ? posted : data.invoiceRows.slice(0, 6)
      return source.map((row) => ({
        id: `posted-${row.id}`,
        invoiceNumber: row.invoiceNumber,
        client: row.client,
        amount: row.amount,
        status: row.status,
        date: row.invoiceDate,
        branch: row.application,
      }))
    }

    case 'overdue_invoices':
    case 'outstanding':
      return data.collectionRows
        .filter((row) =>
          reportType === 'overdue_invoices'
            ? row.status.toLowerCase().includes('overdue') ||
              row.ageBucket.includes('60') ||
              row.ageBucket.includes('90')
            : true,
        )
        .map((row) => ({
          id: `out-${row.id}`,
          invoiceNumber: row.invoiceNumber,
          client: row.client,
          amount: row.outstandingAmount,
          status: row.status,
          date: row.dueDate,
          branch: row.branch,
        }))

    case 'client_invoice_submissions':
      return data.invoiceSubmissions.map((row) => ({
        id: `sub-${row.id}`,
        company: row.company,
        submissionDate: row.submissionDate,
        billingCycle: row.billingCycle,
        status: row.status,
        branch: row.branch,
      }))

    case 'revenue':
    case 'revenue_vs_targets': {
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'MTD']
      const trend = data.revenueSnapshot.trend
      return labels.map((label, index) => {
        const actual = trend[Math.min(index, trend.length - 1)] ?? 40
        const target = Math.round(actual * (1.05 + (index % 3) * 0.02))
        const variance = actual - target
        const achievement = Math.round((actual / target) * 100)
        return {
          id: `rev-${index}`,
          label,
          actual: `₹${actual}L`,
          target: `₹${target}L`,
          variance: `${variance >= 0 ? '+' : ''}₹${variance}L`,
          achievement: `${achievement}%`,
        }
      })
    }

    case 'visa_count':
      return data.businessSegments.map((slice, index) => ({
        id: `vc-${index}`,
        segment: slice.label,
        country: data.countryDistribution[index % data.countryDistribution.length]?.label ?? '—',
        visaCount: String(Math.round(slice.value * 12 + 40)),
        period: 'Selected period',
      }))

    case 'top_country_revenue':
      return data.topCountries.map((row) => ({
        id: `tc-${row.id}`,
        rank: String(row.rank),
        name: row.name,
        revenue: row.revenue,
        sharePercent: `${row.sharePercent}%`,
      }))

    case 'top_client_revenue':
      return data.topClients.map((row) => ({
        id: `tcl-${row.id}`,
        rank: String(row.rank),
        name: row.name,
        revenue: row.revenue,
        sharePercent: `${row.sharePercent}%`,
      }))

    case 'revenue_by_segment':
      return data.revenueBySegment.map((row) => ({
        id: `seg-${row.id}`,
        rank: String(row.rank),
        name: row.name,
        revenue: row.revenue,
        sharePercent: `${row.sharePercent}%`,
      }))

    case 'submission_collection':
      return [
        {
          id: 'sc-1',
          metric: 'Visa submissions',
          submissions: String(data.visaSubmissionRows.length || 12),
          collections: String(
            Math.max(1, data.visaSubmissionRows.filter((r) => r.invoiceReady === 'Yes').length),
          ),
          value: data.collectionSummary.collected,
        },
        {
          id: 'sc-2',
          metric: 'Invoice submissions',
          submissions: String(data.invoiceSubmissions.length),
          collections: String(
            data.collectionRows.filter((r) => r.status.toLowerCase().includes('collect')).length ||
              3,
          ),
          value: data.collectionSummary.outstanding,
        },
      ]

    case 'vendor_costing':
    case 'vendor_payments': {
      if (data.vendorBillingRows.length > 0) {
        return data.vendorBillingRows.map((row) => ({
          id: `vp-${row.id}`,
          vendor: row.vendorName,
          service: `${row.awaitingInvoiceCount} awaiting · ${row.openBills} bills`,
          amount: row.outstandingAmount,
          dueDate: row.lastInvoiceDate,
          paymentStatus: row.status,
          branch: '—',
        }))
      }
      return data.vendorPayments.map((row) => ({
        id: `vp-${row.id}`,
        vendor: row.vendor,
        service: row.service,
        amount: row.amount,
        dueDate: row.dueDate,
        paymentStatus: row.paymentStatus,
        branch: row.branch,
      }))
    }

    case 'purchase_vs_revenue':
      return data.purchaseVsRevenue.trend.map((point, index) => {
        const margin = point.revenue - point.purchase
        return {
          id: `pvr-${index}`,
          label: point.label,
          revenue: String(point.revenue),
          purchase: String(point.purchase),
          margin: String(margin),
        }
      })

    case 'audit_log':
      return data.recentActivity.slice(0, 12).map((item, index) => ({
        id: `log-${item.id ?? index}`,
        timestamp: item.secondary?.split('·')[1]?.trim() ?? item.secondary ?? '—',
        user: item.secondary?.split('·')[0]?.trim() ?? 'Accounts',
        action: item.primary,
        reference: item.id,
        detail: item.badgeLabel ?? '',
      }))

    default:
      return []
  }
}
