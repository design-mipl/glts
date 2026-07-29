import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  WORKFORCE_BOTTOM_N_OPTIONS,
  WORKFORCE_TOP_N_OPTIONS,
  type WorkforceBottomN,
  type WorkforceTopN,
} from '../config/workforceAnalyticsConfig'

export { DepartmentPerfCard } from '../../../shared/widgets/operations/DepartmentPerfCard'
export type { DepartmentPerfCardProps } from '../../../shared/widgets/operations/DepartmentPerfCard'

export function TopNSelect({
  value,
  onChange,
  ariaLabel = 'Ranking limit',
}: {
  value: WorkforceTopN
  onChange: (next: WorkforceTopN) => void
  ariaLabel?: string
}) {
  return (
    <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
      <Select
        size="sm"
        fullWidth
        aria-label={ariaLabel}
        value={value}
        options={[...WORKFORCE_TOP_N_OPTIONS]}
        onChange={(next) => onChange(String(next) as WorkforceTopN)}
      />
    </Box>
  )
}

export function BottomNSelect({
  value,
  onChange,
  ariaLabel = 'Bottom ranking limit',
}: {
  value: WorkforceBottomN
  onChange: (next: WorkforceBottomN) => void
  ariaLabel?: string
}) {
  return (
    <Box sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}>
      <Select
        size="sm"
        fullWidth
        aria-label={ariaLabel}
        value={value}
        options={[...WORKFORCE_BOTTOM_N_OPTIONS]}
        onChange={(next) => onChange(String(next) as WorkforceBottomN)}
      />
    </Box>
  )
}

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
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

export function WorkloadHeatmap({
  rows,
}: {
  rows: Array<{ id: string; name: string; tone: 'normal' | 'busy' | 'overloaded' }>
}) {
  const theme = useTheme()
  const colorFor = (tone: 'normal' | 'busy' | 'overloaded') => {
    if (tone === 'overloaded') return theme.palette.error.main
    if (tone === 'busy') return theme.palette.warning.main
    return theme.palette.success.main
  }
  const labelFor = (tone: 'normal' | 'busy' | 'overloaded') => {
    if (tone === 'overloaded') return 'Overloaded'
    if (tone === 'busy') return 'Busy'
    return 'Normal'
  }

  return (
    <Stack spacing={1}>
      {rows.map((row) => {
        const color = colorFor(row.tone)
        return (
          <Stack key={row.id} direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: color,
                boxShadow: `0 0 0 4px ${alpha(color, 0.16)}`,
                flexShrink: 0,
              }}
              aria-hidden
            />
            <Typography variant="body2" sx={{ fontSize: 13, flex: 1 }} noWrap>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {labelFor(row.tone)}
            </Typography>
          </Stack>
        )
      })}
      <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
        <LegendDot color={theme.palette.success.main} label="Normal" />
        <LegendDot color={theme.palette.warning.main} label="Busy" />
        <LegendDot color={theme.palette.error.main} label="Overloaded" />
      </Stack>
    </Stack>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {label}
      </Typography>
    </Stack>
  )
}
