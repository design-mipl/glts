export type AccountsCustomerType = 'retail' | 'corporate' | 'marine' | 'b2b'
export type AccountsTrend = 'up' | 'down' | 'flat'
export type AccountsAlertPriority = 'critical' | 'high' | 'medium'
export type AccountsBusinessSegment = 'marine' | 'corporate' | 'retail' | 'b2b'

export interface AccountsDashboardFilters {
  dateRange: [Date | null, Date | null]
  branch: string
  customerType: string
  company: string
  invoiceStatus: string
}

export const DEFAULT_ACCOUNTS_DASHBOARD_FILTERS: AccountsDashboardFilters = {
  dateRange: [null, null],
  branch: 'all',
  customerType: 'all',
  company: 'all',
  invoiceStatus: 'all',
}

export const ACCOUNTS_BRANCH_OPTIONS = [
  { label: 'All branches', value: 'all' },
  { label: 'Mumbai HQ', value: 'Mumbai HQ' },
  { label: 'Delhi NCR', value: 'Delhi NCR' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Bengaluru', value: 'Bengaluru' },
]

export const ACCOUNTS_CUSTOMER_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B', value: 'b2b' },
]

export const ACCOUNTS_COMPANY_OPTIONS = [
  { label: 'All companies', value: 'all' },
  { label: 'Maersk Line India', value: 'Maersk Line India' },
  { label: 'Tata Consultancy Services', value: 'Tata Consultancy Services' },
  { label: 'Reliance Industries', value: 'Reliance Industries' },
  { label: 'MSC Crew Services', value: 'MSC Crew Services' },
  { label: 'Infosys Limited', value: 'Infosys Limited' },
]

export const ACCOUNTS_INVOICE_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Posted', value: 'posted' },
  { label: 'Partially paid', value: 'partially_paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Paid', value: 'paid' },
]

export const MOCK_ACCOUNTS_EXECUTIVE_NAME = 'Priya Desai'

export interface AccountsKpiMetric {
  id: string
  label: string
  primaryValue: string
  comparisonLabel: string
  comparisonValue: string
  trend: AccountsTrend
  accent: 'primary' | 'success' | 'warning' | 'error' | 'info'
  iconKey: string
  href: string
}

export interface PendingCollectionRow {
  id: string
  invoiceNumber: string
  company: string
  customer: string
  invoiceDate: string
  dueDate: string
  outstandingAmount: string
  outstandingAmountSort: number
  ageingBucket: string
  followUpDate: string
  followUpDateSort: number
  assignedExecutive: string
  status: string
  isOverdue: boolean
  overdueDays: number
  branch: string
  customerType: AccountsCustomerType
  invoiceStatus: string
  invoiceHref: string
}

export interface InvoicePostingRow {
  id: string
  invoiceNo: string
  company: string
  billingType: string
  invoiceAmount: string
  status: string
  branch: string
  customerType: AccountsCustomerType
}

export interface VendorPaymentRow {
  id: string
  vendor: string
  service: string
  amount: string
  dueDate: string
  dueDateSort: number
  paymentStatus: string
  branch: string
}

export interface ReconciliationRow {
  id: string
  referenceNo: string
  payment: string
  invoice: string
  difference: string
  status: string
  branch: string
}

export interface OutstandingCollectionRow {
  id: string
  company: string
  invoice: string
  outstandingAmount: string
  followUpDate: string
  collectionStatus: string
  assignedExecutive: string
  branch: string
  customerType: AccountsCustomerType
}

export interface InvoiceSubmissionRow {
  id: string
  company: string
  submissionDate: string
  submissionDateSort: number
  billingCycle: string
  status: string
  branch: string
}

export interface RevenueOverviewSnapshot {
  today: string
  week: string
  month: string
  monthToDate: string
  yearToDate: string
}

export interface CollectionPerformanceSnapshot {
  collectionPercent: number
  outstandingPercent: number
  overduePercent: number
  monthlyTrend: { label: string; value: number }[]
}

export interface AgeingBucketSlice {
  key: string
  label: string
  value: number
  amount: string
}

export interface TopRevenueRow {
  id: string
  rank: number
  name: string
  revenue: string
  revenueSort: number
  sharePercent: number
}

export interface PurchaseVsRevenueSnapshot {
  purchaseCost: string
  vendorCost: string
  revenue: string
  profitMargin: string
  profitMarginPercent: number
  trend: { label: string; revenue: number; purchase: number }[]
}

export interface DailyReportCard {
  id: string
  name: string
  lastGenerated: string
  reportKey: string
}

export interface FinancialAlert {
  id: string
  title: string
  count: number
  oldestPending: string
  priority: AccountsAlertPriority
}

export interface AccountsActivityRow {
  id: string
  timestamp: string
  timestampSort: number
  user: string
  action: string
  reference: string
}

export const ACCOUNTS_KPIS: AccountsKpiMetric[] = [
  {
    id: 'revenue-today',
    label: 'Revenue today',
    primaryValue: '₹12.4L',
    comparisonLabel: 'vs yesterday',
    comparisonValue: '+8.2%',
    trend: 'up',
    accent: 'success',
    iconKey: 'revenue',
    href: '/admin/finance/invoices?filter=revenue-today',
  },
  {
    id: 'outstanding-collections',
    label: 'Outstanding collections',
    primaryValue: '₹48.6L',
    comparisonLabel: 'vs last week',
    comparisonValue: '-3.1%',
    trend: 'down',
    accent: 'warning',
    iconKey: 'collections',
    href: '/admin/finance/invoices?filter=outstanding',
  },
  {
    id: 'pending-invoices',
    label: 'Pending invoices',
    primaryValue: '34',
    comparisonLabel: 'vs previous period',
    comparisonValue: '+5',
    trend: 'up',
    accent: 'info',
    iconKey: 'invoice',
    href: '/admin/finance/invoices?filter=pending',
  },
  {
    id: 'pending-reconciliation',
    label: 'Pending reconciliation',
    primaryValue: '12',
    comparisonLabel: 'vs previous period',
    comparisonValue: '-2',
    trend: 'down',
    accent: 'primary',
    iconKey: 'reconcile',
    href: '/admin/finance/invoices?filter=reconciliation',
  },
  {
    id: 'vendor-payments-pending',
    label: 'Vendor payments pending',
    primaryValue: '₹6.8L',
    comparisonLabel: 'vs last month',
    comparisonValue: '+12%',
    trend: 'up',
    accent: 'warning',
    iconKey: 'vendor',
    href: '/admin/finance/vendor-billing?filter=pending',
  },
  {
    id: 'collections-today',
    label: 'Collections today',
    primaryValue: '₹9.2L',
    comparisonLabel: 'vs target',
    comparisonValue: '92%',
    trend: 'flat',
    accent: 'success',
    iconKey: 'collection',
    href: '/admin/finance/invoices?filter=collections-today',
  },
  {
    id: 'monthly-collection-rate',
    label: 'Monthly collection rate',
    primaryValue: '87%',
    comparisonLabel: 'vs last month',
    comparisonValue: '+2.4%',
    trend: 'up',
    accent: 'primary',
    iconKey: 'rate',
    href: '/admin/finance/invoices?filter=collection-rate',
  },
  {
    id: 'overdue-invoices',
    label: 'Overdue invoices',
    primaryValue: '18',
    comparisonLabel: 'vs previous period',
    comparisonValue: '+3',
    trend: 'up',
    accent: 'error',
    iconKey: 'overdue',
    href: '/admin/finance/invoices?filter=overdue',
  },
]

export const PENDING_COLLECTIONS: PendingCollectionRow[] = [
  {
    id: 'pc-1',
    invoiceNumber: 'INV-2026-0412',
    company: 'Maersk Line India',
    customer: 'Capt. Rajesh Nair',
    invoiceDate: '12 Mar 2026',
    dueDate: '22 Mar 2026',
    outstandingAmount: '₹1,24,500',
    outstandingAmountSort: 124500,
    ageingBucket: '30 Days',
    followUpDate: '01 Jul 2026',
    followUpDateSort: 20260701,
    assignedExecutive: 'Priya Desai',
    status: 'Overdue',
    isOverdue: true,
    overdueDays: 10,
    branch: 'Mumbai HQ',
    customerType: 'marine',
    invoiceStatus: 'overdue',
    invoiceHref: '/admin/finance/invoices/inv-2026-0412',
  },
  {
    id: 'pc-2',
    invoiceNumber: 'INV-2026-0388',
    company: 'Tata Consultancy Services',
    customer: 'Anita Verma',
    invoiceDate: '05 Mar 2026',
    dueDate: '20 Mar 2026',
    outstandingAmount: '₹86,200',
    outstandingAmountSort: 86200,
    ageingBucket: '45 Days',
    followUpDate: '28 Jun 2026',
    followUpDateSort: 20260628,
    assignedExecutive: 'Priya Desai',
    status: 'Follow-up due',
    isOverdue: true,
    overdueDays: 12,
    branch: 'Mumbai HQ',
    customerType: 'corporate',
    invoiceStatus: 'overdue',
    invoiceHref: '/admin/finance/invoices/inv-2026-0388',
  },
  {
    id: 'pc-3',
    invoiceNumber: 'INV-2026-0455',
    company: 'Reliance Industries',
    customer: 'Vikram Shah',
    invoiceDate: '18 Mar 2026',
    dueDate: '02 Apr 2026',
    outstandingAmount: '₹2,10,000',
    outstandingAmountSort: 210000,
    ageingBucket: '30 Days',
    followUpDate: '02 Jul 2026',
    followUpDateSort: 20260702,
    assignedExecutive: 'Rahul Mehta',
    status: 'Partially paid',
    isOverdue: true,
    overdueDays: 5,
    branch: 'Delhi NCR',
    customerType: 'corporate',
    invoiceStatus: 'partially_paid',
    invoiceHref: '/admin/finance/invoices/inv-2026-0455',
  },
  {
    id: 'pc-4',
    invoiceNumber: 'INV-2026-0501',
    company: 'MSC Crew Services',
    customer: 'Officer Maria Lopez',
    invoiceDate: '25 Mar 2026',
    dueDate: '10 Apr 2026',
    outstandingAmount: '₹54,800',
    outstandingAmountSort: 54800,
    ageingBucket: '30 Days',
    followUpDate: '01 Jul 2026',
    followUpDateSort: 20260701,
    assignedExecutive: 'Priya Desai',
    status: 'Awaiting payment',
    isOverdue: false,
    overdueDays: 0,
    branch: 'Chennai',
    customerType: 'marine',
    invoiceStatus: 'posted',
    invoiceHref: '/admin/finance/invoices/inv-2026-0501',
  },
  {
    id: 'pc-5',
    invoiceNumber: 'INV-2026-0520',
    company: 'Infosys Limited',
    customer: 'Deepak Rao',
    invoiceDate: '28 Mar 2026',
    dueDate: '15 Apr 2026',
    outstandingAmount: '₹1,45,600',
    outstandingAmountSort: 145600,
    ageingBucket: '30 Days',
    followUpDate: '03 Jul 2026',
    followUpDateSort: 20260703,
    assignedExecutive: 'Sneha Patel',
    status: 'Payment promised',
    isOverdue: false,
    overdueDays: 0,
    branch: 'Bengaluru',
    customerType: 'b2b',
    invoiceStatus: 'posted',
    invoiceHref: '/admin/finance/invoices/inv-2026-0520',
  },
  {
    id: 'pc-6',
    invoiceNumber: 'INV-2026-0310',
    company: 'Maersk Line India',
    customer: 'Chief Eng. Tom Hansen',
    invoiceDate: '20 Feb 2026',
    dueDate: '05 Mar 2026',
    outstandingAmount: '₹98,400',
    outstandingAmountSort: 98400,
    ageingBucket: '90 Days',
    followUpDate: '25 Jun 2026',
    followUpDateSort: 20260625,
    assignedExecutive: 'Priya Desai',
    status: 'Escalated',
    isOverdue: true,
    overdueDays: 27,
    branch: 'Mumbai HQ',
    customerType: 'marine',
    invoiceStatus: 'overdue',
    invoiceHref: '/admin/finance/invoices/inv-2026-0310',
  },
]

export const INVOICE_POSTING_QUEUE: InvoicePostingRow[] = [
  {
    id: 'ip-1',
    invoiceNo: 'DRF-2026-0891',
    company: 'Tata Consultancy Services',
    billingType: 'Corporate monthly',
    invoiceAmount: '₹3,42,000',
    status: 'Awaiting approval',
    branch: 'Mumbai HQ',
    customerType: 'corporate',
  },
  {
    id: 'ip-2',
    invoiceNo: 'DRF-2026-0894',
    company: 'MSC Crew Services',
    billingType: 'Per application',
    invoiceAmount: '₹68,500',
    status: 'Ready to post',
    branch: 'Chennai',
    customerType: 'marine',
  },
  {
    id: 'ip-3',
    invoiceNo: 'DRF-2026-0901',
    company: 'Reliance Industries',
    billingType: 'Corporate monthly',
    invoiceAmount: '₹5,10,200',
    status: 'Validation pending',
    branch: 'Delhi NCR',
    customerType: 'corporate',
  },
]

export const VENDOR_PAYMENTS: VendorPaymentRow[] = [
  {
    id: 'vp-1',
    vendor: 'VFS Global',
    service: 'Visa facilitation',
    amount: '₹1,24,000',
    dueDate: '02 Jul 2026',
    dueDateSort: 20260702,
    paymentStatus: 'Due today',
    branch: 'Mumbai HQ',
  },
  {
    id: 'vp-2',
    vendor: 'Blue Dart Express',
    service: 'Courier logistics',
    amount: '₹18,600',
    dueDate: '05 Jul 2026',
    dueDateSort: 20260705,
    paymentStatus: 'Scheduled',
    branch: 'Mumbai HQ',
  },
  {
    id: 'vp-3',
    vendor: 'UK Visa Application Centre',
    service: 'Embassy fees',
    amount: '₹2,45,800',
    dueDate: '01 Jul 2026',
    dueDateSort: 20260701,
    paymentStatus: 'Overdue',
    branch: 'Delhi NCR',
  },
]

export const RECONCILIATION_QUEUE: ReconciliationRow[] = [
  {
    id: 'rq-1',
    referenceNo: 'RCN-2026-0142',
    payment: '₹1,24,500',
    invoice: 'INV-2026-0412',
    difference: '₹0',
    status: 'Matched',
    branch: 'Mumbai HQ',
  },
  {
    id: 'rq-2',
    referenceNo: 'RCN-2026-0145',
    payment: '₹80,000',
    invoice: 'INV-2026-0388',
    difference: '₹6,200',
    status: 'Variance',
    branch: 'Mumbai HQ',
  },
  {
    id: 'rq-3',
    referenceNo: 'RCN-2026-0148',
    payment: '₹2,10,000',
    invoice: 'INV-2026-0455',
    difference: '₹0',
    status: 'Pending review',
    branch: 'Delhi NCR',
  },
]

export const OUTSTANDING_COLLECTIONS: OutstandingCollectionRow[] = [
  {
    id: 'oc-1',
    company: 'Maersk Line India',
    invoice: 'INV-2026-0412',
    outstandingAmount: '₹1,24,500',
    followUpDate: '01 Jul 2026',
    collectionStatus: 'Overdue',
    assignedExecutive: 'Priya Desai',
    branch: 'Mumbai HQ',
    customerType: 'marine',
  },
  {
    id: 'oc-2',
    company: 'Tata Consultancy Services',
    invoice: 'INV-2026-0388',
    outstandingAmount: '₹86,200',
    followUpDate: '28 Jun 2026',
    collectionStatus: 'Follow-up scheduled',
    assignedExecutive: 'Priya Desai',
    branch: 'Mumbai HQ',
    customerType: 'corporate',
  },
  {
    id: 'oc-3',
    company: 'Reliance Industries',
    invoice: 'INV-2026-0455',
    outstandingAmount: '₹2,10,000',
    followUpDate: '02 Jul 2026',
    collectionStatus: 'Partial payment',
    assignedExecutive: 'Rahul Mehta',
    branch: 'Delhi NCR',
    customerType: 'corporate',
  },
]

export const INVOICE_SUBMISSIONS: InvoiceSubmissionRow[] = [
  {
    id: 'is-1',
    company: 'Tata Consultancy Services',
    submissionDate: '01 Jul 2026',
    submissionDateSort: 20260701,
    billingCycle: 'Monthly',
    status: 'Due today',
    branch: 'Mumbai HQ',
  },
  {
    id: 'is-2',
    company: 'Infosys Limited',
    submissionDate: '03 Jul 2026',
    submissionDateSort: 20260703,
    billingCycle: 'Monthly',
    status: 'Scheduled',
    branch: 'Bengaluru',
  },
  {
    id: 'is-3',
    company: 'Maersk Line India',
    submissionDate: '05 Jul 2026',
    submissionDateSort: 20260705,
    billingCycle: 'Fortnightly',
    status: 'Draft ready',
    branch: 'Mumbai HQ',
  },
  {
    id: 'is-4',
    company: 'MSC Crew Services',
    submissionDate: '08 Jul 2026',
    submissionDateSort: 20260708,
    billingCycle: 'Per voyage',
    status: 'Pending data',
    branch: 'Chennai',
  },
  {
    id: 'is-5',
    company: 'Reliance Industries',
    submissionDate: '10 Jul 2026',
    submissionDateSort: 20260710,
    billingCycle: 'Monthly',
    status: 'Scheduled',
    branch: 'Delhi NCR',
  },
]

export const REVENUE_OVERVIEW: RevenueOverviewSnapshot = {
  today: '₹12.4L',
  week: '₹68.2L',
  month: '₹2.84Cr',
  monthToDate: '₹1.42Cr',
  yearToDate: '₹18.6Cr',
}

export const COLLECTION_PERFORMANCE: CollectionPerformanceSnapshot = {
  collectionPercent: 87,
  outstandingPercent: 9,
  overduePercent: 4,
  monthlyTrend: [
    { label: 'Jan', value: 82 },
    { label: 'Feb', value: 84 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 83 },
    { label: 'May', value: 86 },
    { label: 'Jun', value: 87 },
  ],
}

export const AGEING_ANALYSIS: AgeingBucketSlice[] = [
  { key: '30', label: '30 Days', value: 42, amount: '₹18.2L' },
  { key: '45', label: '45 Days', value: 28, amount: '₹12.6L' },
  { key: '60', label: '60 Days', value: 18, amount: '₹9.4L' },
  { key: '90', label: '90 Days', value: 12, amount: '₹5.8L' },
  { key: '180', label: '180+ Days', value: 6, amount: '₹2.6L' },
]

export const TOP_CLIENTS: TopRevenueRow[] = [
  { id: 'tc-1', rank: 1, name: 'Tata Consultancy Services', revenue: '₹42.8L', revenueSort: 4280000, sharePercent: 18 },
  { id: 'tc-2', rank: 2, name: 'Maersk Line India', revenue: '₹38.4L', revenueSort: 3840000, sharePercent: 16 },
  { id: 'tc-3', rank: 3, name: 'Reliance Industries', revenue: '₹31.2L', revenueSort: 3120000, sharePercent: 13 },
  { id: 'tc-4', rank: 4, name: 'Infosys Limited', revenue: '₹24.6L', revenueSort: 2460000, sharePercent: 10 },
  { id: 'tc-5', rank: 5, name: 'MSC Crew Services', revenue: '₹18.9L', revenueSort: 1890000, sharePercent: 8 },
]

export const TOP_COUNTRIES: TopRevenueRow[] = [
  { id: 'tco-1', rank: 1, name: 'United Kingdom', revenue: '₹28.4L', revenueSort: 2840000, sharePercent: 22 },
  { id: 'tco-2', rank: 2, name: 'United States', revenue: '₹24.1L', revenueSort: 2410000, sharePercent: 19 },
  { id: 'tco-3', rank: 3, name: 'Singapore', revenue: '₹16.8L', revenueSort: 1680000, sharePercent: 13 },
  { id: 'tco-4', rank: 4, name: 'United Arab Emirates', revenue: '₹12.2L', revenueSort: 1220000, sharePercent: 10 },
  { id: 'tco-5', rank: 5, name: 'Germany', revenue: '₹9.6L', revenueSort: 960000, sharePercent: 7 },
]

export const REVENUE_BY_SEGMENT: TopRevenueRow[] = [
  { id: 'rs-1', rank: 1, name: 'Marine', revenue: '₹52.4L', revenueSort: 5240000, sharePercent: 35 },
  { id: 'rs-2', rank: 2, name: 'Corporate', revenue: '₹48.6L', revenueSort: 4860000, sharePercent: 32 },
  { id: 'rs-3', rank: 3, name: 'B2B', revenue: '₹32.8L', revenueSort: 3280000, sharePercent: 22 },
  { id: 'rs-4', rank: 4, name: 'Retail', revenue: '₹16.2L', revenueSort: 1620000, sharePercent: 11 },
]

export const PURCHASE_VS_REVENUE: PurchaseVsRevenueSnapshot = {
  purchaseCost: '₹68.4L',
  vendorCost: '₹42.6L',
  revenue: '₹1.42Cr',
  profitMargin: '₹30.8L',
  profitMarginPercent: 22,
  trend: [
    { label: 'Jan', revenue: 118, purchase: 92 },
    { label: 'Feb', revenue: 124, purchase: 96 },
    { label: 'Mar', revenue: 132, purchase: 98 },
    { label: 'Apr', revenue: 128, purchase: 100 },
    { label: 'May', revenue: 138, purchase: 104 },
    { label: 'Jun', revenue: 142, purchase: 108 },
  ],
}

export const DAILY_REPORTS: DailyReportCard[] = [
  { id: 'dr-1', name: 'Daily invoice posted', lastGenerated: '01 Jul 2026, 08:30', reportKey: 'daily-invoice-posted' },
  { id: 'dr-2', name: 'Daily un-invoiced cases', lastGenerated: '01 Jul 2026, 08:45', reportKey: 'daily-uninvoiced' },
  { id: 'dr-3', name: 'Courier report', lastGenerated: '01 Jul 2026, 09:00', reportKey: 'courier' },
  { id: 'dr-4', name: 'Visa submission report', lastGenerated: '01 Jul 2026, 09:15', reportKey: 'visa-submission' },
  { id: 'dr-5', name: 'Collection report', lastGenerated: '01 Jul 2026, 09:30', reportKey: 'collection' },
  { id: 'dr-6', name: 'Outstanding report', lastGenerated: '01 Jul 2026, 09:45', reportKey: 'outstanding' },
  { id: 'dr-7', name: 'Vendor payment report', lastGenerated: '01 Jul 2026, 10:00', reportKey: 'vendor-payment' },
  { id: 'dr-8', name: 'Revenue report', lastGenerated: '01 Jul 2026, 10:15', reportKey: 'revenue' },
  { id: 'dr-9', name: 'Visa count report', lastGenerated: '01 Jul 2026, 10:30', reportKey: 'visa-count' },
  { id: 'dr-10', name: 'Log report', lastGenerated: '01 Jul 2026, 10:45', reportKey: 'log' },
]

export const FINANCIAL_ALERTS: FinancialAlert[] = [
  { id: 'fa-1', title: 'Overdue invoices', count: 18, oldestPending: '27 days', priority: 'critical' },
  { id: 'fa-2', title: 'Pending reconciliation', count: 12, oldestPending: '4 days', priority: 'high' },
  { id: 'fa-3', title: 'Vendor payments due', count: 8, oldestPending: '2 days', priority: 'high' },
  { id: 'fa-4', title: 'Collection follow-ups due', count: 14, oldestPending: '1 day', priority: 'medium' },
  { id: 'fa-5', title: 'Credit limit exceeded', count: 3, oldestPending: '6 days', priority: 'critical' },
  { id: 'fa-6', title: 'Invoice submission due today', count: 5, oldestPending: 'Today', priority: 'high' },
]

export const ACCOUNTS_ACTIVITY_TODAY: AccountsActivityRow[] = [
  {
    id: 'aa-1',
    timestamp: '01 Jul 2026, 10:42',
    timestampSort: 202607011042,
    user: 'Priya Desai',
    action: 'Payment recorded',
    reference: 'INV-2026-0501',
  },
  {
    id: 'aa-2',
    timestamp: '01 Jul 2026, 10:18',
    timestampSort: 202607011018,
    user: 'Priya Desai',
    action: 'Invoice posted',
    reference: 'DRF-2026-0888',
  },
  {
    id: 'aa-3',
    timestamp: '01 Jul 2026, 09:55',
    timestampSort: 202607010955,
    user: 'Priya Desai',
    action: 'Collection updated',
    reference: 'INV-2026-0388',
  },
  {
    id: 'aa-4',
    timestamp: '01 Jul 2026, 09:30',
    timestampSort: 202607010930,
    user: 'Priya Desai',
    action: 'Reconciliation completed',
    reference: 'RCN-2026-0142',
  },
  {
    id: 'aa-5',
    timestamp: '01 Jul 2026, 09:05',
    timestampSort: 202607010905,
    user: 'Priya Desai',
    action: 'Vendor paid',
    reference: 'VFS Global — ₹1,24,000',
  },
]
