import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import type { ApplicationReviewOverview } from './applicationReviewOverview'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import {
  isMarineApplicationSegment,
  usesDesignationLabel,
} from '@/shared/utils/applicationSegmentListingPolicy'

export interface ApplicationOverviewMetaRowExtras {
  travelerCount?: number
  includeConsultantAssignment?: boolean
  /** Defaults to marine-compatible full set when omitted (legacy callers). Prefer explicit segment. */
  customerSegment?: ApplicationCustomerSegment
}

/** Shared overview meta rows for application summary cards (customer + admin). */
export function buildApplicationOverviewMetaRows(
  overview: ApplicationReviewOverview,
  extras?: ApplicationOverviewMetaRowExtras,
): Array<[string, string]> {
  const segment = extras?.customerSegment ?? 'marine'
  const isMarine = isMarineApplicationSegment(segment)
  const isBusiness = usesDesignationLabel(segment)
  const isRetail = segment === 'retail'

  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel

  const rows: Array<[string, string]> = []

  if (!isRetail) {
    rows.push(['Company', overview.companyName?.trim() || '—'])
  } else if (overview.companyName?.trim()) {
    rows.push(['Company', overview.companyName.trim()])
  }

  if (isBusiness || isMarine) {
    rows.push(['Billing entity', overview.entityName?.trim() || '—'])
  }

  if (isBusiness) {
    if (overview.department?.trim()) {
      rows.push(['Department', overview.department.trim()])
    }
    if (overview.costCode?.trim()) {
      rows.push(['Cost code', overview.costCode.trim()])
    }
    if (overview.note1?.trim()) {
      rows.push(['Note 1', overview.note1.trim()])
    }
    if (overview.note2?.trim()) {
      rows.push(['Note 2', overview.note2.trim()])
    }
  }

  if (isMarine) {
    rows.push(
      ['Vessel', overview.vesselName?.trim() || '—'],
      ['PO / CID no.', overview.poCidNo?.trim() || '—'],
      ['Compass No.', overview.compassNo?.trim() || '—'],
      ['Joining port', overview.joiningPort?.trim() || '—'],
    )
  }

  rows.push(
    ['Country', `${overview.countryFlag} ${overview.countryName}`.trim()],
    ['Visa', visaLabel],
  )

  if (overview.issuedPassportLocationLabel) {
    rows.push(['Passport state', overview.issuedPassportLocationLabel])
  }
  if (overview.placeOfResidenceLabel) {
    rows.push(['Place of residence', overview.placeOfResidenceLabel])
  }

  rows.push(
    ['Jurisdiction', overview.jurisdiction || '—'],
    ['Travel', formatDisplayDate(overview.travelDate)],
  )

  if (extras?.travelerCount !== undefined) {
    rows.push(['Travelers', String(extras.travelerCount)])
  }

  const showAssignment =
    extras?.includeConsultantAssignment ||
    Boolean(overview.consultantName || overview.consultantTeamName || overview.priority || overview.isVip)

  if (showAssignment) {
    const consultant =
      overview.consultantName && overview.consultantTeamName
        ? `${overview.consultantName} · ${overview.consultantTeamName}`
        : overview.consultantName || overview.consultantTeamName || '—'
    rows.push(['Consultant', consultant])
    rows.push(['Priority', overview.priority?.trim() || '—'])
    if (overview.isVip) {
      rows.push(['VIP', 'Green Star'])
    }
  }

  return rows
}
