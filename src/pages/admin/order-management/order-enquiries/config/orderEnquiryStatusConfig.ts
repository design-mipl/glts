import type { OrderEnquirySource, OrderEnquiryStatus } from '@/shared/types/orderEnquiry'

export const orderEnquiryStatusLabel: Record<OrderEnquiryStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  qualified: 'Qualified',
  converted: 'Converted',
  closed: 'Closed',
  spam: 'Spam',
}

export const orderEnquiryStatusColor: Record<
  OrderEnquiryStatus,
  'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'
> = {
  new: 'info',
  in_review: 'warning',
  qualified: 'info',
  converted: 'success',
  closed: 'neutral',
  spam: 'error',
}

export const orderEnquirySourceLabel: Record<OrderEnquirySource, string> = {
  website: 'Website',
  admin: 'Admin',
  call: 'Call',
  email: 'Email',
  referral: 'Referral',
}

export const orderEnquiryStatusOptions = Object.entries(orderEnquiryStatusLabel).map(([value, label]) => ({
  value,
  label,
}))

export const orderEnquirySourceOptions = Object.entries(orderEnquirySourceLabel).map(([value, label]) => ({
  value,
  label,
}))
