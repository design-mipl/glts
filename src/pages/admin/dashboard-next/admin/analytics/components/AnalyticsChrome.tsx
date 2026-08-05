import { Box, Stack, Typography } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  VISA_ANALYTICS_TOP_N_OPTIONS,
  type VisaAnalyticsTopN,
} from '../config/visaAnalyticsConfig'

export function TopNSelect({
  value,
  onChange,
  ariaLabel = 'Ranking limit',
}: {
  value: VisaAnalyticsTopN
  onChange: (next: VisaAnalyticsTopN) => void
  ariaLabel?: string
}) {
  return (
    <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
      <Select
        size="sm"
        fullWidth
        aria-label={ariaLabel}
        value={value}
        options={[...VISA_ANALYTICS_TOP_N_OPTIONS]}
        onChange={(next) => onChange(String(next) as VisaAnalyticsTopN)}
      />
    </Box>
  )
}

/** Compact chart/table panel. */
export function AnalyticsPanel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={0.75}
        sx={{ px: 1.5, pt: 1.25, pb: 0.75 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 1.5, pb: 1.5 }}>{children}</Box>
    </Box>
  )
}

/** Compact chart height used across Visa Analytics sections. */
export const ANALYTICS_CHART_HEIGHT = 180
