import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'

export type AssignmentSegmentKey = 'marine' | 'b2b' | 'corporate' | 'retail'

export interface AssignmentSegmentConfig {
  key: AssignmentSegmentKey
  segment: ApplicationCustomerSegment
  label: string
  queueTitle: string
  queueSubtitle: string
  applicationListPath: string
  routePath: string
  /** Compact operational queue layout for dense assignment management screens. */
  listingLayout?: 'standard' | 'operational'
}

export const ASSIGNMENT_SEGMENTS: Record<AssignmentSegmentKey, AssignmentSegmentConfig> = {
  marine: {
    key: 'marine',
    segment: 'marine',
    label: 'Marine',
    queueTitle: 'Marine assignment queue',
    queueSubtitle: 'Passenger-level operational assignment, priority, and SLA visibility for marine submissions.',
    applicationListPath: '/admin/application-management/marine',
    routePath: '/admin/assignment-priority/marine',
    listingLayout: 'operational',
  },
  b2b: {
    key: 'b2b',
    segment: 'b2bAgents',
    label: 'B2B',
    queueTitle: 'B2B assignment queue',
    queueSubtitle: 'Operational routing and priority management for B2B agent passenger records.',
    applicationListPath: '/admin/application-management/b2b-agents',
    routePath: '/admin/assignment-priority/b2b',
  },
  corporate: {
    key: 'corporate',
    segment: 'corporate',
    label: 'Corporate',
    queueTitle: 'Corporate assignment queue',
    queueSubtitle: 'Assign and prioritize corporate passenger operational work after submission.',
    applicationListPath: '/admin/application-management/corporate',
    routePath: '/admin/assignment-priority/corporate',
  },
  retail: {
    key: 'retail',
    segment: 'retail',
    label: 'Retail',
    queueTitle: 'Retail assignment queue',
    queueSubtitle: 'Retail passenger assignment and carry-forward handling after submission.',
    applicationListPath: '/admin/application-management/retail',
    routePath: '/admin/assignment-priority/retail',
  },
}

export function getAssignmentSegmentConfig(key: AssignmentSegmentKey): AssignmentSegmentConfig {
  return ASSIGNMENT_SEGMENTS[key]
}
