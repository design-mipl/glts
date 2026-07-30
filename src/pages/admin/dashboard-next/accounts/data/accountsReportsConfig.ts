import type { Column } from '@/design-system/UIComponents'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import type { AccountsDashboardData } from '../types'

export type AccountsReportTypeId =
  // Reconciliation / expense daily
  | 'credit_card_spend'
  | 'insurance'
  | 'courier_cargo_delivery'
  | 'ticketing'
  | 'cash'
  | 'invoiced_uninvoiced'
  // Invoicing
  | 'visa_submission_status'
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
  | 'vendor_costing'
  | 'vendor_payments'
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
    id: 'credit_card_spend',
    label: 'Daily Credit Card Spend',
    category: 'Reconciliation',
    source: 'Expense module — payment mode = credit card.',
  },
  {
    id: 'insurance',
    label: 'Daily Insurance Report',
    category: 'Reconciliation',
    source: 'Expense module — insurance lines with vendor.',
  },
  {
    id: 'courier_cargo_delivery',
    label: 'Daily Courier / Cargo / Airport Delivery',
    category: 'Reconciliation',
    source: 'Expense module — mode of delivery.',
  },
  {
    id: 'ticketing',
    label: 'Daily Ticketing Report',
    category: 'Reconciliation',
    source: 'Expense module — ticketing lines with vendor.',
  },
  {
    id: 'cash',
    label: 'Daily Cash Report',
    category: 'Reconciliation',
    source: 'Expense module — payment mode = cash.',
  },
  {
    id: 'invoiced_uninvoiced',
    label: 'Daily Invoiced & Un-invoiced',
    category: 'Reconciliation',
    source: 'Billing and invoice submodule.',
  },
  {
    id: 'visa_submission_status',
    label: 'Visa Submission & Status (Invoice Ready)',
    category: 'Invoicing',
    source: 'Cases ready for invoice posting by billing cycle.',
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
    category: 'Analytics',
    source: 'Vendor cost breakdown by service.',
  },
  {
    id: 'vendor_payments',
    label: 'Vendor Payments Report',
    category: 'Analytics',
    source: 'Vendor payables due and paid.',
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
        detail: row.detail,
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
    case 'vendor_payments':
      return data.vendorPayments.map((row) => ({
        id: `vp-${row.id}`,
        vendor: row.vendor,
        service: row.service,
        amount: row.amount,
        dueDate: row.dueDate,
        paymentStatus: row.paymentStatus,
        branch: row.branch,
      }))

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
