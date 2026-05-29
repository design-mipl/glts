import { Grid, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { buildVerifyApplicantSummaryFields } from '../../utils/verifyApplicantSummaryFields'

interface VerifyDocumentsSummaryProps {
  selectedRow: UploadQueueRow
  detail: ApplicationDetailViewModel
  applicationId: string
}

export function VerifyDocumentsSummary({
  selectedRow,
  detail,
  applicationId,
}: VerifyDocumentsSummaryProps) {
  const documentsLabel =
    selectedRow.documentsTotal > 0
      ? `${selectedRow.documentsComplete}/${selectedRow.documentsTotal} complete`
      : '—'

  const { primary, marine } = buildVerifyApplicantSummaryFields(
    selectedRow,
    detail,
    applicationId,
    documentsLabel,
  )

  const midpoint = Math.ceil(primary.length / 2)
  const leftPrimary = primary.slice(0, midpoint)
  const rightPrimary = primary.slice(midpoint)

  return (
    <BaseCard sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        Applicant summary
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            {leftPrimary.map(({ label, value }) => (
              <Grid size={{ xs: 6 }} key={label}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            {rightPrimary.map(({ label, value }) => (
              <Grid size={{ xs: 6 }} key={label}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {marine.some(f => f.value !== '—') ? (
        <>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2, mb: 1.5 }}>
            Employment / marine details
          </Typography>
          <Grid container spacing={1.5}>
            {marine.map(({ label, value }) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
    </BaseCard>
  )
}
