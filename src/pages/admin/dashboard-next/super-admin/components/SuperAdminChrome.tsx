import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BarChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  colorSlices,
  useDashboardChartColors,
  useDashboardChartSeries,
  type DashboardChartColors,
} from '@/shared/theme/dashboardChartColors'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../shared'

/** Standard chart height — aligned with Ops/Accounts denser panels. */
export const SA_CHART_HEIGHT = 220
export const SA_CHART_HEIGHT_DENSE = 180

/** Top-N ranking options — same pattern as Admin Visa Analytics. */
export const SA_TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 10', value: '10' },
  { label: 'Top 15', value: '15' },
  { label: 'Top 20', value: '20' },
] as const

export type SuperAdminTopN = '5' | '10' | '15' | '20'

export function sliceTopN<T>(rows: T[], topN: SuperAdminTopN): T[] {
  return rows.slice(0, Number(topN))
}

export function useTopN(initial: SuperAdminTopN = '10') {
  const [topN, setTopN] = useState<SuperAdminTopN>(initial)
  return { topN, setTopN }
}

export function TopNSelect({
  value,
  onChange,
  ariaLabel = 'Ranking limit',
}: {
  value: SuperAdminTopN
  onChange: (next: SuperAdminTopN) => void
  ariaLabel?: string
}) {
  return (
    <Box
      sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Select
        size="sm"
        fullWidth
        aria-label={ariaLabel}
        value={value}
        options={[...SA_TOP_N_OPTIONS]}
        onChange={(next) => onChange(String(next) as SuperAdminTopN)}
      />
    </Box>
  )
}

export function useSuperAdminChartColors(): DashboardChartColors {
  return useDashboardChartColors()
}

export function useSuperAdminChartSeries(): readonly string[] {
  return useDashboardChartSeries()
}

export { colorSlices }

function truncateLabel(label: string, max = 18) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function rankNumericValue(item: {
  value?: string | number
  progress?: number
}): number {
  if (typeof item.value === 'number' && Number.isFinite(item.value)) return item.value
  if (typeof item.value === 'string') {
    const parsed = Number.parseFloat(item.value.replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(parsed)) return parsed
  }
  return item.progress ?? 0
}

/**
 * Horizontal multi-color ranking chart with per-panel Top N (Admin Analytics pattern).
 * Single-series bars use chart-theme category colors automatically.
 */
export function SuperAdminRankChart({
  title,
  items,
  loading,
  valueLabel = 'Value',
  initialTopN = '10',
}: {
  title: string
  items: Array<{ id: string; primary: string; value?: string | number; progress?: number }>
  loading?: boolean
  valueLabel?: string
  initialTopN?: SuperAdminTopN
}) {
  const { topN, setTopN } = useTopN(initialTopN)
  const rows = useMemo(() => {
    const sorted = [...items].sort((a, b) => rankNumericValue(b) - rankNumericValue(a))
    return sliceTopN(sorted, topN).map((item) => ({
      name: truncateLabel(item.primary),
      value: rankNumericValue(item),
    }))
  }, [items, topN])

  const chartHeight = Math.max(SA_CHART_HEIGHT_DENSE, 28 * Math.max(rows.length, 4))

  return (
    <SuperAdminPanel
      title={title}
      action={<TopNSelect value={topN} onChange={setTopN} ariaLabel={`${title} top N`} />}
    >
      <BarChart
        data={rows}
        xKey="name"
        orientation="horizontal"
        height={chartHeight}
        barSize={14}
        showLegend={false}
        loading={loading}
        bars={[{ key: 'value', label: valueLabel }]}
      />
    </SuperAdminPanel>
  )
}

/**
 * Tab section chrome — navy title (ExecutiveSectionHeader).
 * Set `contained` to wrap the whole section in an executive card (Accounts / Ops ChartPanel pattern).
 */
export function SuperAdminSection({
  title,
  description: _description,
  action,
  actionLabel,
  onAction,
  children,
  contained = false,
}: {
  title: string
  description?: string
  action?: ReactNode
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  /** Wrap header + body in executiveCardLevel2Sx container. */
  contained?: boolean
}) {
  const colors = usePublicBrandColors()
  const header = (
    <ExecutiveSectionHeader
      title={title}
      action={action}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  )

  if (contained) {
    return (
      <Box
        component="section"
        aria-label={title}
        sx={{
          ...executiveCardLevel2Sx(colors),
          p: 2,
          height: '100%',
        }}
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          {header}
          {children}
        </Stack>
      </Box>
    )
  }

  return (
    <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label={title}>
      {header}
      {children}
    </Stack>
  )
}

/**
 * Compact chart/metric panel — same card tokens as OpsOrgInfographics / AnalyticsPanel.
 */
export function SuperAdminPanel({
  title,
  description: _description,
  action,
  onClick,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  onClick?: () => void
  children: ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      sx={{
        ...executiveCardLevel2Sx(colors),
        p: 0,
        overflow: 'hidden',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        '&:hover': onClick ? { borderColor: 'action.selected' } : undefined,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={0.75}
        sx={{ px: 2, pt: 1.75, pb: 1 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 1.75 }}>{children}</Box>
    </Box>
  )
}

/** Soft metric strip card for KPI rows inside a section. */
export function SuperAdminMetricStrip({ children }: { children: ReactNode }) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        ...executiveCardLevel2Sx(colors),
        px: 2,
        py: 1.5,
      }}
    >
      {children}
    </Box>
  )
}

/** Pulse / callout banner matching Admin Operations pulse. */
export function SuperAdminPulseBanner({
  icon,
  title,
  description,
  tone = 'info',
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  tone?: 'info' | 'warning' | 'error' | 'success'
  action?: ReactNode
}) {
  const colors = usePublicBrandColors()
  const bgcolor =
    tone === 'error'
      ? 'error.main'
      : tone === 'warning'
        ? 'warning.main'
        : tone === 'success'
          ? 'success.main'
          : 'info.main'

  return (
    <Box
      sx={{
        ...executiveCardLevel2Sx(colors),
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            bgcolor,
            color: 'common.white',
            flexShrink: 0,
            opacity: 0.92,
          }}
        >
          {icon}
        </Box>
        <Box minWidth={0}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Box>
  )
}
