import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildAdminSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'admin-tab-overview',
      title: 'Overview',
      subtitle: 'Admin workspace tab',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'admin-tab-applications',
      title: 'Applications',
      subtitle: 'Funnel · verification',
      category: 'section',
      onSelect: () => options.onOpenTab('applications'),
    },
    {
      id: 'admin-tab-operations',
      title: 'Operations',
      subtitle: 'Health · marine · passport',
      category: 'section',
      onSelect: () => options.onOpenTab('operations'),
    },
    {
      id: 'admin-tab-analytics',
      title: 'Analytics',
      subtitle: 'Revenue · branch · country',
      category: 'section',
      onSelect: () => options.onOpenTab('analytics'),
    },
    {
      id: 'admin-tab-risk',
      title: 'Risk & Compliance',
      subtitle: 'SLA · risk alerts',
      category: 'section',
      onSelect: () => options.onOpenTab('risk-compliance'),
    },
    {
      id: 'admin-retail-queue',
      title: 'Retail application queue',
      subtitle: 'Open applications',
      category: 'action',
      href: '/admin/application-management/retail',
      onSelect: () => options.onNavigate('/admin/application-management/retail'),
    },
    {
      id: 'admin-verification',
      title: 'Verification priority',
      subtitle: 'Assignment priority',
      category: 'action',
      href: '/admin/assignment-priority/retail',
      onSelect: () => options.onNavigate('/admin/assignment-priority/retail'),
    },
    {
      id: 'admin-finance',
      title: 'Invoices',
      subtitle: 'Finance workspace',
      category: 'action',
      href: '/admin/finance/invoices',
      onSelect: () => options.onNavigate('/admin/finance/invoices'),
    },
  ]
}
