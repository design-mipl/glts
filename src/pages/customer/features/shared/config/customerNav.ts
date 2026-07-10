import { createElement } from 'react'
import {
  Building2,
  Database,
  FileText,
  LayoutDashboard,
  UserCog,
} from 'lucide-react'
import type { NavConfig } from '@/design-system/UIComponents'
import { FINANCE_NAV_ITEMS, FINANCE_NAV_PARENT } from '@/pages/customer/features/finance/config/financeNav'
import {
  HELP_SUPPORT_NAV_ITEMS,
  HELP_SUPPORT_NAV_PARENT,
} from '@/pages/customer/features/help-support/config/helpSupportNav'

const iconProps = { size: 16, strokeWidth: 1.75 }

export interface BuildCustomerNavOptions {
  base: string
  isBusiness: boolean
  canAccessAdminManagement: boolean
  canAccessBookerManagement: boolean
  canAccessMasters: boolean
}

/** Primary sidebar navigation (scroll area). */
export function buildCustomerNavConfig({
  base,
  isBusiness,
  canAccessAdminManagement,
  canAccessBookerManagement,
  canAccessMasters,
}: BuildCustomerNavOptions): NavConfig[] {
  const items: NavConfig[] = [
    {
      type: 'item',
      label: 'Dashboard',
      href: `${base}/dashboard`,
      icon: createElement(LayoutDashboard, iconProps),
    },
    { type: 'divider' },
    {
      type: 'item',
      label: 'Profile details',
      href: `${base}/profile`,
      icon: createElement(Building2, iconProps),
    },
    {
      type: 'item',
      label: 'Application management',
      href: `${base}/applications`,
      icon: createElement(FileText, iconProps),
    },
  ]

  if (isBusiness) {
    items.push({
      type: 'group',
      label: FINANCE_NAV_PARENT.label,
      icon: createElement(FINANCE_NAV_PARENT.icon, iconProps),
      children: FINANCE_NAV_ITEMS.map(item => ({
        type: 'item' as const,
        label: item.label,
        href: `${base}/${item.path}`,
      })),
    })
    items.push({ type: 'divider' })
  }

  const userManagementChildren: NavConfig[] = []

  if (isBusiness && canAccessAdminManagement) {
    userManagementChildren.push({
      type: 'item',
      label: 'Admin management',
      href: `${base}/users/admins`,
    })
  }

  if (isBusiness && canAccessBookerManagement) {
    userManagementChildren.push({
      type: 'item',
      label: 'Booker management',
      href: `${base}/users/bookers`,
    })
  }

  if (userManagementChildren.length > 0) {
    items.push({
      type: 'group',
      label: 'User management',
      icon: createElement(UserCog, iconProps),
      children: userManagementChildren,
    })
  }

  if (isBusiness && canAccessMasters) {
    items.push({
      type: 'group',
      label: 'Masters',
      icon: createElement(Database, iconProps),
      children: [
        {
          type: 'item',
          label: 'Entity master',
          href: `${base}/masters/entities`,
        },
        {
          type: 'item',
          label: 'Vessel master',
          href: `${base}/masters/vessels`,
        },
      ],
    })
  }

  return items
}

/** Footer navigation above sign-out. */
export function buildCustomerFooterNavConfig(base: string): NavConfig[] {
  return [
    {
      type: 'group',
      label: HELP_SUPPORT_NAV_PARENT.label,
      icon: createElement(HELP_SUPPORT_NAV_PARENT.icon, iconProps),
      children: HELP_SUPPORT_NAV_ITEMS.map(item => ({
        type: 'item' as const,
        label: item.label,
        href: `${base}/${item.path}`,
      })),
    },
  ]
}
