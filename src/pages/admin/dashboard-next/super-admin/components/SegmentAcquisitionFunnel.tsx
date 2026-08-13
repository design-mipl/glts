import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Percent, TrendingDown } from 'lucide-react'
import { Badge } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { SuperAdminPanel } from './SuperAdminChrome'
import { ExecutiveKpiCard } from './ExecutiveKpiCard'
import { computeAcquisitionFunnel } from '../utils/computeAcquisitionFunnel'
import type { SuperAdminAcquisitionFunnel } from '../types'

export interface SegmentAcquisitionFunnelProps {
  data: SuperAdminAcquisitionFunnel
  loading?: boolean
  onNavigate?: (href: string) => void
}

/**
 * Client-acquisition funnel for Segments.
 *
 * Left: conversion rate + largest-leak KPIs.
 * Right: stage bars with volume, % of entry, and step drop-off.
 */
export function SegmentAcquisitionFunnel({
  data,
  loading,
  onNavigate,
}: SegmentAcquisitionFunnelProps) {
  const computed = computeAcquisitionFunnel(data)
  const entry = Math.max(1, computed.entryCount)

  const hasLeak =
    Boolean(computed.leakFromLabel) &&
    Boolean(computed.leakToLabel) &&
    computed.leakDropOffPct != null

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={DASHBOARD_SPACING.field}
      alignItems="stretch"
    >
      <Stack
        spacing={DASHBOARD_SPACING.field}
        sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}
      >
        <ExecutiveKpiCard
          title="Conversion rate"
          tooltip={`${computed.exitLabel} ÷ ${computed.entryLabel} in the selected period.`}
          value={`${computed.conversionRatePct}%`}
          icon={<Percent size={16} />}
          tone={computed.conversionRatePct >= 25 ? 'positive' : 'warning'}
          periodLabel={computed.periodLabel}
          supportingLines={[
            `${computed.exitCount.toLocaleString()} ${computed.exitLabel.toLowerCase()}`,
            `of ${computed.entryCount.toLocaleString()} ${computed.entryLabel.toLowerCase()}`,
          ]}
          loading={loading}
          animate={false}
        />

        <ExecutiveKpiCard
          title="Biggest Drop-off"
          tooltip="Step with the highest drop-off between consecutive funnel stages."
          value={hasLeak ? `−${computed.leakDropOffPct}%` : '—'}
          icon={<TrendingDown size={16} />}
          tone={hasLeak ? 'warning' : 'neutral'}
          supportingLines={
            hasLeak
              ? [
                  `${computed.leakFromLabel}`,
                  `→ ${computed.leakToLabel}`,
                  ...(computed.leakLostCount != null
                    ? [`${computed.leakLostCount.toLocaleString()} lost at this step`]
                    : []),
                ]
              : ['No step drop-off in this period']
          }
          loading={loading}
          animate={false}
        />
      </Stack>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <SuperAdminPanel title="Acquisition funnel">
          <Stack spacing={1}>
            {computed.stages.map((stage, index) => {
              const widthPct = Math.max(4, (stage.count / entry) * 100)
              const isLeak = stage.id === computed.leakStageId
              return (
                <Box key={stage.id}>
                  {index > 0 && stage.dropOffPct != null ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ pl: { xs: 0, sm: '28%' }, mb: 0.5 }}
                    >
                      <Badge
                        label={`−${stage.dropOffPct}% drop-off`}
                        color={isLeak ? 'warning' : 'neutral'}
                        size="sm"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {stage.lostFromPrevious?.toLocaleString() ?? 0} lost · kept{' '}
                        {stage.retentionPct}%
                      </Typography>
                    </Stack>
                  ) : null}

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    sx={{
                      cursor: stage.href && onNavigate ? 'pointer' : 'default',
                      borderRadius: 1,
                      px: 0.5,
                      py: 0.25,
                      '&:hover':
                        stage.href && onNavigate
                          ? { bgcolor: (t) => alpha(t.palette.primary.main, 0.04) }
                          : undefined,
                    }}
                    onClick={() => {
                      if (stage.href && onNavigate) onNavigate(stage.href)
                    }}
                    role={stage.href && onNavigate ? 'link' : undefined}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ width: { sm: '28%' }, flexShrink: 0 }}
                      noWrap
                    >
                      {stage.label}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          height: 10,
                          width: `${widthPct}%`,
                          maxWidth: '100%',
                          borderRadius: 999,
                          bgcolor: isLeak ? 'warning.main' : 'primary.main',
                          opacity: 0.85,
                          transition: 'width 0.35s ease',
                        }}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="baseline"
                      sx={{
                        width: { sm: 120 },
                        justifyContent: 'flex-end',
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="body2" fontWeight={700}>
                        {stage.count.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stage.ofEntryPct}%
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </SuperAdminPanel>
      </Box>
    </Stack>
  )
}
