import type { OrderEnquiry, OrderEnquiryFormData } from '@/shared/types/orderEnquiry'

export function orderEnquiryRecordToFormData(record: OrderEnquiry): OrderEnquiryFormData {
  return {
    status: record.status,
    source: record.source,
    service: record.service,
    customer: { ...record.customer },
    notes: record.notes ?? '',
  }
}
