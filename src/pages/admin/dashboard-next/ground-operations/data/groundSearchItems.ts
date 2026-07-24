import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildGroundSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'go-tab-overview',
      title: 'Overview',
      subtitle: 'Field workspace tab',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'go-tab-jobs',
      title: "Today's Jobs",
      subtitle: 'Assignments · checklist',
      category: 'section',
      onSelect: () => options.onOpenTab('todays-jobs'),
    },
    {
      id: 'go-tab-routes',
      title: 'Routes',
      subtitle: 'Timeline · passport logistics',
      category: 'section',
      onSelect: () => options.onOpenTab('routes'),
    },
    {
      id: 'go-tab-expenses',
      title: 'Expenses',
      subtitle: 'Field spend',
      category: 'section',
      onSelect: () => options.onOpenTab('expenses'),
    },
    {
      id: 'go-tab-settlements',
      title: 'Settlements',
      subtitle: 'Fund cases',
      category: 'section',
      onSelect: () => options.onOpenTab('settlements'),
    },
    {
      id: 'go-tab-courier',
      title: 'Courier',
      subtitle: 'Tracking · movement',
      category: 'section',
      onSelect: () => options.onOpenTab('courier'),
    },
    {
      id: 'go-desk',
      title: 'Case handling desk',
      subtitle: 'Open field desk',
      category: 'action',
      href: '/admin/ground-operations/case-handling',
      onSelect: () => options.onNavigate('/admin/ground-operations/case-handling'),
    },
    {
      id: 'go-logistics',
      title: 'Logistics',
      subtitle: 'Passport & courier',
      category: 'action',
      href: '/admin/ground-operations/logistics',
      onSelect: () => options.onNavigate('/admin/ground-operations/logistics'),
    },
    {
      id: 'go-funds',
      title: 'Funds & settlements',
      subtitle: 'Ground funds',
      category: 'action',
      href: '/admin/ground-operations/funds',
      onSelect: () => options.onNavigate('/admin/ground-operations/funds'),
    },
  ]
}
