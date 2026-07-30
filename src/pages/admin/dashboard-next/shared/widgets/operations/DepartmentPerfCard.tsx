import type { ReactNode } from 'react'
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { ClipboardList, FileText, HandCoins, Truck, Users } from 'lucide-react'
import { ProgressBar } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  resolveTeamCapacityStatus,
  TEAM_CAPACITY_STATUS_LABELS,
} from '../../config/teamCapacity'
import { StatusBadge } from '../StatusBadge'
import type { DashboardStatusTone } from '../../types'

const DEPARTMENT_ICONS: Record<string, ReactNode> = {
  ops: <ClipboardList size={16} />,
  docs: <FileText size={16} />,
  ground: <Truck size={16} />,
  accounts: <HandCoins size={16} />,
}

function toneForCapacity(capacityPercent: number): DashboardStatusTone {
  const status = resolveTeamCapacityStatus(capacityPercent)
  if (status === 'overloaded') return 'error'
  if (status === 'busy') return 'warning'
  return 'success'
}

export interface DepartmentPerfCardProps {
  /** Department / desk id for icon lookup (`ops` | `docs` | `ground` | `accounts`). */
  id?: string
  label: string
  icon?: ReactNode
  users?: number
  capacityPercent: number
  openCases: number
  completedToday: number
  pending?: number
  slaPercent: number
  productivityPercent?: number
  onClick?: () => void
}

/**
 * Shared department / desk performance card — capacity hero, status badge,
 * and compact metric strip. Used by Teams & Productivity Overview and the
 * Team Productivity infographic.
 */
export function DepartmentPerfCard({
  id,
  label,
  icon,
  users,
  capacityPercent,
  openCases,
  completedToday,
  pending,
  slaPercent,
  productivityPercent,
  onClick,
}: DepartmentPerfCardProps) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const tone = toneForCapacity(capacityPercent)
  const status = resolveTeamCapacityStatus(capacityPercent)
  const accent =
    tone === 'error'
      ? theme.palette.error.main
      : tone === 'warning'
        ? theme.palette.warning.main
        : theme.palette.success.main
  const resolvedIcon = icon ?? (id ? DEPARTMENT_ICONS[id] : undefined) ?? (
    <ClipboardList size={16} />
  )
  const interactive = Boolean(onClick)

  return (
    <Box
      role={interactive ? 'button' : 'article'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`${label}: ${capacityPercent}% capacity`}
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
        display: 'flex',
        flexDirection: 'column',
        minHeight: 220,
        height: '100%',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease',
        borderColor: alpha(accent, 0.28),
        '&:hover': interactive
          ? {
              boxShadow: theme.shadows[3],
              transform: 'translateY(-1px)',
              borderColor: alpha(accent, 0.45),
            }
          : {
              borderColor: alpha(accent, 0.4),
            },
      }}
    >
      <Box
        sx={{
          px: 1.75,
          pt: 1.5,
          pb: 1.25,
          background: `linear-gradient(180deg, ${alpha(accent, 0.1)} 0%, ${alpha(accent, 0)} 100%)`,
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(accent, 0.14),
                color: accent,
                flexShrink: 0,
                border: '1px solid',
                borderColor: alpha(accent, 0.22),
              }}
            >
              {resolvedIcon}
            </Box>
            <Box minWidth={0}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }} noWrap>
                {label}
              </Typography>
              {users != null ? (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                  <Users size={11} color={theme.palette.text.secondary} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                    {users} users
                  </Typography>
                </Stack>
              ) : null}
            </Box>
          </Stack>
          <StatusBadge label={TEAM_CAPACITY_STATUS_LABELS[status]} tone={tone} size="sm" />
        </Stack>

        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 1.5 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: accent,
              }}
            >
              {capacityPercent}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Capacity used
            </Typography>
          </Box>
          {productivityPercent != null ? (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14, lineHeight: 1.2 }}>
                {productivityPercent}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                Productivity
              </Typography>
            </Box>
          ) : null}
        </Stack>

        <Box sx={{ mt: 1 }}>
          <ProgressBar value={capacityPercent} size="sm" showValue={false} />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 'auto',
          px: 1.5,
          py: 1.25,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.action.hover, 0.35),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              pending != null ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
            gap: 0.75,
          }}
        >
          <MetricCell label="Open" value={openCases} />
          <MetricCell label="Done" value={completedToday} />
          {pending != null ? <MetricCell label="Pending" value={pending} /> : null}
          <MetricCell label="SLA" value={`${slaPercent}%`} accent={accent} />
        </Box>
      </Box>
    </Box>
  )
}

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <Box
      sx={{
        px: 0.75,
        py: 0.65,
        borderRadius: 1.25,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 0,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: 10, display: 'block', lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ fontSize: 13, lineHeight: 1.3, color: accent ?? 'text.primary' }}
        noWrap
      >
        {value}
      </Typography>
    </Box>
  )
}
