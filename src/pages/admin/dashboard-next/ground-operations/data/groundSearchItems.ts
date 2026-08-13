import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildGroundSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'go-tab-overview',
      title: 'Overview',
      subtitle: 'Ground Operations pulse',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'go-tab-desk',
      title: 'Operations Desk',
      subtitle: 'Pending · moved · docs submitted',
      category: 'section',
      onSelect: () => options.onOpenTab('operations-desk'),
    },
    {
      id: 'go-tab-logistics',
      title: 'Logistics',
      subtitle: 'In transit · courier AWB',
      category: 'section',
      onSelect: () => options.onOpenTab('logistics'),
    },
    {
      id: 'go-tab-claims',
      title: 'Claim sheets',
      subtitle: 'Finance review status',
      category: 'section',
      onSelect: () => options.onOpenTab('claim-sheets'),
    },
    {
      id: 'go-tab-funds',
      title: 'Fund utilization',
      subtitle: 'Allocated batches · settlement',
      category: 'section',
      onSelect: () => options.onOpenTab('funds'),
    },
    {
      id: 'go-desk',
      title: 'Open Operations Desk',
      subtitle: 'Case handling workspace',
      category: 'action',
      href: '/admin/ground-operations/case-handling',
      onSelect: () => options.onNavigate('/admin/ground-operations/case-handling'),
    },
    {
      id: 'go-logistics',
      title: 'Open Tracking & Logistics',
      subtitle: 'Collection · dispatch · delivery',
      category: 'action',
      href: '/admin/ground-operations/logistics',
      onSelect: () => options.onNavigate('/admin/ground-operations/logistics'),
    },
    {
      id: 'go-funds',
      title: 'Open Fund utilization',
      subtitle: 'Allocated funds · settlement',
      category: 'action',
      href: '/admin/ground-operations/funds',
      onSelect: () => options.onNavigate('/admin/ground-operations/funds'),
    },
  ]
}
