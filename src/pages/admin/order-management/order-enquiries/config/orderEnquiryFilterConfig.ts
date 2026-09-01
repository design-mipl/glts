import type { OrderEnquiryServiceType } from '@/shared/types/orderEnquiry'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'

export const orderEnquiryServiceOptions: { value: OrderEnquiryServiceType; label: string }[] = (
  Object.entries(ORDER_ENQUIRY_SERVICE_LABEL) as [OrderEnquiryServiceType, string][]
).map(([value, label]) => ({ value, label }))
