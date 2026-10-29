export const ORDER_LISTING_PATH = '/admin/order-management/orders'

export function orderCreateFromEnquiryHref(enquiryId: string) {
  return `${ORDER_LISTING_PATH}/new?fromEnquiry=${encodeURIComponent(enquiryId)}`
}
