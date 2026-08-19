import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'

export function isMarineApplicationSegment(segment: ApplicationCustomerSegment): boolean {
  return segment === 'marine'
}

export function usesDesignationLabel(segment: ApplicationCustomerSegment): boolean {
  return segment === 'corporate' || segment === 'b2bAgents'
}

export function showsMarineReferenceFields(segment: ApplicationCustomerSegment): boolean {
  return segment === 'marine'
}

export function showsTravelerRoleColumn(segment: ApplicationCustomerSegment): boolean {
  return isMarineApplicationSegment(segment) || usesDesignationLabel(segment)
}

export function getTravelerRoleColumnKey(
  segment: ApplicationCustomerSegment,
): 'rank' | 'designation' | null {
  if (isMarineApplicationSegment(segment)) return 'rank'
  if (usesDesignationLabel(segment)) return 'designation'
  return null
}

export function getTravelerRoleColumnLabel(segment: ApplicationCustomerSegment): string {
  if (isMarineApplicationSegment(segment)) return 'Rank'
  if (usesDesignationLabel(segment)) return 'Designation'
  return ''
}
