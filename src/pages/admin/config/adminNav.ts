import { createElement } from 'react'
import {
  Activity,
  Building2,
  FileText,
  HandCoins,
  Headphones,
  LayoutDashboard,
  Shield,
  SlidersHorizontal,
  Wrench,
} from 'lucide-react'
import type { NavConfig } from '@/design-system/UIComponents'

const iconProps = { size: 16, strokeWidth: 1.75 }

export const adminNav: NavConfig[] = [
  {
    type: 'item',
    label: 'Dashboard',
    href: '/admin',
    icon: createElement(LayoutDashboard, iconProps),
  },
  {
    type: 'divider',
  },
  {
    type: 'group',
    label: 'Customer & accounts',
    icon: createElement(Building2, iconProps),
    children: [
      { type: 'item', label: 'Enquiry management', href: '/admin/customer-accounts/enquiries' },
      { type: 'item', label: 'Quotation management', href: '/admin/customer-accounts/quotations' },
      { type: 'item', label: 'Agreements & contracts', href: '/admin/customer-accounts/agreements' },
      { type: 'item', label: 'Corporate accounts', href: '/admin/customer-accounts/corporate-accounts' },
      { type: 'item', label: 'Corporate admins', href: '/admin/customer-accounts/corporate-admins' },
    ],
  },
  {
    type: 'group',
    label: 'Application management',
    icon: createElement(FileText, iconProps),
    children: [
      { type: 'item', label: 'Retail applications', href: '/admin/application-management/retail' },
      { type: 'item', label: 'Corporate applications', href: '/admin/application-management/corporate' },
      { type: 'item', label: 'Marine applications', href: '/admin/application-management/marine' },
      { type: 'item', label: 'Assignment management', href: '/admin/application-management/assignments' },
    ],
  },
  {
    type: 'group',
    label: 'Ground operations',
    icon: createElement(Activity, iconProps),
    children: [
      { type: 'item', label: 'Operational case handling', href: '/admin/ground-operations/case-handling' },
      { type: 'item', label: 'Tracking & logistics', href: '/admin/ground-operations/logistics' },
      { type: 'item', label: 'Expense & fund management', href: '/admin/ground-operations/funds' },
    ],
  },
  {
    type: 'group',
    label: 'Finance, billing & collections',
    icon: createElement(HandCoins, iconProps),
    children: [
      { type: 'item', label: 'Expense management', href: '/admin/finance/expenses' },
      { type: 'item', label: 'Billing & invoice management', href: '/admin/finance/invoices' },
      { type: 'item', label: 'Payments & collections', href: '/admin/finance/payments' },
      { type: 'item', label: 'Reconciliation', href: '/admin/finance/reconciliation' },
    ],
  },
  {
    type: 'group',
    label: 'Support tickets',
    icon: createElement(Headphones, iconProps),
    children: [
      { type: 'item', label: 'Ticket management', href: '/admin/support/tickets' },
      { type: 'item', label: 'Communication & resolution', href: '/admin/support/communications' },
    ],
  },
  {
    type: 'divider',
  },
  {
    type: 'group',
    label: 'User management',
    icon: createElement(Shield, iconProps),
    children: [
      { type: 'item', label: 'Team', href: '/admin/access/teams' },
      { type: 'item', label: 'User & permission', href: '/admin/access/users' },
    ],
  },
  {
    type: 'group',
    label: 'Masters',
    icon: createElement(SlidersHorizontal, iconProps),
    children: [
      { type: 'item', label: 'Country', href: '/admin/masters/country' },
      { type: 'item', label: 'Visa type', href: '/admin/masters/visa-type' },
      { type: 'item', label: 'Document master', href: '/admin/masters/documents' },
      { type: 'item', label: 'Rate master', href: '/admin/masters/rates' },
      { type: 'item', label: 'Service Master', href: '/admin/masters/services' },
      { type: 'item', label: 'SAC Code Master', href: '/admin/masters/sac-codes' },
      { type: 'item', label: 'GST & TDS Master', href: '/admin/masters/tax' },
    ],
  },
  {
    type: 'group',
    label: 'Tools',
    icon: createElement(Wrench, iconProps),
    children: [
      { type: 'item', label: 'Component library', href: '/admin/tools/component-library' },
      { type: 'item', label: 'Template showcase', href: '/admin/tools/templates' },
    ],
  },
]
