import type { Order, OrderFormData } from '@/shared/types/order'

export function orderRecordToFormData(record: Order): OrderFormData {
  return {
    customer: { ...record.customer },
    lineItems: record.lineItems.map((line) => ({ ...line })),
    notes: record.notes,
    status: record.status,
  }
}
