import { Grid, Stack, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { CountryConfigSummary } from '@/shared/types/countryMaster'

function SummaryKpi({ label, value }: { label: string; value: number }) {
  return (
    <BaseCard sx={{ px: 2, py: 1.5, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </BaseCard>
  )
}

interface ValidationSummaryProps {
  summary: CountryConfigSummary
  onWarningClick?: (nodePath: string) => void
}

export function ValidationSummary({ summary, onWarningClick }: ValidationSummaryProps) {
  return (
    <Stack spacing={2}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryKpi label="Total Segments" value={summary.totalSegments} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryKpi label="Total Visa Types" value={summary.totalVisaTypes} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryKpi label="Total Jurisdictions" value={summary.totalJurisdictions} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryKpi label="Total Documents" value={summary.totalDocuments} />
        </Grid>
      </Grid>

      {summary.warnings.length > 0 ? (
        <BaseCard sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Validation warnings
          </Typography>
          <Stack spacing={1}>
            {summary.warnings.map((warning) => (
              <Stack
                key={warning.id}
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{
                  cursor: onWarningClick ? 'pointer' : 'default',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': onWarningClick ? { bgcolor: 'action.hover' } : undefined,
                }}
                onClick={() => onWarningClick?.(warning.nodePath)}
              >
                <AlertTriangle
                  size={16}
                  style={{
                    flexShrink: 0,
                    marginTop: 2,
                    color: warning.severity === 'error' ? '#E53935' : '#FF9800',
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {warning.message}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </BaseCard>
      ) : (
        <BaseCard sx={{ p: 2 }}>
          <Typography variant="body2" color="success.main" fontWeight={600}>
            No validation warnings — configuration is ready to publish.
          </Typography>
        </BaseCard>
      )}
    </Stack>
  )
}
