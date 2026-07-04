import type { LucideIcon } from 'lucide-react'
import { LifeBuoy } from 'lucide-react'

export interface HelpSupportNavItem {
  path: string
  label: string
  pageTitle?: string
}

export const HELP_SUPPORT_NAV_ITEMS: HelpSupportNavItem[] = [
  {
    path: 'support/faq',
    label: 'Help Center',
    pageTitle: 'Help Center',
  },
  {
    path: 'support/contact',
    label: 'Contact Support',
    pageTitle: 'Contact Support',
  },
]

export const HELP_SUPPORT_NAV_PARENT = {
  label: 'Help & Support',
  icon: LifeBuoy,
} as const satisfies { label: string; icon: LucideIcon }
