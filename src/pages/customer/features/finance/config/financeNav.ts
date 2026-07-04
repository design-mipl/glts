import type { LucideIcon } from 'lucide-react'
import { Wallet, FileText, Banknote } from 'lucide-react'

export interface FinanceNavItem {
  path: string
  label: string
  icon: LucideIcon
  pageTitle?: string
}

export const FINANCE_NAV_ITEMS: FinanceNavItem[] = [
  {
    path: 'finance/invoices',
    label: 'Invoice Management',
    icon: FileText,
    pageTitle: 'Invoice Management',
  },
  {
    path: 'finance/payments',
    label: 'Payment Management',
    icon: Banknote,
    pageTitle: 'Payment Management',
  },
]

export const FINANCE_NAV_PARENT = {
  label: 'Invoice & payments',
  icon: Wallet,
} as const

export function getFinanceNavItemByPath(pathSegment: string): FinanceNavItem | undefined {
  return FINANCE_NAV_ITEMS.find(item => item.path.endsWith(pathSegment))
}
