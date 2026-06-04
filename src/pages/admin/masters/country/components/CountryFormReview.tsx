import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import { PROCESSING_TYPE_LABELS } from '../config/countryProcessingConfig'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import { formatPassportIssueLocationsSummary } from './CountryPassportIssueLocationsEditor'

interface CountryFormReviewProps {
  data: CountryMasterFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ fontSize: 13 }}>
      <Typography component="span" sx={{ fontWeight: 600, minWidth: 100, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography component="span" color="text.primary">
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function CountryFormReview({ data }: CountryFormReviewProps) {
  const theme = useTheme()
  const enabledSegments = data.segments.filter((s) => s.enabled)
  let visaCount = 0
  let checklistCount = 0
  for (const seg of enabledSegments) {
    checklistCount += seg.commonDocuments.length
    visaCount += seg.visaTypes.length
    for (const vt of seg.visaTypes) {
      checklistCount += vt.applicationDocuments.length
    }
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Review before submit
      </Typography>
      <Stack spacing={1}>
        <ReviewRow label="Country" value={`${data.name} (${data.code})`} />
        <ReviewRow label="Region" value={data.region} />
        <ReviewRow label="Processing" value={PROCESSING_TYPE_LABELS[data.processingType]} />
        <ReviewRow
          label="Passport locations"
          value={formatPassportIssueLocationsSummary(data.passportIssueLocations)}
        />
        <ReviewRow label="Portal cities" value={data.cities} />
        <ReviewRow
          label="Segments"
          value={enabledSegments.map((s) => SEGMENT_LABELS[s.segment]).join(', ') || 'None'}
        />
        <ReviewRow label="Visa types" value={String(visaCount)} />
        <ReviewRow label="Checklist items" value={String(checklistCount)} />
      </Stack>
    </Box>
  )
}
