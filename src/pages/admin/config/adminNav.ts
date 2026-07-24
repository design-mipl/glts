import { createElement } from 'react'
import {
  Activity,
  Building2,
  ClipboardList,
  FileText,
  HandCoins,
  Headphones,
  LayoutDashboard,
  Shield,
  SlidersHorizontal,
  Truck,
  Wrench,
} from 'lucide-react'
import type { NavConfig } from '@/design-system/UIComponents'
import { ADMIN_DASHBOARDS, ADMIN_DASHBOARD_NEXT } from './adminDashboards'

const iconProps = { size: 16, strokeWidth: 1.75 }

export const adminNav: NavConfig[] = [
  {
    type: 'group',
    label: 'Dashboard Next',
    icon: createElement(LayoutDashboard, iconProps),
    children: ADMIN_DASHBOARD_NEXT.map((dashboard) => ({
      type: 'item' as const,
      label: dashboard.label,
      href: dashboard.href,
      badge: 'Next',
    })),
  },
  {
    type: 'group',
    label: 'Dashboard',
    icon: createElement(LayoutDashboard, iconProps),
    children: ADMIN_DASHBOARDS.map((dashboard) => ({
      type: 'item' as const,
      label: dashboard.label,
      href: dashboard.href,
      badge: 'Live',
    })),
  },
  {
    type: 'divider',
  },
  {
    type: 'group',
    label: 'Client Management',
    icon: createElement(Building2, iconProps),
    children: [
      { type: 'item', label: 'Lead Management', href: '/admin/customer-accounts/enquiries' },
      { type: 'item', label: 'Quotations', href: '/admin/customer-accounts/quotations' },
      { type: 'item', label: 'Agreements', href: '/admin/customer-accounts/agreements' },
      { type: 'item', label: 'Client Accounts', href: '/admin/customer-accounts/corporate-accounts' },
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
      { type: 'item', label: 'B2B agents applications', href: '/admin/application-management/b2b-agents' },
    ],
  },
  {
    type: 'group',
    label: 'Assignment & Priority Management',
    icon: createElement(ClipboardList, iconProps),
    children: [
      { type: 'item', label: 'Marine assignment queue', href: '/admin/assignment-priority/marine' },
      { type: 'item', label: 'B2B assignment queue', href: '/admin/assignment-priority/b2b' },
      { type: 'item', label: 'Corporate assignment queue', href: '/admin/assignment-priority/corporate' },
      { type: 'item', label: 'Retail assignment queue', href: '/admin/assignment-priority/retail' },
    ],
  },
  {
    type: 'group',
    label: 'Finance Operations',
    icon: createElement(HandCoins, iconProps),
    children: [
      { type: 'item', label: 'Expense management', href: '/admin/finance/expenses' },
      { type: 'item', label: 'Billing & invoice', href: '/admin/finance/invoices' },
      { type: 'item', label: 'Vendor billing', href: '/admin/finance/vendor-billing' },
      { type: 'item', label: 'Fund allocation', href: '/admin/finance/fund-allocation' },
    ],
  },
  {
    type: 'item',
    label: 'Vendor Management',
    icon: createElement(Truck, iconProps),
    href: '/admin/vendor-management/vendors',
  },
  {
    type: 'item',
    label: 'Support tickets',
    icon: createElement(Headphones, iconProps),
    href: '/admin/support/tickets',
  },
  {
    type: 'group',
    label: 'Ground operations',
    icon: createElement(Activity, iconProps),
    children: [
      { type: 'item', label: 'Operations Desk', href: '/admin/ground-operations/case-handling' },
      { type: 'item', label: 'Tracking & logistics', href: '/admin/ground-operations/logistics' },
      { type: 'item', label: 'Fund utilization', href: '/admin/ground-operations/funds' },
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
      { type: 'item', label: 'Country Group Master', href: '/admin/masters/country-groups' },
      { type: 'item', label: 'Jurisdiction Master', href: '/admin/masters/jurisdiction' },
      { type: 'item', label: 'Card Master', href: '/admin/masters/card-master' },
      { type: 'item', label: 'Document master', href: '/admin/masters/documents' },
      { type: 'item', label: 'GLTS Fee Master', href: '/admin/masters/services' },
      { type: 'item', label: 'SAC Code Master', href: '/admin/masters/sac-codes' },
      { type: 'item', label: 'GST & TDS Master', href: '/admin/masters/tax' },
      { type: 'item', label: 'Workflow Master', href: '/admin/masters/workflows' },
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
