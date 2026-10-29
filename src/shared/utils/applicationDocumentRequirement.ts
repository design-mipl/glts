import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'

/** Per-application override for B2B admin create. Undefined means documents required. */
export type ApplicationDocumentRequirement = 'required' | 'not_required'

export const DOCUMENT_REQUIREMENT_LABELS: Record<ApplicationDocumentRequirement, string> = {
  required: 'Docs required',
  not_required: 'Docs not required',
}

export function resolveDocumentRequirement(
  row?: { documentRequirement?: ApplicationDocumentRequirement } | null,
): ApplicationDocumentRequirement {
  return row?.documentRequirement === 'not_required' ? 'not_required' : 'required'
}

export function isDocumentNotRequiredApplication(row?: {
  documentRequirement?: ApplicationDocumentRequirement
} | null): boolean {
  return resolveDocumentRequirement(row) === 'not_required'
}

export function resolveDocumentRequirementLabel(row?: {
  documentRequirement?: ApplicationDocumentRequirement
} | null): string {
  return DOCUMENT_REQUIREMENT_LABELS[resolveDocumentRequirement(row)]
}

export function documentRequirementBadgeColor(
  row?: { documentRequirement?: ApplicationDocumentRequirement } | null,
): 'neutral' | 'warning' {
  return isDocumentNotRequiredApplication(row) ? 'warning' : 'neutral'
}

export function resolveDocumentRequirementForSubmit(
  documentRequirement: ApplicationDocumentRequirement | undefined,
  customerSegment: ApplicationCustomerSegment,
): ApplicationDocumentRequirement | undefined {
  if (customerSegment !== 'b2bAgents') return undefined
  return documentRequirement === 'not_required' ? 'not_required' : 'required'
}
