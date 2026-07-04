import { Box, Grid, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'
import { formatQueueRowGltsLabel } from '../utils/gltsReferenceIds'
import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import {
  buildVerifyApplicantSummaryFields,
  type VerifySummaryField,
} from '@/pages/admin/application-management/marine/utils/verifyApplicantSummaryFields'

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
  options?: { singleListing?: boolean },
): Array<[string, string]> {
  const gltsFields = buildGltsSummaryFields(overview, row, options?.singleListing ?? false)

  return [
    ...gltsFields.map(f => [f.label, f.value] as [string, string]),
    ['Name', row.travelerName],
    ['Passport', row.passportNo],
    ['Country', `${overview.countryFlag} ${overview.countryName}`.trim()],
    [
      'Visa',
      overview.purposeLabel
        ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
        : overview.visaTypeLabel,
    ],
    ['Travel', overview.travelDate || '—'],
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
  ]
}

interface ApplicationSummaryContentProps {
  overview: ApplicationReviewOverview
  row: UploadQueueRow
  singleListing?: boolean
  verifyContext?: {
    detail: ApplicationDetailViewModel
    applicationId: string
  }
}

export function ApplicationSummaryContent({
  overview,
  row,
  singleListing = false,
  verifyContext,
}: ApplicationSummaryContentProps) {
  const colors = usePublicBrandColors()

  if (verifyContext) {
    const documentsLabel =
      row.documentsTotal > 0
        ? `${row.documentsComplete}/${row.documentsTotal} complete`
        : '—'

    const { primary, marine } = buildVerifyApplicantSummaryFields(
      row,
      verifyContext.detail,
      verifyContext.applicationId,
      documentsLabel,
    )

    const gltsFields = buildGltsSummaryFields(overview, row, singleListing)
    const showMarine = marine.some(field => field.value !== '—')

    return (
      <Box>
        {gltsFields.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <SummaryFieldGrid fields={gltsFields} columns={{ xs: 6, sm: 4 }} />
          </Box>
        ) : null}

        <SummaryFieldGrid fields={primary} columns={{ xs: 6, sm: 4 }} />

        {showMarine ? (
          <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${colors.border}` }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: colors.navy, mb: 1.5 }}>
              Employment / marine details
            </Typography>
            <SummaryFieldGrid fields={marine} columns={{ xs: 12, sm: 6, md: 4 }} />
          </Box>
        ) : null}
      </Box>
    )
  }

  const items = buildApplicationSummaryItems(overview, row, { singleListing })

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
