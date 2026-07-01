export const PORTAL_FAQ_CATEGORIES = [
  'Account',
  'Applications',
  'Document Upload',
  'Tracking',
  'Billing & Payments',
  'Passport Delivery',
  'Corporate Users',
] as const

export type PortalFaqCategory = (typeof PORTAL_FAQ_CATEGORIES)[number]
