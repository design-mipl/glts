import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { ClipboardList, FileText, HandCoins, Truck } from 'lucide-react'
import { BarChart, DonutChart, ProgressBar, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import {
  TEAM_PRODUCTIVITY_CHANNEL_TABS,
  TEAM_PRODUCTIVITY_TEAM_LABELS,
  type TeamProductivityChannelId,
  type TeamProductivityTeamId,
} from '../../config/teamProductivity'
import {
  resolveTeamCapacityStatus,
  TEAM_CAPACITY_STATUS_LABELS,
} from '../../config/teamCapacity'
import { StatusBadge } from '../StatusBadge'
import type { DashboardStatusTone } from '../../types'
import type { TeamProductivityByChannel, TeamProductivityMetric } from './teamProductivityData'

export type { TeamProductivityByChannel, TeamProductivityMetric } from './teamProductivityData'

const TEAM_ICONS: Record<TeamProductivityTeamId, ReactNode> = {
  ops: <ClipboardList size={18} />,
  docs: <FileText size={18} />,
  ground: <Truck size={18} />,
  accounts: <HandCoins size={18} />,
}

function statusTone(utilization: number): DashboardStatusTone {
  const status = resolveTeamCapacityStatus(utilization)
  if (status === 'overloaded') return 'error'
  if (status === 'busy') return 'warning'
  return 'success'
}

function utilizationOf(row: TeamProductivityMetric): number {
  if (row.capacity <= 0) return 0
  return Math.min(100, Math.round((row.openCases / row.capacity) * 100))
}

export interface TeamProductivityInfographicProps {
  data: TeamProductivityByChannel
  loading?: boolean
  onViewAll?: () => void
  title?: string
  description?: string
}

/**
 * Infographic: Ops / Docs / Ground / Accounts with Marine · Corporate · Retail tabs
 * and a team comparison bar chart.
 */
export function TeamProductivityInfographic({
  data,
  loading = false,
  onViewAll,
  title = 'Team productivity',
  description = 'Ops, Documentation, Ground, and Accounts — filter by Marine, Corporate, or Retail.',
}: TeamProductivityInfographicProps) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const [channel, setChannel] = useState<TeamProductivityChannelId>('all')

  const teams = data[channel] ?? data.all

  const donutSlices = useMemo(
    () =>
      teams.map((row) => ({
        key: row.teamId,
        label: row.label,
        value: Math.max(row.completedToday, 0),
      })),
    [teams],
  )

  const completedTotal = donutSlices.reduce((sum, slice) => sum + slice.value, 0)

  const barData = useMemo(
    () =>
      teams.map((row) => ({
        team: row.label || TEAM_PRODUCTIVITY_TEAM_LABELS[row.teamId],
        open: row.openCases,
        done: row.completedToday,
        utilization: utilizationOf(row),
      })),
    [teams],
  )

  return (
    <Box
      sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}
      role="region"
      aria-label={title}
    >
      <Stack spacing={0}>
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <ExecutiveSectionHeader
            title={title}
            description={description}
            actionLabel={onViewAll ? 'View teams' : undefined}
            onAction={onViewAll}
          />
        </Box>

        <Box sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs
            value={channel}
            onChange={(value) => setChannel(value as TeamProductivityChannelId)}
            variant="underline"
            size="sm"
            items={TEAM_PRODUCTIVITY_CHANNEL_TABS.map((tab) => ({
              value: tab.value,
              label: tab.label,
            }))}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading productivity…
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: 1.5,
                }}
              >
                {teams.map((row) => {
                  const utilization = utilizationOf(row)
                  const tone = statusTone(utilization)
                  const status = resolveTeamCapacityStatus(utilization)
                  const accent =
                    tone === 'error'
                      ? theme.palette.error.main
                      : tone === 'warning'
                        ? theme.palette.warning.main
                        : theme.palette.success.main

                  return (
                    <Box
                      key={row.teamId}
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.25,
                        minHeight: 168,
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1.5,
                              display: 'grid',
                              placeItems: 'center',
                              bgcolor: alpha(accent, 0.12),
                              color: accent,
                              flexShrink: 0,
                            }}
                          >
                            {TEAM_ICONS[row.teamId]}
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ fontSize: 13 }}
                            noWrap
                          >
                            {row.label || TEAM_PRODUCTIVITY_TEAM_LABELS[row.teamId]}
                          </Typography>
                        </Stack>
                        <StatusBadge
                          label={TEAM_CAPACITY_STATUS_LABELS[status]}
                          tone={tone}
                          size="sm"
                        />
                      </Stack>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 28,
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: '-0.03em',
                            color: accent,
                          }}
                        >
                          {utilization}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                          Capacity used
                        </Typography>
                      </Box>

                      <ProgressBar value={utilization} size="sm" showValue={false} />

                      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                        <MetricChip label="Open" value={row.openCases} />
                        <MetricChip label="Done today" value={row.completedToday} />
                        <MetricChip label="SLA" value={`${row.slaPercent}%`} />
                      </Stack>
                    </Box>
                  )
                })}
              </Box>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                alignItems={{ md: 'stretch' }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                    sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}
                  >
                    Team workload comparison
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: 11 }}>
                    Open cases vs completions today by team
                  </Typography>
                  <BarChart
                    data={barData}
                    xKey="team"
                    height={220}
                    barSize={22}
                    showGrid
                    showLegend
                    bars={[
                      { key: 'open', label: 'Open cases' },
                      { key: 'done', label: 'Done today' },
                    ]}
                  />
                </Box>

                <Box
                  sx={{
                    width: { xs: '100%', md: 220 },
                    flexShrink: 0,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                    sx={{
                      alignSelf: 'flex-start',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                    }}
                  >
                    Completions mix
                  </Typography>
                  <DonutChart
                    data={donutSlices}
                    height={168}
                    centerValue={String(completedTotal)}
                    centerLabel="done"
                    showLegend={false}
                  />
                </Box>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

function MetricChip({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: 10, display: 'block', lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  )
}
