import type { AccountsDashboardData, AccountsDashboardFilters } from '../types'
import { AGEING_BUCKET_IDS } from '../../shared/config/ageingBuckets'

export const ACCOUNTS_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
]

export const ACCOUNTS_BRANCH_OPTIONS = [
  { label: 'All branches', value: 'all' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Chennai', value: 'chennai' },
]

export const ACCOUNTS_SEGMENT_OPTIONS = [
  { label: 'All segments', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B', value: 'b2b' },
]

export const ACCOUNTS_CLIENT_OPTIONS = [
  { label: 'All clients', value: 'all' },
  { label: 'BrightCorp India', value: 'brightcorp' },
  { label: 'Horizon Logistics', value: 'horizon' },
  { label: 'Nordic Marine Ltd', value: 'nordic' },
]

export const ACCOUNTS_INVOICE_STATUS_OPTIONS = [
  { label: 'All invoice statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Posted', value: 'posted' },
  { label: 'Awaiting approval', value: 'awaiting-approval' },
]

export const ACCOUNTS_COLLECTION_STATUS_OPTIONS = [
  { label: 'All collection statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Partial', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Collected', value: 'collected' },
]

export const ACCOUNTS_VENDOR_OPTIONS = [
  { label: 'All vendors', value: 'all' },
  { label: 'BlueDart', value: 'bluedart' },
  { label: 'VFS Global', value: 'vfs' },
  { label: 'HDFC Cards', value: 'hdfc' },
]

export const ACCOUNTS_COUNTRY_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'UAE', value: 'uae' },
  { label: 'Schengen', value: 'schengen' },
  { label: 'UK', value: 'uk' },
  { label: 'USA', value: 'us' },
]

export const DEFAULT_ACCOUNTS_DASHBOARD_FILTERS: AccountsDashboardFilters = {
  date: 'month',
  branch: 'all',
  segment: 'all',
  client: 'all',
  invoiceStatus: 'all',
  collectionStatus: 'all',
  vendor: 'all',
  country: 'all',
  search: '',
}

export const ACCOUNTS_DASHBOARD_MOCK: AccountsDashboardData = {
  quickStats: [
    {
      id: 'today-revenue',
      label: "Today's revenue",
      value: '₹1.8L',
      delta: 4.2,
      deltaLabel: 'vs yesterday',
      sparklineData: [1.2, 1.4, 1.5, 1.3, 1.6, 1.7, 1.8],
    },
    {
      id: 'outstanding',
      label: 'Outstanding',
      value: '₹86.4L',
      delta: -2.1,
      deltaLabel: 'vs last week',
      sparklineData: [92, 90, 89, 88, 87, 86.5, 86.4],
    },
    {
      id: 'pending-collections',
      label: 'Pending collections',
      value: 64,
      delta: 3.0,
      deltaLabel: 'open cases',
      sparklineData: [58, 60, 61, 62, 63, 64, 64],
    },
    {
      id: 'pending-recon',
      label: 'Pending reconciliation',
      value: 18,
      delta: -5.5,
      deltaLabel: 'vs yesterday',
      sparklineData: [24, 22, 21, 20, 19, 18, 18],
    },
  ],
  notifications: [
    {
      id: 'fn-1',
      title: 'Vendor payment due today — BlueDart',
      body: '₹2.4L courier charges awaiting release.',
      unread: true,
      createdAt: '15 min ago',
    },
    {
      id: 'fn-2',
      title: 'Overdue collections crossed threshold',
      body: '12 invoices in 90+ bucket need escalation.',
      unread: true,
      createdAt: '1 hr ago',
    },
    {
      id: 'fn-3',
      title: 'Credit card utilization at 78%',
      body: 'HDFC corporate cards nearing soft limit.',
      unread: false,
      createdAt: '3 hr ago',
    },
  ],
  revenueSnapshot: {
    todayRevenue: '₹1.8L',
    monthlyRevenue: '₹42.8L',
    growthPercent: 6.3,
    trend: [28, 30, 32, 35, 38, 40, 43],
  },
  collectionSummary: {
    outstanding: '₹86.4L',
    collected: '₹31.2L',
    overdue: '₹18.7L',
    collectionRate: 72,
  },
  ageingBuckets: AGEING_BUCKET_IDS.map((id, index) => ({
    id,
    amount: [24.2, 18.5, 14.1, 29.6][index] * 100000,
    count: [22, 16, 11, 15][index],
  })),
  recentActivity: [
    {
      id: 'fa-1',
      primary: 'INV-9921 posted for BrightCorp India',
      secondary: 'Accounts · 20 min ago',
      badgeLabel: 'Posted',
      badgeColor: 'success',
    },
    {
      id: 'fa-2',
      primary: 'Collection reminder sent — Horizon Logistics',
      secondary: 'Collections · 45 min ago',
      badgeLabel: 'Follow-up',
      badgeColor: 'info',
    },
    {
      id: 'fa-3',
      primary: 'Vendor bill VB-441 awaiting approval',
      secondary: 'AP · 2 hr ago',
      badgeLabel: 'Vendor',
      badgeColor: 'warning',
    },
  ],
  quickActions: [
    {
      id: 'qa-invoices',
      title: 'Billing & invoices',
      description: 'Open invoice workspace.',
      badge: 'Invoices',
      href: '/admin/finance/invoices',
    },
    {
      id: 'qa-collections',
      title: 'Outstanding cases',
      description: 'Review receivables via invoices.',
      badge: 'Collections',
      href: '/admin/finance/invoices',
    },
    {
      id: 'qa-vendor',
      title: 'Vendor payments',
      description: 'Vendor billing & payables.',
      badge: 'Vendors',
      href: '/admin/finance/vendor-billing',
    },
    {
      id: 'qa-expenses',
      title: 'Credit cards & expenses',
      description: 'Expense management workspace.',
      badge: 'Cards',
      href: '/admin/finance/expenses',
    },
    {
      id: 'qa-funds',
      title: 'Fund allocation',
      description: 'Allocate and track funds.',
      badge: 'Funds',
      href: '/admin/finance/fund-allocation',
    },
    {
      id: 'qa-accounts-legacy',
      title: 'Accounts workspace',
      description: 'Legacy accounts dashboard.',
      badge: 'Reports',
      href: '/admin/dashboard/accounts',
    },
  ],
  collectionRows: [
    {
      id: 'col-1',
      invoiceNumber: 'INV-9901',
      client: 'BrightCorp India',
      branch: 'Mumbai',
      outstandingAmount: '₹4.8L',
      dueDate: '18 Jul',
      ageBucket: '31–60',
      status: 'Overdue',
      assignedExecutive: 'Neha Patel',
    },
    {
      id: 'col-2',
      invoiceNumber: 'INV-9910',
      client: 'Horizon Logistics',
      branch: 'Delhi',
      outstandingAmount: '₹2.1L',
      dueDate: '22 Jul',
      ageBucket: '0–30',
      status: 'Open',
      assignedExecutive: 'Arjun Mehta',
    },
    {
      id: 'col-3',
      invoiceNumber: 'INV-9888',
      client: 'Nordic Marine Ltd',
      branch: 'Chennai',
      outstandingAmount: '₹6.4L',
      dueDate: '02 Jun',
      ageBucket: '90+',
      status: 'Overdue',
      assignedExecutive: 'Priya Nair',
    },
    {
      id: 'col-4',
      invoiceNumber: 'INV-9920',
      client: 'BrightCorp India',
      branch: 'Bengaluru',
      outstandingAmount: '₹0.9L',
      dueDate: '25 Jul',
      ageBucket: '0–30',
      status: 'Partial',
      assignedExecutive: 'Neha Patel',
    },
  ],
  invoiceStats: [
    { id: 'inv-pending', label: 'Pending', value: 14, sparklineData: [10, 11, 12, 13, 14, 14, 14] },
    { id: 'inv-approved', label: 'Approved', value: 22, sparklineData: [18, 19, 20, 21, 21, 22, 22] },
    { id: 'inv-posted', label: 'Posted', value: 48, sparklineData: [40, 42, 44, 45, 46, 47, 48] },
    {
      id: 'inv-awaiting',
      label: 'Awaiting approval',
      value: 9,
      sparklineData: [12, 11, 10, 10, 9, 9, 9],
    },
  ],
  invoiceRows: [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-9921',
      client: 'BrightCorp India',
      application: 'GLT-24081',
      invoiceDate: '21 Jul',
      amount: '₹1.2L',
      status: 'Posted',
      approval: 'Approved',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-9924',
      client: 'Horizon Logistics',
      application: 'GLT-24077',
      invoiceDate: '21 Jul',
      amount: '₹0.8L',
      status: 'Pending',
      approval: 'Awaiting approval',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-9925',
      client: 'Nordic Marine Ltd',
      application: 'GLT-24070',
      invoiceDate: '20 Jul',
      amount: '₹2.4L',
      status: 'Approved',
      approval: 'Approved',
    },
    {
      id: 'inv-4',
      invoiceNumber: 'INV-9918',
      client: 'Retail walk-in',
      application: 'GLT-24065',
      invoiceDate: '19 Jul',
      amount: '₹0.35L',
      status: 'Awaiting approval',
      approval: 'Pending',
    },
  ],
  invoiceActivity: [
    {
      id: 'ia-1',
      primary: 'INV-9924 submitted for approval',
      secondary: 'Today 09:20',
      badgeLabel: 'Approval',
      badgeColor: 'warning',
    },
    {
      id: 'ia-2',
      primary: 'INV-9921 posted to ledger',
      secondary: 'Today 08:55',
      badgeLabel: 'Posted',
      badgeColor: 'success',
    },
  ],
  invoiceNotifications: [
    {
      id: 'in-1',
      title: '9 invoices awaiting approval',
      body: 'Finance lead review queue is above target.',
      unread: true,
      createdAt: '30 min ago',
    },
  ],
  reconciliationSummary: {
    outstanding: '₹12.6L',
    collected: '₹8.4L',
    overdue: '₹3.1L',
    collectionRate: 68,
  },
  reconciliationRows: [
    {
      id: 'rec-1',
      reference: 'VB-441',
      vendor: 'BlueDart',
      category: 'Courier Charges',
      amount: '₹2.4L',
      status: 'Due',
      dueDate: '21 Jul',
      assignedTo: 'Vikram Rao',
    },
    {
      id: 'rec-2',
      reference: 'CC-7781',
      vendor: 'HDFC Cards',
      category: 'Credit Card Spend',
      amount: '₹1.1L',
      status: 'In review',
      dueDate: '22 Jul',
      assignedTo: 'Neha Patel',
    },
    {
      id: 'rec-3',
      reference: 'INS-220',
      vendor: 'VFS Global',
      category: 'Insurance Payments',
      amount: '₹0.6L',
      status: 'Matched',
      dueDate: '18 Jul',
      assignedTo: 'Arjun Mehta',
    },
    {
      id: 'rec-4',
      reference: 'TKT-991',
      vendor: 'Travel partner',
      category: 'Ticketing Payments',
      amount: '₹3.2L',
      status: 'Due',
      dueDate: '23 Jul',
      assignedTo: 'Priya Nair',
    },
    {
      id: 'rec-5',
      reference: 'APP-5521',
      vendor: 'Embassy fee desk',
      category: 'Application Payments',
      amount: '₹0.9L',
      status: 'Partial',
      dueDate: '20 Jul',
      assignedTo: 'Vikram Rao',
    },
  ],
  reconciliationActivity: [
    {
      id: 'ra-1',
      primary: 'Matched INS-220 insurance remittance',
      secondary: '1 hr ago',
      badgeLabel: 'Matched',
      badgeColor: 'success',
    },
    {
      id: 'ra-2',
      primary: 'CC-7781 flagged for missing receipt',
      secondary: '2 hr ago',
      badgeLabel: 'Cards',
      badgeColor: 'warning',
    },
  ],
  branchPerformance: [
    { id: 'br-mum', label: 'Mumbai', value: 18.4 },
    { id: 'br-del', label: 'Delhi', value: 12.2 },
    { id: 'br-blr', label: 'Bengaluru', value: 9.8 },
    { id: 'br-chn', label: 'Chennai', value: 7.1 },
  ],
  countryDistribution: [
    { id: 'ae', label: 'UAE', value: 36 },
    { id: 'schengen', label: 'Schengen', value: 28 },
    { id: 'uk', label: 'UK', value: 18 },
    { id: 'us', label: 'USA', value: 12 },
    { id: 'other', label: 'Other', value: 6 },
  ],
  businessSegments: [
    { id: 'retail', label: 'Retail', value: 34 },
    { id: 'corporate', label: 'Corporate', value: 38 },
    { id: 'marine', label: 'Marine', value: 18 },
    { id: 'b2b', label: 'B2B', value: 10 },
  ],
  processingTrend: [
    { label: 'Mon', value: 4.2, secondary: 3.1 },
    { label: 'Tue', value: 5.1, secondary: 3.8 },
    { label: 'Wed', value: 4.8, secondary: 4.0 },
    { label: 'Thu', value: 6.2, secondary: 4.6 },
    { label: 'Fri', value: 5.9, secondary: 5.1 },
    { label: 'Sat', value: 2.4, secondary: 2.0 },
    { label: 'Sun', value: 1.1, secondary: 0.9 },
  ],
  metricComparison: [
    { label: 'Recovery rate', value: '72%', delta: 3.4 },
    { label: 'Avg days outstanding', value: '41', delta: -5.2 },
    { label: 'Vendor SLA', value: '88%', delta: 1.1 },
  ],
  riskAlerts: [
    {
      id: 'fr-1',
      title: '90+ ageing concentration',
      description: 'Nordic Marine and two corporates dominate overdue.',
      severity: 'critical',
      count: 3,
    },
    {
      id: 'fr-2',
      title: 'Card utilization high',
      description: 'Corporate cards at 78% of limit.',
      severity: 'warning',
      count: 1,
    },
  ],
  slaOverview: [
    { id: 'col-sla', label: 'Collections SLA', value: 81, helperText: 'Target 85%' },
    { id: 'inv-sla', label: 'Invoice posting SLA', value: 93, helperText: 'Target 95%' },
    { id: 'recon-sla', label: 'Reconciliation SLA', value: 76, helperText: 'Target 90%' },
  ],
  recentReports: [
    {
      id: 'rep-1',
      name: 'MTD outstanding ageing',
      category: 'Outstanding',
      generatedAt: 'Today 07:30',
    },
    {
      id: 'rep-2',
      name: 'GST summary — July',
      category: 'GST',
      generatedAt: 'Yesterday',
    },
    {
      id: 'rep-3',
      name: 'Vendor payables pack',
      category: 'Vendor',
      generatedAt: '2 days ago',
    },
    {
      id: 'rep-4',
      name: 'Reconciliation exceptions',
      category: 'Reconciliation',
      generatedAt: '2 days ago',
    },
  ],
  reportNotifications: [
    {
      id: 'rn-1',
      title: 'Monthly finance pack ready',
      body: 'July close reports exported to shared drive.',
      unread: true,
      createdAt: 'Today',
    },
  ],
}

export function applyAccountsDashboardFilters(
  data: AccountsDashboardData,
  filters: AccountsDashboardFilters,
): AccountsDashboardData {
  const query = filters.search.trim().toLowerCase()

  const matchSearch = (...parts: Array<string | undefined>) =>
    !query || parts.some((part) => part?.toLowerCase().includes(query))

  const matchBranch = (branch: string) =>
    filters.branch === 'all' || branch.toLowerCase() === filters.branch

  const matchCollectionStatus = (status: string) =>
    filters.collectionStatus === 'all' ||
    status.toLowerCase().replace(/\s+/g, '-') === filters.collectionStatus

  const matchInvoiceStatus = (status: string) =>
    filters.invoiceStatus === 'all' ||
    status.toLowerCase().replace(/\s+/g, '-') === filters.invoiceStatus

  const matchVendor = (vendor: string) =>
    filters.vendor === 'all' || vendor.toLowerCase().includes(filters.vendor)

  return {
    ...data,
    collectionRows: data.collectionRows.filter(
      (row) =>
        matchBranch(row.branch) &&
        matchCollectionStatus(row.status) &&
        matchSearch(row.invoiceNumber, row.client, row.assignedExecutive),
    ),
    invoiceRows: data.invoiceRows.filter(
      (row) =>
        matchInvoiceStatus(row.status) &&
        matchSearch(row.invoiceNumber, row.client, row.application),
    ),
    reconciliationRows: data.reconciliationRows.filter(
      (row) =>
        matchVendor(row.vendor) &&
        matchSearch(row.reference, row.vendor, row.category, row.assignedTo),
    ),
  }
}
