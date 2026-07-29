import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExecutiveSectionHeader } from './ExecutiveSectionHeader'
import { executiveCardLevel2Sx } from './executiveDashboardTokens'

export type WorkloadDisplayStatus = 'balanced' | 'approaching' | 'overloaded'

export interface ExecutiveTeamWorkloadItem {
  id: string
  team: string
  openCases: number
  completedToday: number
  capacityPct: number
  slaPct: number
}

function resolveWorkloadStatus(capacityPct: number): WorkloadDisplayStatus {
  if (capacityPct > 120) return 'overloaded'
  if (capacityPct > 100) return 'approaching'
  return 'balanced'
}

function statusChip(status: WorkloadDisplayStatus): { label: string; color: 'success' | 'warning' | 'error' } {
  if (status === 'overloaded') return { label: 'Overloaded', color: 'error' }
  if (status === 'approaching') return { label: 'Approaching capacity', color: 'warning' }
  return { label: 'Balanced', color: 'success' }
}

function capacityBarColor(pct: number): 'success' | 'warning' | 'error' {
  if (pct > 120) return 'error'
  if (pct > 100) return 'warning'
  return 'success'
}

function TeamWorkloadRow({
  item,
  onView,
}: {
  item: ExecutiveTeamWorkloadItem
  onView?: (item: ExecutiveTeamWorkloadItem) => void
}) {
  const colors = usePublicBrandColors()
  const status = resolveWorkloadStatus(item.capacityPct)
  const chip = statusChip(status)
  const barColor =
    capacityBarColor(item.capacityPct) === 'error'
      ? '#DC2626'
      : capacityBarColor(item.capacityPct) === 'warning'
        ? '#D97706'
        : colors.greenDark

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        transition: 'background-color 160ms ease, border-color 160ms ease',
        '&:hover': { bgcolor: colors.white, borderColor: colors.greenBright },
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Box sx={{ minWidth: { md: 160 } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy }}>{item.team}</Typography>
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
            {item.openCases} open · {item.completedToday} completed today
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textMuted }}>Capacity</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.navy }}>{item.capacityPct}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(item.capacityPct, 140)}
            sx={{
              height: 6,
              borderRadius: 99,
              bgcolor: colors.surfaceAlt,
              '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: 99 },
            }}
          />
        </Box>
        <Box sx={{ minWidth: { md: 100 } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, mb: 0.25 }}>SLA</Typography>
          <Badge label={`${item.slaPct}%`} color="info" size="sm" />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Badge label={chip.label} color={chip.color} size="sm" />
          {onView ? (
            <Button
              label="Open queue"
              variant="text"
              size="sm"
              endIcon={<ArrowRight size={14} />}
              onClick={() => onView(item)}
            />
          ) : null}
        </Stack>
      </Stack>
    </Box>
  )
}

export interface ExecutiveTeamWorkloadPanelProps {
  items: ExecutiveTeamWorkloadItem[]
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onViewTeam?: (item: ExecutiveTeamWorkloadItem) => void
}

export function ExecutiveTeamWorkloadPanel({
  items,
  title,
  description,
  actionLabel,
  onAction,
  onViewTeam,
}: ExecutiveTeamWorkloadPanelProps) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
      {title ? (
        <Box sx={{ mb: 2 }}>
          <ExecutiveSectionHeader
            title={title}
            description={description}
            actionLabel={actionLabel}
            onAction={onAction}
          />
        </Box>
      ) : null}
      <Stack spacing={1.25}>
        {items.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: colors.textMuted, py: 2, textAlign: 'center' }}>
            No team workload data for the selected filters.
          </Typography>
        ) : (
          items.map((item) => <TeamWorkloadRow key={item.id} item={item} onView={onViewTeam} />)
        )}
      </Stack>
    </Box>
  )
}
