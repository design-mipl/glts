import type { ApplicationReviewOverview } from './applicationReviewOverview'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

/** Shared overview meta rows for application summary cards (customer + admin). */
export function buildApplicationOverviewMetaRows(
  overview: ApplicationReviewOverview,
  extras?: { travelerCount?: number; includeConsultantAssignment?: boolean },
): Array<[string, string]> {
  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel

  const rows: Array<[string, string]> = [
    ['Company', overview.companyName?.trim() || '—'],
    ['Billing entity', overview.entityName?.trim() || '—'],
    ['Department', overview.department?.trim() || '—'],
    ['Cost code', overview.costCode?.trim() || '—'],
    ['Note 1', overview.note1?.trim() || '—'],
    ['Note 2', overview.note2?.trim() || '—'],
    ['Vessel', overview.vesselName?.trim() || '—'],
    ['PO / CID no.', overview.poCidNo?.trim() || '—'],
    ['Compass No.', overview.compassNo?.trim() || '—'],
    ['Joining port', overview.joiningPort?.trim() || '—'],
    ['Country', `${overview.countryFlag} ${overview.countryName}`.trim()],
    ['Visa', visaLabel],
  ]

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
