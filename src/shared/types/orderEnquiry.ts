import type { MasterAuditFields } from './masterCommon'

/** Extra services requested via website or admin order enquiry flow. */
export type OrderEnquiryServiceType = 'attestation' | 'notary' | 'travel-insurance'

export type OrderEnquirySource = 'website' | 'admin' | 'call' | 'email' | 'referral'

export type OrderEnquiryStatus =
  | 'new'
  | 'in_review'
  | 'qualified'
  | 'converted'
  | 'closed'
  | 'spam'

export interface OrderEnquiryCustomer {
  companyOrCustomerName: string
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  companyAddress: string
}

export interface OrderEnquiry extends MasterAuditFields {
  id: string
  enquiryNumber: string
  enquiryDate: string
  status: OrderEnquiryStatus
  source: OrderEnquirySource
  service: OrderEnquiryServiceType
  customer: OrderEnquiryCustomer
  notes?: string
  convertedOrderId?: string
  convertedAt?: string
}

export type OrderEnquiryFormData = Omit<
  OrderEnquiry,
  | 'id'
  | 'enquiryNumber'
  | 'enquiryDate'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'convertedOrderId'
  | 'convertedAt'
> & {
  status?: OrderEnquiryStatus
}

export interface OrderEnquiryListFilters {
  status?: OrderEnquiryStatus | 'all'
  source?: OrderEnquirySource | 'all'
  service?: OrderEnquiryServiceType | 'all'
  query?: string
}

/** Website extra-services form payload. */
export interface WebsiteOrderEnquiryPayload {
  companyName: string
  contactPerson: string
  mobile: string
  email: string
  companyAddress: string
  service: OrderEnquiryServiceType
}
