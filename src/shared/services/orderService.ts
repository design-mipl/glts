import type { Order, OrderFormData, OrderListFilters, OrderServiceLineItem, OrderStatus, OrderTotals } from '../types/order'

function nowIso() {
  return new Date().toISOString()
}

function daysFromToday(days: number) {
  const value = new Date()
  value.setDate(value.getDate() + days)
  return value.toISOString()
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function computeLineMargin(line: Pick<OrderServiceLineItem, 'clientRate' | 'vendorRate' | 'quantity'>) {
  return (line.clientRate - line.vendorRate) * line.quantity
}

const GST_RATE_BY_ID: Record<string, number> = {
  'gst-0': 0,
  'gst-5': 5,
  'gst-12': 12,
  'gst-18': 18,
  'gst-28': 28,
}

function computeTotals(lineItems: OrderServiceLineItem[]): OrderTotals {
  const subtotal = lineItems.reduce((sum, line) => sum + line.clientRate * line.quantity, 0)
  const taxAmount =
    Math.round(
      lineItems.reduce(
        (sum, line) => sum + line.clientRate * line.quantity * ((GST_RATE_BY_ID[line.gstMasterId] ?? 0) / 100),
        0,
      ) * 100,
    ) / 100
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100
  return { subtotal, taxAmount, grandTotal }
}

function buildLineItem(
  overrides: Omit<OrderServiceLineItem, 'id' | 'margin'>,
): OrderServiceLineItem {
  return {
    id: id('line'),
    ...overrides,
    margin: computeLineMargin(overrides),
  }
}

function buildOrder(
  orderNumber: string,
  daysAgo: number,
  status: OrderStatus,
  customer: Order['customer'],
  lineItems: OrderServiceLineItem[],
  createdBy: string,
  notes?: string,
): Order {
  return {
    id: orderNumber,
    orderNumber,
    orderDate: daysFromToday(-daysAgo),
    status,
    customer,
    lineItems,
    totals: computeTotals(lineItems),
    notes,
    createdBy,
    updatedBy: createdBy,
    createdAt: daysFromToday(-daysAgo),
    updatedAt: daysFromToday(-Math.max(daysAgo - 1, 0)),
  }
}

let orderStore: Order[] = [
  buildOrder(
    'ORD-24001',
    6,
    'confirmed',
    {
      companyOrCustomerName: 'Apex Marine Logistics',
      customerType: 'marine',
      contactPersonName: 'Rohit Menon',
      contactNumber: '+91 9988776655',
      emailAddress: 'rohit@apexmarine.com',
      companyAddress: 'Mumbai Port Road, Mumbai',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1001',
        vendorId: 'VEND-2003',
        quantity: 24,
        vendorRate: 1200,
        clientRate: 1600,
        gstMasterId: 'gst-18',
      }),
      buildLineItem({
        serviceMasterId: 'SVC-1004',
        vendorId: 'VEND-2003',
        quantity: 24,
        vendorRate: 350,
        clientRate: 500,
        gstMasterId: 'gst-18',
      }),
    ],
    'Neha Arora',
    'Crew visa batch for vessel handover.',
  ),
  buildOrder(
    'ORD-24002',
    2,
    'draft',
    {
      companyOrCustomerName: 'Sunrise Retail Pvt Ltd',
      customerType: 'retail',
      contactPersonName: 'Meera Shah',
      contactNumber: '+91 9876501234',
      emailAddress: 'meera@sunriseretail.com',
      companyAddress: 'Ahmedabad, Gujarat',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1002',
        vendorId: 'VEND-2011',
        quantity: 2,
        vendorRate: 2500,
        clientRate: 3200,
        gstMasterId: 'gst-18',
      }),
    ],
    'Arjun Patel',
  ),
  buildOrder(
    'ORD-24003',
    15,
    'in-progress',
    {
      companyOrCustomerName: 'Global Tech Corp',
      customerType: 'corporate',
      contactPersonName: 'Lisa Chen',
      contactNumber: '+65 61234567',
      emailAddress: 'lisa.chen@globaltech.com',
      companyWebsite: 'https://globaltech.example',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1006',
        vendorId: 'VEND-2007',
        quantity: 8,
        vendorRate: 4200,
        clientRate: 5400,
        gstMasterId: 'gst-18',
      }),
      buildLineItem({
        serviceMasterId: 'SVC-1009',
        vendorId: 'VEND-2015',
        quantity: 8,
        vendorRate: 600,
        clientRate: 900,
        gstMasterId: 'gst-18',
      }),
    ],
    'Pooja Sharma',
    'Annual corporate business visa batch.',
  ),
  buildOrder(
    'ORD-24004',
    25,
    'completed',
    {
      companyOrCustomerName: 'Harbor Shipping Co',
      customerType: 'marine',
      contactPersonName: 'James Wright',
      contactNumber: '+44 7700900123',
      emailAddress: 'j.wright@harborshipping.com',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1001',
        vendorId: 'VEND-2003',
        quantity: 12,
        vendorRate: 1100,
        clientRate: 1500,
        gstMasterId: 'gst-18',
      }),
    ],
    'Karan S',
  ),
  buildOrder(
    'ORD-24005',
    18,
    'cancelled',
    {
      companyOrCustomerName: 'Quick Travel Agency',
      customerType: 'retail',
      contactPersonName: 'Anita Desai',
      contactNumber: '+91 9123456780',
      emailAddress: 'anita@quicktravel.in',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1003',
        vendorId: 'VEND-2019',
        quantity: 4,
        vendorRate: 1800,
        clientRate: 2300,
        gstMasterId: 'gst-18',
      }),
    ],
    'Neha Arora',
    'Customer cancelled trip; order voided.',
  ),
  buildOrder(
    'ORD-24006',
    4,
    'confirmed',
    {
      companyOrCustomerName: 'Nordic Foods AB',
      customerType: 'corporate',
      contactPersonName: 'Erik Lindstrom',
      contactNumber: '+46 701234567',
      emailAddress: 'erik@nordicfoods.se',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1006',
        vendorId: 'VEND-2007',
        quantity: 5,
        vendorRate: 4000,
        clientRate: 5200,
        gstMasterId: 'gst-18',
      }),
    ],
    'Pooja Sharma',
    'Trade fair business visa batch.',
  ),
  buildOrder(
    'ORD-24007',
    1,
    'draft',
    {
      companyOrCustomerName: 'Coastal Freight Ltd',
      customerType: 'marine',
      contactPersonName: 'Sanjay Rao',
      contactNumber: '+91 9812345670',
      emailAddress: 'sanjay@coastalfreight.in',
    },
    [
      buildLineItem({
        serviceMasterId: 'SVC-1001',
        vendorId: 'VEND-2003',
        quantity: 6,
        vendorRate: 1150,
        clientRate: 1550,
        gstMasterId: 'gst-18',
      }),
      buildLineItem({
        serviceMasterId: 'SVC-1005',
        vendorId: 'VEND-2021',
        quantity: 6,
        vendorRate: 200,
        clientRate: 350,
        gstMasterId: 'gst-18',
      }),
    ],
    'Ravi Kumar',
  ),
]

function matchesQuery(order: Order, query: string) {
  const value = query.trim().toLowerCase()
  if (!value) return true
  return (
    order.orderNumber.toLowerCase().includes(value) ||
    order.customer.companyOrCustomerName.toLowerCase().includes(value) ||
    order.customer.contactPersonName.toLowerCase().includes(value) ||
    order.customer.emailAddress.toLowerCase().includes(value)
  )
}

function applyListingFilters(items: Order[], filters?: OrderListFilters) {
  if (!filters) return items

  return items.filter((order) => {
    if (filters.status && filters.status !== 'all' && order.status !== filters.status) return false
    if (filters.customerType && filters.customerType !== 'all' && order.customer.customerType !== filters.customerType) return false
    if (filters.dateFrom && order.orderDate < filters.dateFrom) return false
    if (filters.dateTo && order.orderDate > filters.dateTo) return false
    if (filters.query && !matchesQuery(order, filters.query)) return false
    return true
  })
}

export const orderService = {
  getOrders(filters?: OrderListFilters) {
    return Promise.resolve(applyListingFilters(orderStore, filters))
  },

  getOrderById(orderId: string) {
    return Promise.resolve(orderStore.find((item) => item.id === orderId))
  },

  createOrder(payload: OrderFormData, createdBy = 'System User') {
    const lineItems = payload.lineItems.map((line) =>
      buildLineItem({
        serviceMasterId: line.serviceMasterId,
        vendorId: line.vendorId,
        quantity: line.quantity,
        vendorRate: line.vendorRate,
        clientRate: line.clientRate,
        gstMasterId: line.gstMasterId,
        remarks: line.remarks,
      }),
    )

    const record: Order = {
      id: `ORD-${Date.now().toString().slice(-5)}`,
      orderNumber: `ORD-${Date.now().toString().slice(-5)}`,
      orderDate: nowIso(),
      status: payload.status ?? 'draft',
      customer: payload.customer,
      lineItems,
      totals: computeTotals(lineItems),
      notes: payload.notes,
      createdBy,
      updatedBy: createdBy,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    orderStore = [record, ...orderStore]
    return Promise.resolve(record)
  },

  updateOrder(orderId: string, patch: Partial<OrderFormData>, actor = 'System User') {
    const target = orderStore.find((item) => item.id === orderId)
    if (!target) return Promise.resolve(undefined)

    if (patch.customer) target.customer = { ...target.customer, ...patch.customer }
    if (patch.status) target.status = patch.status
    if (patch.notes !== undefined) target.notes = patch.notes
    if (patch.lineItems) {
      target.lineItems = patch.lineItems.map((line) =>
        buildLineItem({
          serviceMasterId: line.serviceMasterId,
          vendorId: line.vendorId,
          quantity: line.quantity,
          vendorRate: line.vendorRate,
          clientRate: line.clientRate,
          gstMasterId: line.gstMasterId,
          remarks: line.remarks,
        }),
      )
      target.totals = computeTotals(target.lineItems)
    }
    target.updatedBy = actor
    target.updatedAt = nowIso()
    return Promise.resolve(target)
  },

  deleteOrder(orderId: string) {
    const exists = orderStore.some((item) => item.id === orderId)
    if (!exists) return Promise.resolve(false)
    orderStore = orderStore.filter((item) => item.id !== orderId)
    return Promise.resolve(true)
  },

  getStatusOptions(): Promise<OrderStatus[]> {
    return Promise.resolve(['draft', 'confirmed', 'in-progress', 'completed', 'cancelled'])
  },
}
