import type { Order, OrderStatus } from '@/shared/types/order'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { orderStatusLabel } from '../config/orderStatusConfig'

export function formatOrderDate(iso: string | undefined): string {
  if (!iso?.trim()) return '—'
  return formatMasterDate(iso)
}

export type OrderListingTab = 'all' | 'draft' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

export function filterOrderRowsByTab(rows: Order[], tab: OrderListingTab): Order[] {
  if (tab === 'all') return rows
  return rows.filter((row) => row.status === (tab as OrderStatus))
}

export function getOrderCellValue(record: Order, key: string): string {
  switch (key) {
    case 'orderNumber':
      return record.orderNumber
    case 'companyOrCustomerName':
      return record.customer.companyOrCustomerName
    case 'contactPerson':
      return record.customer.contactPersonName
    case 'customerType':
      return record.customer.customerType
    case 'lineItemCount':
      return String(record.lineItems.length)
    case 'grandTotal':
      return formatInr(record.totals.grandTotal)
    case 'status':
      return orderStatusLabel[record.status]
    case 'orderDate':
      return formatOrderDate(record.orderDate)
    default:
      return String((record as unknown as Record<string, unknown>)[key] ?? '')
  }
}

export function matchesOrderSearch(record: Order, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return [
    record.orderNumber,
    record.customer.companyOrCustomerName,
    record.customer.contactPersonName,
    record.customer.emailAddress,
    record.customer.contactNumber,
    orderStatusLabel[record.status],
  ].some((value) => value.toLowerCase().includes(normalized))
}

export function mapOrderRowsToGridItems(rows: Order[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.customer.companyOrCustomerName,
    subtitle: `${row.orderNumber} • ${row.customer.contactPersonName}`,
    meta: `${row.lineItems.length} line item${row.lineItems.length === 1 ? '' : 's'} • ${formatInr(row.totals.grandTotal)}`,
    status: orderStatusLabel[row.status],
    statusColor: getGridStatusColor(row.status),
  }))
}

function getGridStatusColor(status: OrderStatus): 'success' | 'warning' | 'info' | 'default' {
  if (status === 'completed') return 'success'
  if (status === 'in-progress' || status === 'confirmed') return 'info'
  if (status === 'cancelled') return 'default'
  return 'warning'
}

export interface OrderListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getOrderEmptyState(tab: OrderListingTab, onCreate: () => void): OrderListingEmptyState {
  switch (tab) {
    case 'draft':
      return {
        emptyTitle: 'No draft orders',
        emptyDescription: 'Orders saved as draft appear here before confirmation.',
        emptyAction: { label: 'Create order', onClick: onCreate },
      }
    case 'confirmed':
      return {
        emptyTitle: 'No confirmed orders',
        emptyDescription: 'Confirmed orders are ready to be actioned by operations.',
      }
    case 'in-progress':
      return {
        emptyTitle: 'No orders in progress',
        emptyDescription: 'Orders currently being fulfilled appear here.',
      }
    case 'completed':
      return {
        emptyTitle: 'No completed orders',
        emptyDescription: 'Completed orders appear here once fulfilled.',
      }
    case 'cancelled':
      return {
        emptyTitle: 'No cancelled orders',
        emptyDescription: 'Cancelled orders appear here.',
      }
    default:
      return {
        emptyTitle: 'No orders available',
        emptyDescription: 'Create a new order to begin tracking service fulfilment.',
        emptyAction: { label: 'Create order', onClick: onCreate },
      }
  }
}

export function exportOrdersToCsv(rows: Order[]): string {
  const headers = [
    'Order Number',
    'Order Date',
    'Company / Customer',
    'Customer Type',
    'Contact Person',
    'Mobile',
    'Email',
    'Line Items',
    'Grand Total',
    'Status',
  ]
  const lines = rows.map((row) =>
    [
      row.orderNumber,
      formatOrderDate(row.orderDate),
      row.customer.companyOrCustomerName,
      row.customer.customerType,
      row.customer.contactPersonName,
      row.customer.contactNumber,
      row.customer.emailAddress,
      String(row.lineItems.length),
      formatInr(row.totals.grandTotal),
      orderStatusLabel[row.status],
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  return [headers.join(','), ...lines].join('\n')
}

export function downloadOrderCsv(rows: Order[], filename = 'orders-export.csv') {
  const csv = exportOrdersToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
