import type { OrderFormData } from '../types/order'
import type {
  OrderEnquiry,
  OrderEnquiryFormData,
  OrderEnquiryListFilters,
  OrderEnquiryServiceType,
  OrderEnquiryStatus,
  WebsiteOrderEnquiryPayload,
} from '../types/orderEnquiry'
import { orderService } from './orderService'

function nowIso() {
  return new Date().toISOString()
}

function daysFromToday(days: number) {
  const value = new Date()
  value.setDate(value.getDate() + days)
  return value.toISOString()
}

let enquiryCounter = 24010

function nextEnquiryNumber() {
  enquiryCounter += 1
  return `OEN-${enquiryCounter}`
}

/** Maps enquiry service to a default service master for order line prefill. */
export const ORDER_ENQUIRY_SERVICE_MASTER_ID: Record<OrderEnquiryServiceType, string> = {
  attestation: 'svc-mea-attestation',
  notary: 'svc-apostille',
  'travel-insurance': 'svc-travel-insurance',
}

export const ORDER_ENQUIRY_SERVICE_LABEL: Record<OrderEnquiryServiceType, string> = {
  attestation: 'Attestation',
  notary: 'Notary',
  'travel-insurance': 'Travel Insurance',
}

function buildEnquiry(
  enquiryNumber: string,
  daysAgo: number,
  status: OrderEnquiryStatus,
  source: OrderEnquiry['source'],
  service: OrderEnquiryServiceType,
  customer: OrderEnquiry['customer'],
  createdBy: string,
  notes?: string,
  convertedOrderId?: string,
): OrderEnquiry {
  return {
    id: enquiryNumber,
    enquiryNumber,
    enquiryDate: daysFromToday(-daysAgo),
    status,
    source,
    service,
    customer,
    notes,
    convertedOrderId,
    convertedAt: convertedOrderId ? daysFromToday(-Math.max(daysAgo - 1, 0)) : undefined,
    createdBy,
    updatedBy: createdBy,
    createdAt: daysFromToday(-daysAgo),
    updatedAt: daysFromToday(-Math.max(daysAgo - 1, 0)),
  }
}

let orderEnquiryStore: OrderEnquiry[] = [
  buildEnquiry(
    'OEN-24001',
    3,
    'new',
    'website',
    'travel-insurance',
    {
      companyOrCustomerName: 'Horizon Holidays Pvt Ltd',
      contactPersonName: 'Anita Desai',
      contactNumber: '+91 98200 44112',
      emailAddress: 'anita.d@horizonholidays.com',
      companyAddress: '12 Marine Drive, Mumbai, Maharashtra 400002',
    },
    'Website',
    'Submitted via extra services page — travel insurance for Schengen group.',
  ),
  buildEnquiry(
    'OEN-24002',
    5,
    'in_review',
    'admin',
    'attestation',
    {
      companyOrCustomerName: 'Apex Shipping Ltd',
      contactPersonName: 'Rohan Mehta',
      contactNumber: '+91 98765 12345',
      emailAddress: 'rohan@apexshipping.com',
      companyAddress: 'Bandra Kurla Complex, Mumbai 400051',
    },
    'Priya Sharma',
    'MEA attestation for commercial invoice bundle.',
  ),
  buildEnquiry(
    'OEN-24003',
    8,
    'converted',
    'website',
    'notary',
    {
      companyOrCustomerName: 'Sunrise Travels',
      contactPersonName: 'Kavita Nair',
      contactNumber: '+91 99887 76655',
      emailAddress: 'kavita@sunrisetravels.in',
      companyAddress: 'MG Road, Bengaluru, Karnataka 560001',
    },
    'Website',
    undefined,
    'ORD-24001',
  ),
]

function matchesQuery(enquiry: OrderEnquiry, query: string) {
  const value = query.trim().toLowerCase()
  if (!value) return true
  return (
    enquiry.enquiryNumber.toLowerCase().includes(value) ||
    enquiry.customer.companyOrCustomerName.toLowerCase().includes(value) ||
    enquiry.customer.contactPersonName.toLowerCase().includes(value) ||
    enquiry.customer.emailAddress.toLowerCase().includes(value) ||
    ORDER_ENQUIRY_SERVICE_LABEL[enquiry.service].toLowerCase().includes(value)
  )
}

function applyListingFilters(items: OrderEnquiry[], filters?: OrderEnquiryListFilters) {
  if (!filters) return items

  return items.filter((enquiry) => {
    if (filters.status && filters.status !== 'all' && enquiry.status !== filters.status) return false
    if (filters.source && filters.source !== 'all' && enquiry.source !== filters.source) return false
    if (filters.service && filters.service !== 'all' && enquiry.service !== filters.service) return false
    if (filters.query && !matchesQuery(enquiry, filters.query)) return false
    return true
  })
}

function websitePayloadToCustomer(payload: WebsiteOrderEnquiryPayload): OrderEnquiry['customer'] {
  return {
    companyOrCustomerName: payload.companyName.trim(),
    contactPersonName: payload.contactPerson.trim(),
    contactNumber: payload.mobile.trim(),
    emailAddress: payload.email.trim(),
    companyAddress: payload.companyAddress.trim(),
  }
}

export function orderEnquiryToOrderFormData(enquiry: OrderEnquiry): OrderFormData {
  const serviceMasterId = ORDER_ENQUIRY_SERVICE_MASTER_ID[enquiry.service]
  return {
    status: 'draft',
    source: 'order_enquiry',
    orderEnquiryId: enquiry.id,
    customer: {
      companyOrCustomerName: enquiry.customer.companyOrCustomerName,
      customerType: 'retail',
      contactPersonName: enquiry.customer.contactPersonName,
      contactNumber: enquiry.customer.contactNumber,
      emailAddress: enquiry.customer.emailAddress,
      companyAddress: enquiry.customer.companyAddress,
    },
    lineItems: [
      {
        id: '',
        serviceMasterId,
        vendorId: '',
        quantity: 1,
        vendorRate: 0,
        clientRate: 0,
        margin: 0,
        gstMasterId: 'gst-18',
        remarks: `From order enquiry ${enquiry.enquiryNumber} — ${ORDER_ENQUIRY_SERVICE_LABEL[enquiry.service]}`,
      },
    ],
    notes: enquiry.notes,
    attachments: [],
  }
}

export const orderEnquiryService = {
  getEnquiries(filters?: OrderEnquiryListFilters) {
    return Promise.resolve(applyListingFilters(orderEnquiryStore, filters))
  },

  getEnquiryById(enquiryId: string) {
    return Promise.resolve(orderEnquiryStore.find((item) => item.id === enquiryId))
  },

  create(payload: OrderEnquiryFormData, createdBy = 'System User') {
    const enquiryNumber = nextEnquiryNumber()
    const record: OrderEnquiry = {
      id: enquiryNumber,
      enquiryNumber,
      enquiryDate: nowIso(),
      status: payload.status ?? 'new',
      source: payload.source,
      service: payload.service,
      customer: payload.customer,
      notes: payload.notes,
      createdBy,
      updatedBy: createdBy,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    orderEnquiryStore = [record, ...orderEnquiryStore]
    return Promise.resolve(record)
  },

  createFromWebsite(payload: WebsiteOrderEnquiryPayload) {
    return this.create(
      {
        status: 'new',
        source: 'website',
        service: payload.service,
        customer: websitePayloadToCustomer(payload),
        notes: `Website extra services request — ${ORDER_ENQUIRY_SERVICE_LABEL[payload.service]}.`,
      },
      'Website',
    )
  },

  update(enquiryId: string, patch: Partial<OrderEnquiryFormData>, actor = 'System User') {
    const target = orderEnquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)
    if (patch.status) target.status = patch.status
    if (patch.source) target.source = patch.source
    if (patch.service) target.service = patch.service
    if (patch.notes !== undefined) target.notes = patch.notes
    if (patch.customer) target.customer = { ...target.customer, ...patch.customer }
    target.updatedBy = actor
    target.updatedAt = nowIso()
    return Promise.resolve(target)
  },

  convertToOrder(enquiryId: string, actor = 'System User') {
    const enquiry = orderEnquiryStore.find((item) => item.id === enquiryId)
    if (!enquiry) return Promise.resolve(undefined)
    if (enquiry.status === 'converted' && enquiry.convertedOrderId) {
      return orderService.getOrderById(enquiry.convertedOrderId).then((order) =>
        order ? { enquiry, order } : undefined,
      )
    }

    const formData = orderEnquiryToOrderFormData(enquiry)
    return orderService.createOrder(formData, actor).then((order) => {
      this.markAsConverted(enquiryId, order.id, actor)
      const updated = orderEnquiryStore.find((item) => item.id === enquiryId)!
      return { enquiry: updated, order }
    })
  },

  markAsConverted(enquiryId: string, orderId: string, actor = 'System User') {
    const enquiry = orderEnquiryStore.find((item) => item.id === enquiryId)
    if (!enquiry) return Promise.resolve(undefined)
    enquiry.status = 'converted'
    enquiry.convertedOrderId = orderId
    enquiry.convertedAt = nowIso()
    enquiry.updatedBy = actor
    enquiry.updatedAt = nowIso()
    return Promise.resolve(enquiry)
  },

  isEligibleForConversion(enquiry: OrderEnquiry | undefined) {
    if (!enquiry) return false
    return enquiry.status !== 'converted' && enquiry.status !== 'spam' && enquiry.status !== 'closed'
  },
}
