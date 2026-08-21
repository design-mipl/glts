import type { MasterAuditFields } from './masterCommon'

/**
 * Order module — standalone workflow with its own customer capture
 * (not linked to Enquiry). Vendor assignment per line item is manual.
 */

export type OrderStatus = 'draft' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'

export type OrderCustomerType = 'retail' | 'corporate' | 'marine'

export interface OrderCustomerInfo {
  companyOrCustomerName: string
  customerType: OrderCustomerType
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  alternateContactNumber?: string
  companyWebsite?: string
  companyAddress?: string
}

export interface OrderServiceLineItem {
  id: string
  serviceMasterId: string
  vendorId: string
  quantity: number
  /** Manually entered vendor cost rate for this line (per unit). */
  vendorRate: number
  /** Manually entered client billing rate for this line (per unit). */
  clientRate: number
  /** Derived: (clientRate - vendorRate) * quantity. Stored for quick display/reporting. */
  margin: number
  /** GST master reference for this line item. */
  gstMasterId: string
  remarks?: string
}

export interface OrderTotals {
  subtotal: number
  taxAmount: number
  grandTotal: number
}

export interface OrderAttachment {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
}

export interface Order extends MasterAuditFields {
  id: string
  orderNumber: string
  orderDate: string
  status: OrderStatus
  customer: OrderCustomerInfo
  lineItems: OrderServiceLineItem[]
  totals: OrderTotals
  notes?: string
  attachments?: OrderAttachment[]
}

export type OrderFormData = Omit<
  Order,
  'id' | 'orderNumber' | 'orderDate' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'totals'
> & {
  status?: OrderStatus
}

export interface OrderListFilters {
  status?: OrderStatus | 'all'
  customerType?: OrderCustomerType | 'all'
  dateFrom?: string
  dateTo?: string
  query?: string
}
