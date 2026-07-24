import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'

export function buildOperationsSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'ops-tab-overview',
      title: 'Overview',
      subtitle: 'Operations workspace tab',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'ops-tab-my-work',
      title: 'My Work',
      subtitle: 'Personal workload',
      category: 'section',
      onSelect: () => options.onOpenTab('my-work'),
    },
    {
      id: 'ops-tab-queues',
      title: 'Queues',
      subtitle: 'Action queues',
      category: 'section',
      onSelect: () => options.onOpenTab('queues'),
    },
    {
      id: 'ops-tab-marine',
      title: 'Marine',
      subtitle: 'Priority crew joining cases',
      category: 'section',
      onSelect: () => options.onOpenTab('marine'),
    },
    {
      id: 'ops-tab-appointments',
      title: 'Appointments',
      subtitle: "Today's checklist",
      category: 'section',
      onSelect: () => options.onOpenTab('appointments'),
    },
    {
      id: 'ops-tab-performance',
      title: 'Performance',
      subtitle: 'Personal SLA · capacity',
      category: 'section',
      onSelect: () => options.onOpenTab('performance'),
    },
    {
      id: 'ops-apps',
      title: 'My applications',
      subtitle: 'Open retail queue',
      category: 'action',
      href: '/admin/application-management/retail',
      onSelect: () => options.onNavigate('/admin/application-management/retail'),
    },
    {
      id: 'ops-verification',
      title: 'Verification priority',
      subtitle: 'Assignment priority',
      category: 'action',
      href: '/admin/assignment-priority/retail',
      onSelect: () => options.onNavigate('/admin/assignment-priority/retail'),
    },
    {
      id: 'ops-marine',
      title: 'Marine applications',
      subtitle: 'Marine desk',
      category: 'action',
      href: '/admin/application-management/marine',
      onSelect: () => options.onNavigate('/admin/application-management/marine'),
    },
  ]
}
