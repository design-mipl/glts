import type { Invoice, InvoiceStatus, KpiCardData } from '@/design-system/UIComponents/Templates/BillingTemplate/types'
import { CLIENT_OPTIONS } from '@/design-system/UIComponents/Templates/BillingTemplate/types'

export { CLIENT_OPTIONS }

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNo: 'INV-2026-001',
    client: 'Mr. Arun Sharma',
    project: 'Skyline Penthouse',
    invoiceDate: '06 Apr 2026',
    dueDate: '06 May 2026',
    amount: 41300,
    tds: 0,
    netReceivable: 41300,
    status: 'Draft',
    createdAt: '2026-04-06',
  },
  {
    id: '2',
    invoiceNo: 'INV-2026-002',
    client: 'Greenfield Developers',
    project: 'Eco Towers Phase 2',
    invoiceDate: '12 Mar 2026',
    dueDate: '12 Apr 2026',
    amount: 285000,
    tds: 2850,
    netReceivable: 282150,
    status: 'Sent',
    createdAt: '2026-03-12',
  },
  {
    id: '3',
    invoiceNo: 'INV-2026-003',
    client: 'Priya Nair',
    project: 'Lakeview Villa',
    invoiceDate: '28 Feb 2026',
    dueDate: '28 Mar 2026',
    amount: 156000,
    tds: 0,
    netReceivable: 156000,
    status: 'Paid',
    createdAt: '2026-02-28',
  },
  {
    id: '4',
    invoiceNo: 'INV-2026-004',
    client: 'Metro Build Co.',
    project: 'Central Mall Fit-out',
    invoiceDate: '15 Jan 2026',
    dueDate: '15 Feb 2026',
    amount: 890000,
    tds: 8900,
    netReceivable: 881100,
    status: 'Overdue',
    createdAt: '2026-01-15',
  },
  {
    id: '5',
    invoiceNo: 'INV-2026-005',
    client: 'Sunrise Interiors',
    project: 'Office Renovation',
    invoiceDate: '01 Apr 2026',
    dueDate: '01 May 2026',
    amount: 72000,
    tds: 720,
    netReceivable: 71280,
    status: 'Draft',
    createdAt: '2026-04-01',
  },
  {
    id: '6',
    invoiceNo: 'INV-2026-006',
    client: 'Heritage Hotels',
    project: 'Lobby Redesign',
    invoiceDate: '20 Mar 2026',
    dueDate: '20 Apr 2026',
    amount: 445000,
    tds: 4450,
    netReceivable: 440550,
    status: 'Sent',
    createdAt: '2026-03-20',
  },
  {
    id: '7',
    invoiceNo: 'INV-2026-007',
    client: 'Apex Constructions',
    project: 'Warehouse Unit 4',
    invoiceDate: '10 Feb 2026',
    dueDate: '10 Mar 2026',
    amount: 198500,
    tds: 1985,
    netReceivable: 196515,
    status: 'Partially Paid',
    createdAt: '2026-02-10',
  },
  {
    id: '8',
    invoiceNo: 'INV-2026-008',
    client: 'Blue Ocean Retail',
    project: 'Showroom Display',
    invoiceDate: '05 Mar 2026',
    dueDate: '05 Apr 2026',
    amount: 67500,
    tds: 0,
    netReceivable: 67500,
    status: 'Sent',
    createdAt: '2026-03-05',
  },
  {
    id: '9',
    invoiceNo: 'INV-2026-009',
    client: 'Dr. Mehta Clinic',
    project: 'Clinic Interiors',
    invoiceDate: '18 Jan 2026',
    dueDate: '18 Feb 2026',
    amount: 125000,
    tds: 1250,
    netReceivable: 123750,
    status: 'Overdue',
    createdAt: '2026-01-18',
  },
  {
    id: '10',
    invoiceNo: 'INV-2026-010',
    client: 'Urban Spaces LLP',
    project: 'Co-working Hub',
    invoiceDate: '22 Mar 2026',
    dueDate: '22 Apr 2026',
    amount: 512000,
    tds: 5120,
    netReceivable: 506880,
    status: 'Paid',
    createdAt: '2026-03-22',
  },
  {
    id: '11',
    invoiceNo: 'INV-2026-011',
    client: 'Rohan Patel',
    project: 'Residential Kitchen',
    invoiceDate: '30 Mar 2026',
    dueDate: '30 Apr 2026',
    amount: 94000,
    tds: 0,
    netReceivable: 94000,
    status: 'Sent',
    createdAt: '2026-03-30',
  },
  {
    id: '12',
    invoiceNo: 'INV-2026-012',
    client: 'TechPark Facilities',
    project: 'Cafeteria Upgrade',
    invoiceDate: '14 Feb 2026',
    dueDate: '14 Mar 2026',
    amount: 234000,
    tds: 2340,
    netReceivable: 231660,
    status: 'Paid',
    createdAt: '2026-02-14',
  },
]

export const KPI_DATA: KpiCardData[] = [
  { id: 'total', label: 'Total Invoiced', amount: 3057300, color: 'primary' },
  { id: 'received', label: 'Received', amount: 1230000, color: 'success' },
  { id: 'outstanding', label: 'Outstanding', amount: 1827300, color: 'warning' },
  { id: 'tds', label: 'TDS Deducted', amount: 4300, color: 'info' },
]

export const STATUS_TAB_MAP: Record<string, InvoiceStatus | null> = {
  all: null,
  draft: 'Draft',
  sent: 'Sent',
  'partially-paid': 'Partially Paid',
  overdue: 'Overdue',
  paid: 'Paid',
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getInvoiceById(id: string): Invoice | undefined {
  return MOCK_INVOICES.find((inv) => inv.id === id)
}

export function getStatusCounts(): Record<string, number> {
  const counts: Record<string, number> = {
    all: MOCK_INVOICES.length,
    draft: 0,
    sent: 0,
    'partially-paid': 0,
    overdue: 0,
    paid: 0,
  }

  for (const inv of MOCK_INVOICES) {
    if (inv.status === 'Draft') counts.draft++
    else if (inv.status === 'Sent') counts.sent++
    else if (inv.status === 'Partially Paid') counts['partially-paid']++
    else if (inv.status === 'Overdue') counts.overdue++
    else if (inv.status === 'Paid') counts.paid++
  }

  return counts
}

export function filterByStatus(invoices: Invoice[], statusTab: string): Invoice[] {
  const status = STATUS_TAB_MAP[statusTab]
  if (!status) return invoices
  return invoices.filter((inv) => inv.status === status)
}

export function searchInvoices(invoices: Invoice[], query: string): Invoice[] {
  const q = query.trim().toLowerCase()
  if (!q) return invoices
  return invoices.filter(
    (inv) =>
      inv.invoiceNo.toLowerCase().includes(q) ||
      inv.client.toLowerCase().includes(q) ||
      inv.project.toLowerCase().includes(q),
  )
}

export function applyFilterOptions(
  invoices: Invoice[],
  filters: { status: string[]; client: string; amountMin: number; amountMax: number },
): Invoice[] {
  return invoices.filter((inv) => {
    if (filters.status.length > 0 && !filters.status.includes(inv.status)) return false
    if (filters.client && inv.client !== filters.client) return false
    if (filters.amountMin > 0 && inv.amount < filters.amountMin) return false
    if (filters.amountMax > 0 && inv.amount > filters.amountMax) return false
    return true
  })
}

export function useBillingData() {
  return {
    invoices: MOCK_INVOICES,
    kpiData: KPI_DATA,
    clientOptions: CLIENT_OPTIONS,
    formatINR,
    getInvoiceById,
    getStatusCounts,
    filterByStatus,
    searchInvoices,
    applyFilterOptions,
  }
}
