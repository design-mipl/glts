import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildDocumentationSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'doc-tab-overview',
      title: 'Overview',
      subtitle: 'Documentation workspace tab',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'doc-tab-processing',
      title: 'Processing',
      subtitle: 'Applications · forms · fees',
      category: 'section',
      onSelect: () => options.onOpenTab('processing'),
    },
    {
      id: 'doc-tab-qc',
      title: 'QC',
      subtitle: 'Review · corrections',
      category: 'section',
      onSelect: () => options.onOpenTab('qc'),
    },
    {
      id: 'doc-tab-submission',
      title: 'Submission',
      subtitle: 'Ready · pending filing',
      category: 'section',
      onSelect: () => options.onOpenTab('submission'),
    },
    {
      id: 'doc-tab-activity',
      title: 'Activity',
      subtitle: 'Alerts · audit trail',
      category: 'section',
      onSelect: () => options.onOpenTab('activity'),
    },
    {
      id: 'doc-tab-reports',
      title: 'Reports',
      subtitle: 'Daily documentation reports',
      category: 'section',
      onSelect: () => options.onOpenTab('reports'),
    },
    {
      id: 'doc-apps-marine',
      title: 'Marine applications',
      subtitle: 'Application management',
      category: 'action',
      href: '/admin/application-management/marine',
      onSelect: () => options.onNavigate('/admin/application-management/marine'),
    },
    {
      id: 'doc-expenses',
      title: 'Fee payments',
      subtitle: 'Expense management',
      category: 'action',
      href: '/admin/finance/expenses',
      onSelect: () => options.onNavigate('/admin/finance/expenses'),
    },
    {
      id: 'doc-ground',
      title: 'Ground case handling',
      subtitle: 'Appointments · submission',
      category: 'action',
      href: '/admin/ground-operations/case-handling',
      onSelect: () => options.onNavigate('/admin/ground-operations/case-handling'),
    },
  ]
}
