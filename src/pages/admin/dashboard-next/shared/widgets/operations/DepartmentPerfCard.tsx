import type { ReactNode } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ProgressBar } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel1Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  resolveTeamCapacityStatus,
  TEAM_CAPACITY_STATUS_LABELS,
} from '../../config/teamCapacity'

export interface DepartmentPerfCardProps {
  /** Department / desk id (kept for callers; no longer drives icon chrome). */
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
 * Quiet department summary — title, capacity, and a one-line metric strip.
 */
export function DepartmentPerfCard({
  label,
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
  const status = resolveTeamCapacityStatus(capacityPercent)
  const interactive = Boolean(onClick)

  const metaParts = [
    users != null ? `${users} users` : null,
    TEAM_CAPACITY_STATUS_LABELS[status],
  ].filter(Boolean)

  const footParts = [
    `Open ${openCases}`,
    `Done ${completedToday}`,
    pending != null ? `Pending ${pending}` : null,
    `SLA ${slaPercent}%`,
  ].filter(Boolean)

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
        ...executiveCardLevel1Sx(colors),
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: 'none',
        '&:hover': interactive
          ? { borderColor: theme.palette.divider, boxShadow: 'none' }
          : { boxShadow: 'none' },
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }} noWrap>
          {label}
        </Typography>
        {metaParts.length > 0 ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {metaParts.join(' · ')}
          </Typography>
        ) : null}
      </Box>

      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {capacityPercent}%
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 11, fontWeight: 400, ml: 0.5 }}
          >
            capacity
          </Typography>
        </Typography>
        {productivityPercent != null ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {productivityPercent}% prod.
          </Typography>
        ) : null}
      </Stack>

      <ProgressBar value={capacityPercent} size="sm" showValue={false} />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: 11, mt: 'auto', lineHeight: 1.4 }}
      >
        {footParts.join(' · ')}
      </Typography>
    </Box>
  )
}
