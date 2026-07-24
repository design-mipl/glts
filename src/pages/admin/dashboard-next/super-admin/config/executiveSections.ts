import type { ExecutiveSectionNavItem } from '../../shared/dashboard-intelligence'

/** Super Admin executive story anchors — shared nav + scroll spy. */
export const SUPER_ADMIN_EXECUTIVE_SECTIONS: ExecutiveSectionNavItem[] = [
  { id: 'executive-hero', label: 'Hero' },
  { id: 'revenue-trend', label: 'Revenue' },
  { id: 'business-segments', label: 'Segments' },
  { id: 'revenue-intelligence', label: 'Revenue intel' },
  { id: 'client-intelligence', label: 'Clients' },
  { id: 'marine-intelligence', label: 'Marine', segmentFocus: 'marine' },
  { id: 'finance', label: 'Finance' },
  { id: 'operations', label: 'Operations' },
  { id: 'sales', label: 'Sales' },
  { id: 'management-alerts', label: 'Alerts' },
  { id: 'staff-productivity', label: 'People' },
  { id: 'quick-actions', label: 'Actions' },
]
