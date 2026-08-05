import type { CustomerType } from './session'

/** URL path segment under `/business/app/`. */
export type CustomerSegmentSlug = 'marine' | 'corporate' | 'b2b'

export const CUSTOMER_SEGMENT_SLUGS: CustomerSegmentSlug[] = ['marine', 'corporate', 'b2b']

export function customerTypeToSlug(type: CustomerType): CustomerSegmentSlug {
  if (type === 'b2b_agent') return 'b2b'
  return type
}

export function slugToCustomerType(slug: string): CustomerType | null {
  if (slug === 'marine') return 'marine'
  if (slug === 'corporate') return 'corporate'
  if (slug === 'b2b') return 'b2b_agent'
  return null
}

export function businessAppBase(customerType: CustomerType): string {
  return `/business/app/${customerTypeToSlug(customerType)}`
}

export function businessSignInPath(customerType: CustomerType): string {
  return `/sign-in/business/${customerTypeToSlug(customerType)}`
}

export function parseBusinessSegmentFromPath(pathname: string): CustomerType | null {
  const match = pathname.match(/^\/business\/app\/(marine|corporate|b2b)(?:\/|$)/)
  return match ? slugToCustomerType(match[1]!) : null
}

export function isMarineCustomer(customerType?: CustomerType): boolean {
  return customerType === 'marine'
}
