import type { ReactNode, MouseEvent } from 'react'
import { useId, useState } from 'react'
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { Check, MoreVertical } from 'lucide-react'
import { IconButton, Tooltip } from '@/design-system/UIComponents'
import {
  ExecutiveCard,
  formatDelta,
  useUiKitAnimatedNumber,
} from '../../shared/dashboard-ui-kit'

export type ExecutiveKpiTone = 'positive' | 'negative' | 'warning' | 'info' | 'neutral'

export type ExecutiveKpiPeriodKey = 'today' | 'mtd' | 'ytd'

export interface ExecutiveKpiPeriodOption {
  value: ExecutiveKpiPeriodKey
  label: string
}

function toneColor(tone: ExecutiveKpiTone, theme: Theme): string {
  switch (tone) {
    case 'positive':
      return theme.palette.success.main
    case 'negative':
      return theme.palette.error.main
    case 'warning':
      return theme.palette.warning.main
    case 'info':
      return theme.palette.info.main
    default:
      return theme.palette.text.secondary
  }
}

function iconToneColor(tone: ExecutiveKpiTone, theme: Theme): string {
  if (tone === 'neutral') return theme.palette.primary.main
  return toneColor(tone, theme)
}

export interface ExecutiveKpiCardProps {
  title: string
  value: string | number
  tooltip: string
  icon?: ReactNode
  tone?: ExecutiveKpiTone
  delta?: number
  deltaLabel?: string
  supportingLines?: string[]
  /** Optional period caption under the value (e.g. MTD). */
  periodLabel?: string
  /** When set, shows ⋮ menu with Today / MTD / YTD. */
  periodOptions?: ExecutiveKpiPeriodOption[]
  periodKey?: ExecutiveKpiPeriodKey
  onPeriodChange?: (next: ExecutiveKpiPeriodKey) => void
  footer?: ReactNode
  loading?: boolean
  empty?: boolean
  animate?: boolean
  onClick?: () => void
}

/** Compact executive KPI — icon + title + ⋮ · value · divider · meta below. */
export function ExecutiveKpiCard({
  title,
  value,
  tooltip,
  icon,
  tone = 'neutral',
  delta,
  deltaLabel,
  supportingLines,
  periodLabel,
  periodOptions,
  periodKey,
  onPeriodChange,
  footer,
  loading,
  empty,
  animate = true,
  onClick,
}: ExecutiveKpiCardProps) {
  const theme = useTheme()
  const menuId = useId()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(menuAnchor)

  const numeric = typeof value === 'number' ? value : null
  const animated = useUiKitAnimatedNumber(numeric ?? 0, {
    enabled: animate && numeric != null && !loading,
  })
  const displayValue =
    numeric != null && animate
      ? Number.isInteger(numeric)
        ? Math.round(animated).toLocaleString()
        : animated.toFixed(1)
      : value

  const deltaTone: ExecutiveKpiTone =
    delta !== undefined ? (delta > 0 ? 'positive' : delta < 0 ? 'negative' : tone) : tone

  const hasBelow =
    delta !== undefined ||
    Boolean(periodLabel) ||
    Boolean(supportingLines && supportingLines.length > 0) ||
    Boolean(footer)

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setMenuAnchor(e.currentTarget)
  }

  const closeMenu = () => setMenuAnchor(null)

  const card = (
    <ExecutiveCard
      density="compact"
      elevation="raised"
      hoverable={Boolean(onClick)}
      loading={loading}
      empty={empty}
      emptyTitle="No data"
      emptyDescription="KPI unavailable for this filter set."
      aria-label={`${title}: ${String(value)}`}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : undefined,
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        sx={{ height: '100%', minWidth: 0 }}
      >
        <Stack spacing={0.75} sx={{ height: '100%' }}>
          {/* Header: [Icon] Title ··· [⋮] */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={0.75}
            useFlexGap
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              useFlexGap
              sx={{ minWidth: 0, flex: 1 }}
            >
              {icon ? (
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    bgcolor: alpha(iconToneColor(tone, theme), 0.12),
                    color: iconToneColor(tone, theme),
                    '& svg': { width: 14, height: 14 },
                  }}
                >
                  {icon}
                </Box>
              ) : null}
              <Typography
                color="text.secondary"
                fontWeight={600}
                sx={{
                  fontSize: 11,
                  lineHeight: 1.25,
                  letterSpacing: 0.15,
                  minWidth: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Typography>
            </Stack>

            {periodOptions && periodOptions.length > 0 && onPeriodChange ? (
              <Box
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                sx={{ flexShrink: 0 }}
              >
                <IconButton
                  icon={<MoreVertical size={16} />}
                  size="sm"
                  tooltip="Select period"
                  onClick={openMenu}
                />
                <Menu
                  id={menuId}
                  anchorEl={menuAnchor}
                  open={menuOpen}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  onClick={(e) => e.stopPropagation()}
                  slotProps={{
                    paper: {
                      sx: { minWidth: 140 },
                    },
                  }}
                >
                  {periodOptions.map((option) => {
                    const selected = option.value === periodKey
                    return (
                      <MenuItem
                        key={option.value}
                        selected={selected}
                        onClick={(e) => {
                          e.stopPropagation()
                          onPeriodChange(option.value)
                          closeMenu()
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          {selected ? <Check size={14} /> : <Box sx={{ width: 14 }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={option.label}
                          primaryTypographyProps={{ fontSize: 13, fontWeight: selected ? 600 : 400 }}
                        />
                      </MenuItem>
                    )
                  })}
                </Menu>
              </Box>
            ) : null}
          </Stack>

          {/* Value */}
          <Box>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: { xs: '1.2rem', md: '1.35rem' },
                lineHeight: 1.15,
                letterSpacing: -0.35,
                color: 'text.primary',
              }}
            >
              {displayValue}
            </Typography>
            {periodLabel ? (
              <Typography
                color="text.secondary"
                sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2, mt: 0.25 }}
              >
                {periodLabel}
              </Typography>
            ) : null}
          </Box>

          {/* Below divider: delta · supporting · footer */}
          {hasBelow ? (
            <>
              <Divider sx={{ borderColor: 'divider' }} />
              <Stack spacing={0.5} sx={{ flex: 1, minHeight: 0 }}>
                {delta !== undefined ? (
                  <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap flexWrap="wrap">
                    <Typography
                      fontWeight={700}
                      sx={{ fontSize: 11, lineHeight: 1.2, color: toneColor(deltaTone, theme) }}
                    >
                      {formatDelta(delta)}
                    </Typography>
                    {deltaLabel ? (
                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: 11,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {deltaLabel}
                      </Typography>
                    ) : null}
                  </Stack>
                ) : null}

                {supportingLines && supportingLines.length > 0 ? (
                  <Stack spacing={0.25}>
                    {supportingLines.map((line) => (
                      <Typography
                        key={line}
                        color="text.secondary"
                        sx={{ fontSize: 11, lineHeight: 1.3 }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Stack>
                ) : null}

                {footer ? <Box sx={{ mt: 'auto', pt: 0.25 }}>{footer}</Box> : null}
              </Stack>
            </>
          ) : null}
        </Stack>
      </Box>
    </ExecutiveCard>
  )

  return (
    <Tooltip content={tooltip} placement="top" maxWidth={260}>
      <Box sx={{ height: '100%', minWidth: 0 }}>{card}</Box>
    </Tooltip>
  )
}
