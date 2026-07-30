import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'
import {
  opsApplicationListPath,
  opsAssignmentPath,
  opsGroundCasePath,
} from '../utils/opsSegmentPaths'

export function buildOperationsSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
}): ExecutiveSearchItem[] {
  return [
    {
      id: 'ops-tab-overview',
      title: 'Overview',
      subtitle: 'Alerts · pipeline · infographics',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'ops-tab-work',
      title: 'Work',
      subtitle: 'Personal desk — verify, payment, book, submit',
      category: 'section',
      onSelect: () => options.onOpenTab('work'),
    },
    {
      id: 'ops-tab-performance',
      title: 'Performance',
      subtitle: 'Throughput · SLA · capacity',
      category: 'section',
      onSelect: () => options.onOpenTab('performance'),
    },
    {
      id: 'ops-tab-reports',
      title: 'Reports',
      subtitle: 'Ops report pack and exports',
      category: 'section',
      onSelect: () => options.onOpenTab('reports'),
    },
    {
      id: 'ops-verification',
      title: 'Verification pending',
      subtitle: 'Application Management',
      category: 'action',
      href: opsApplicationListPath('marine', 'verification_pending'),
      onSelect: () => options.onNavigate(opsApplicationListPath('marine', 'verification_pending')),
    },
    {
      id: 'ops-payment',
      title: 'Pending payment',
      subtitle: 'Application Management',
      category: 'action',
      href: opsApplicationListPath('marine', 'pending_payment'),
      onSelect: () => options.onNavigate(opsApplicationListPath('marine', 'pending_payment')),
    },
    {
      id: 'ops-assignment',
      title: 'Assignment priority',
      subtitle: 'Retail assignment desk',
      category: 'action',
      href: opsAssignmentPath('retail'),
      onSelect: () => options.onNavigate(opsAssignmentPath('retail')),
    },
    {
      id: 'ops-ground',
      title: 'Ground case handling',
      subtitle: 'Ground Operations',
      category: 'action',
      href: opsGroundCasePath(),
      onSelect: () => options.onNavigate(opsGroundCasePath()),
    },
  ]
}
