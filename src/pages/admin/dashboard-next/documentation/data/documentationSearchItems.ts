import type { ExecutiveSearchItem } from '../../shared/dashboard-intelligence'
import { applicationPipelineStageHref } from '../../shared/config/applicationPipeline'
import type { DocWorkDeskId } from '../types'

export function buildDocumentationSearchItems(options: {
  onNavigate: (href: string) => void
  onOpenTab: (tabId: string) => void
  onOpenWorkDesk?: (deskId: DocWorkDeskId) => void
}): ExecutiveSearchItem[] {
  const openDesk = (desk: DocWorkDeskId) => {
    if (options.onOpenWorkDesk) options.onOpenWorkDesk(desk)
    else options.onOpenTab('work')
  }

  return [
    {
      id: 'doc-tab-overview',
      title: 'Overview',
      subtitle: 'Pipeline · QC · country/client · to-action',
      category: 'section',
      onSelect: () => options.onOpenTab('overview'),
    },
    {
      id: 'doc-tab-work',
      title: 'Work',
      subtitle: 'Submission Pending · Payment · Arrange Insurance · Review Reupload',
      category: 'section',
      onSelect: () => options.onOpenTab('work'),
    },
    {
      id: 'doc-desk-submission',
      title: 'Submission Pending',
      subtitle: 'Primary Docs work desk',
      category: 'section',
      onSelect: () => openDesk('submission_pending'),
    },
    {
      id: 'doc-desk-payment',
      title: 'Pending Payment',
      subtitle: 'Work desk',
      category: 'section',
      onSelect: () => openDesk('pending_payment'),
    },
    {
      id: 'doc-desk-insurance',
      title: 'Arrange Insurance',
      subtitle: 'GLTS travel insurance pending',
      category: 'section',
      onSelect: () => openDesk('arrange_insurance'),
    },
    {
      id: 'doc-desk-ops',
      title: 'Review Reupload',
      subtitle: 'Re-uploaded docs ready for Docs review',
      category: 'section',
      onSelect: () => openDesk('waiting_on_ops'),
    },
    {
      id: 'doc-tab-performance',
      title: 'Performance',
      subtitle: 'SLA · throughput · capacity',
      category: 'section',
      onSelect: () => options.onOpenTab('performance'),
    },
    {
      id: 'doc-tab-reports',
      title: 'Reports',
      subtitle: 'Bulletin · SLA · pipeline · TAT · custody · courier · insurance',
      category: 'section',
      onSelect: () => options.onOpenTab('reports'),
    },
    {
      id: 'doc-am-submission',
      title: 'AM — Submission Pending',
      subtitle: 'Application management',
      category: 'action',
      href: applicationPipelineStageHref('online_submission_pending'),
      onSelect: () =>
        options.onNavigate(applicationPipelineStageHref('online_submission_pending')),
    },
    {
      id: 'doc-am-payment',
      title: 'AM — Pending Payment',
      subtitle: 'Application management',
      category: 'action',
      href: applicationPipelineStageHref('pending_payment'),
      onSelect: () => options.onNavigate(applicationPipelineStageHref('pending_payment')),
    },
    {
      id: 'doc-am-vfs',
      title: 'AM — Embassy/VFS Submitted',
      subtitle: 'Visibility only',
      category: 'action',
      href: applicationPipelineStageHref('vfs_submission_pending'),
      onSelect: () =>
        options.onNavigate(applicationPipelineStageHref('vfs_submission_pending')),
    },
  ]
}
