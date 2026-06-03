import type { LucideIcon } from 'lucide-react'
import {
  Wallet,
  LayoutGrid,
  FileText,
  Banknote,
  AlertCircle,
  History,
  Receipt,
} from 'lucide-react'

export interface FinanceNavItem {
  path: string
  label: string
  icon: LucideIcon
  pageTitle?: string
}

export const FINANCE_NAV_ITEMS: FinanceNavItem[] = [
  { path: 'finance/overview', label: 'Overview', icon: LayoutGrid, pageTitle: 'Overview' },
  { path: 'finance/invoices', label: 'Invoices', icon: FileText, pageTitle: 'Invoices' },
  {
    path: 'finance/advance-payments',
    label: 'Advance payments',
    icon: Banknote,
    pageTitle: 'Advance payments',
  },
  { path: 'finance/outstanding', label: 'Outstanding', icon: AlertCircle, pageTitle: 'Outstanding' },
  {
    path: 'finance/payment-history',
    label: 'Payment history',
    icon: History,
    pageTitle: 'Payment history',
  },
  { path: 'finance/receipts', label: 'Receipts', icon: Receipt, pageTitle: 'Receipts' },
]

export const FINANCE_NAV_PARENT = {
  label: 'Invoice & payments',
  icon: Wallet,
} as const

export function getFinanceNavItemByPath(pathSegment: string): FinanceNavItem | undefined {
  return FINANCE_NAV_ITEMS.find(item => item.path.endsWith(pathSegment))
}
