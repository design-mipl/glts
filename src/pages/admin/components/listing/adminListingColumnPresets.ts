import {
  LISTING_COLUMN_WIDTHS,
  type ListingColumnWidthSize,
} from '@/design-system/listingColumnWidths'

/** Recommended semantic column roles for admin listing tables. */
export type AdminListingColumnRole =
  | 'actions'
  | 'priority'
  | 'sla'
  | 'count'
  | 'country'
  | 'jurisdiction'
  | 'date'
  | 'code'
  | 'name'
  | 'company'
  | 'assignee'
  | 'status'
  | 'statusGroup'
  | 'vendor'
  | 'service'
  | 'applicationSummary'
  | 'stackedAssignment'
  | 'remarks'
  | 'description'
  | 'activityLog'
  | 'audit'
  | 'email'

const ADMIN_LISTING_COLUMN_ROLE_WIDTH: Record<AdminListingColumnRole, ListingColumnWidthSize> = {
  actions: 'xs',
  priority: 'sm',
  sla: 'sm',
  count: 'sm',
  status: 'sm',
  country: 'md',
  jurisdiction: 'md',
  date: 'md',
  code: 'md',
  name: 'lg',
  company: 'lg',
  assignee: 'lg',
  audit: 'lg',
  statusGroup: 'xl',
  vendor: 'xl',
  service: 'xl',
  applicationSummary: 'xxl',
  stackedAssignment: 'xxl',
  email: 'xxl',
  remarks: 'xxxl',
  description: 'xxxl',
  activityLog: 'xxxl',
}

/** Resolve a recommended admin listing column width in pixels. */
export function adminListingColumnWidth(role: AdminListingColumnRole): number {
  return LISTING_COLUMN_WIDTHS[ADMIN_LISTING_COLUMN_ROLE_WIDTH[role]]
}

/** Recommended width token for an admin listing column role. */
export function adminListingColumnWidthSize(role: AdminListingColumnRole): ListingColumnWidthSize {
  return ADMIN_LISTING_COLUMN_ROLE_WIDTH[role]
}
