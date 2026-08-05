import { Box, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'

interface VerifyApplicationSummaryProps {
  overview: VerifyOverviewData
  isBulk?: boolean
}

function formatTravelDate(value: string): string {
  if (!value?.trim() || value === '—') return '—'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="baseline" sx={{ minWidth: 0 }}>
      <Typography
        component="span"
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: 11, fontWeight: 600, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
        sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}
      >
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

export function VerifyApplicationSummary({ overview, isBulk = false }: VerifyApplicationSummaryProps) {
  const primaryId = overview.gltsBatchId || overview.gltsApplicationId || '—'
  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel
  const countryLabel = [overview.countryFlag, overview.countryName].filter(Boolean).join(' ')

  return (
    <BaseCard>
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.25 }}>
                Application overview
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  fontSize: 16,
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {primaryId}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Badge label={isBulk ? 'Bulk' : 'Single'} color="neutral" size="sm" />
              <Badge
                label={`${overview.travelerCount} traveler${overview.travelerCount === 1 ? '' : 's'}`}
                color="info"
                size="sm"
              />
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap', rowGap: 1, columnGap: 2.5 }}
          >
            {overview.gltsBatchId && overview.gltsApplicationId ? (
              <MetaChip label="App" value={overview.gltsApplicationId} />
            ) : null}
            <MetaChip label="Country" value={countryLabel} />
            <MetaChip label="Visa" value={visaLabel} />
            <MetaChip label="Jurisdiction" value={overview.jurisdiction || '—'} />
            <MetaChip label="Travel" value={formatTravelDate(overview.travelDate)} />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
