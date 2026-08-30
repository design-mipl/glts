import { Box, Grid, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getTravelerRoleColumnKey,
  getTravelerRoleColumnLabel,
  usesDesignationLabel,
} from '@/shared/utils/applicationSegmentListingPolicy'
import type { UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'
import { resolveApplicantBasicDetails } from '../utils/applicantBasicDetailsUtils'
import { formatQueueRowGltsLabel } from '../utils/gltsReferenceIds'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import {
  resolveVerifyApplicantSecondaryTitle,
  resolveVerifyApplicantSummaryFields,
  type VerifySummaryField,
} from '../utils/resolveVerifyApplicantSummaryFields'

function SummaryFieldGrid({
  fields,
  columns = { xs: 6, sm: 4 },
}: {
  fields: VerifySummaryField[]
  columns?: { xs: number; sm?: number; md?: number }
}) {
  const colors = usePublicBrandColors()

  return (
    <Grid container spacing={1.5}>
      {fields.map(({ label, value }) => (
        <Grid size={{ xs: columns.xs, sm: columns.sm, md: columns.md }} key={label}>
          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{label}</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>{value}</Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export function buildGltsSummaryFields(
  overview: ApplicationReviewOverview,
  row: UploadQueueRow,
  singleListing: boolean,
): VerifySummaryField[] {
  const gltsLabel = formatQueueRowGltsLabel(row, overview.gltsApplicationId, singleListing)
  const fields: VerifySummaryField[] = []

  if (gltsLabel && gltsLabel !== '—') fields.push({ label: 'GLTS no.', value: gltsLabel })
  if (overview.gltsApplicationId && !singleListing) {
    fields.push({ label: 'Application', value: overview.gltsApplicationId })
  }
  if (overview.gltsBatchId) fields.push({ label: 'Batch', value: overview.gltsBatchId })

  return fields
}

export function buildApplicationSummaryItems(
  overview: ApplicationReviewOverview,
  row: UploadQueueRow,
  options?: { singleListing?: boolean; customerSegment?: ApplicationCustomerSegment },
): Array<[string, string]> {
  const segment = options?.customerSegment ?? 'marine'
  const gltsFields = buildGltsSummaryFields(overview, row, options?.singleListing ?? false)
  const roleLabel = getTravelerRoleColumnLabel(segment)
  const basic = resolveApplicantBasicDetails(row)

  const items: Array<[string, string]> = [
    ...gltsFields.map(f => [f.label, f.value] as [string, string]),
  ]

  if (roleLabel) {
    const roleKey = getTravelerRoleColumnKey(segment)
    const roleValue =
      roleKey === 'designation'
        ? basic.designation?.trim() || '—'
        : roleKey === 'rank'
          ? basic.rank?.trim() || '—'
          : '—'
    items.push([roleLabel, roleValue])
  }

  items.push(
    ['Name', row.travelerName],
    ['Passport', row.passportNo],
    ['Country', `${overview.countryFlag} ${overview.countryName}`.trim()],
    [
      'Visa',
      overview.purposeLabel
        ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
        : overview.visaTypeLabel,
    ],
    ['Travel', formatDisplayDate(overview.travelDate)],
    ['Passport location', overview.issuedPassportLocationLabel || '—'],
    ['Place of residence', overview.placeOfResidenceLabel || '—'],
    ['Jurisdiction', overview.jurisdiction || '—'],
    ['Nationality', row.nationality],
    ['Passport expiry', row.expiry],
    [
      'Documents',
      row.documentsTotal > 0
        ? `${row.documentsComplete}/${row.documentsTotal} complete`
        : '—',
    ],
  )

  if (usesDesignationLabel(segment) && overview.entityName?.trim()) {
    items.push(['Billing entity', overview.entityName.trim()])
  }

  return items
}

interface ApplicationSummaryContentProps {
  overview: ApplicationReviewOverview
  row: UploadQueueRow
  singleListing?: boolean
  customerSegment?: ApplicationCustomerSegment
  verifyContext?: {
    detail: ApplicationDetailViewModel
    applicationId: string
  }
}

export function ApplicationSummaryContent({
  overview,
  row,
  singleListing = false,
  customerSegment = 'marine',
  verifyContext,
}: ApplicationSummaryContentProps) {
  const colors = usePublicBrandColors()

  if (verifyContext) {
    const documentsLabel =
      row.documentsTotal > 0
        ? `${row.documentsComplete}/${row.documentsTotal} complete`
        : '—'

    const { primary, secondary } = resolveVerifyApplicantSummaryFields(
      customerSegment,
      row,
      verifyContext.detail,
      verifyContext.applicationId,
      documentsLabel,
    )

    const gltsFields = buildGltsSummaryFields(overview, row, singleListing)
    const showSecondary = secondary.some(field => field.value !== '—')

    return (
      <Box>
        {gltsFields.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <SummaryFieldGrid fields={gltsFields} columns={{ xs: 6, sm: 4 }} />
          </Box>
        ) : null}

        <SummaryFieldGrid fields={primary} columns={{ xs: 6, sm: 4 }} />

        {showSecondary ? (
          <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${colors.border}` }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: colors.navy, mb: 1.5 }}>
              {resolveVerifyApplicantSecondaryTitle(customerSegment)}
            </Typography>
            <SummaryFieldGrid fields={secondary} columns={{ xs: 12, sm: 6, md: 4 }} />
          </Box>
        ) : null}
      </Box>
    )
  }

  const items = buildApplicationSummaryItems(overview, row, { singleListing, customerSegment })

  return (
    <Grid container spacing={1.5}>
      {items.map(([label, value]) => (
        <Grid size={{ xs: 6, sm: 4 }} key={label}>
          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{label}</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>{value}</Typography>
        </Grid>
      ))}
    </Grid>
  )
}
