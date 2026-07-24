import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { Badge, Progress } from '../shadcn'
import { ExecutiveCard } from '../cards'
import { useUiKitAnimatedNumber } from '../hooks'
import { clampProgress, formatDelta } from '../utils'
import { UI_KIT_SPACING } from '../tokens'
import type { UiKitMetricValue, UiKitStateProps } from '../types'

type Tone = NonNullable<UiKitMetricValue['tone']>

function toneColor(tone: Tone | undefined, theme: Theme): string {
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

function progressTone(tone: Tone): 'default' | 'success' | 'warning' | 'error' {
  if (tone === 'positive') return 'success'
  if (tone === 'negative') return 'error'
  if (tone === 'warning') return 'warning'
  return 'default'
}

export interface MetricBaseProps extends UiKitStateProps, UiKitMetricValue {
  sx?: SxProps<Theme>
  animate?: boolean
}

function MetricShell({
  label,
  value,
  helperText,
  delta,
  deltaLabel,
  icon,
  tone = 'neutral',
  animate = false,
  sx,
  size = 'md',
  ...state
}: MetricBaseProps & { size?: 'sm' | 'md' | 'lg' }) {
  const theme = useTheme()
  const numeric = typeof value === 'number' ? value : null
  const animated = useUiKitAnimatedNumber(numeric ?? 0, {
    enabled: animate && numeric != null,
  })
  const displayValue = numeric != null && animate ? Math.round(animated).toLocaleString() : value

  /** Dense hierarchy: value leads; label + delta support. */
  const valueSize =
    size === 'lg'
      ? { xs: '1.35rem', md: '1.5rem' }
      : size === 'sm'
        ? '1.125rem'
        : { xs: '1.2rem', md: '1.35rem' }
  const iconBox = size === 'lg' ? 32 : size === 'sm' ? 24 : 28
  const deltaTone = delta !== undefined ? (delta > 0 ? 'positive' : delta < 0 ? 'negative' : tone) : tone
  const showHelper = Boolean(helperText) && !(delta !== undefined && deltaLabel)

  return (
    <ExecutiveCard {...state} sx={sx} density="compact" elevation="flat">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            color="text.secondary"
            fontWeight={600}
            sx={{
              fontSize: 11,
              lineHeight: 1.25,
              letterSpacing: 0.15,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {label}
          </Typography>
          <Typography
            fontWeight={800}
            sx={{
              mt: 0.5,
              fontSize: valueSize,
              lineHeight: 1.15,
              letterSpacing: -0.35,
              color: 'text.primary',
            }}
          >
            {displayValue}
          </Typography>
          {delta !== undefined ? (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 0.5 }}
              flexWrap="nowrap"
              useFlexGap
            >
              <Typography
                fontWeight={700}
                sx={{ fontSize: 11, lineHeight: 1.2, color: toneColor(deltaTone, theme), flexShrink: 0 }}
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
          {showHelper ? (
            <Typography
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block', fontSize: 11, lineHeight: 1.25 }}
            >
              {helperText}
            </Typography>
          ) : null}
        </Box>
        {icon ? (
          <Box
            sx={{
              width: iconBox,
              height: iconBox,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              flexShrink: 0,
              '& svg': { width: iconBox * 0.5, height: iconBox * 0.5 },
            }}
          >
            {icon}
          </Box>
        ) : null}
      </Stack>
    </ExecutiveCard>
  )
}

/** Dense hero KPI — primary strip metric across Dashboard Next workspaces. */
export function HeroMetric(props: MetricBaseProps) {
  return <MetricShell {...props} size="lg" animate={props.animate ?? true} />
}

export function ExecutiveMetric(props: MetricBaseProps) {
  return <MetricShell {...props} size="md" />
}

export function TrendMetric(props: MetricBaseProps) {
  return <MetricShell {...props} size="md" />
}

export function FinancialMetric(props: MetricBaseProps) {
  return <MetricShell {...props} size="md" />
}

export function ComparisonMetric(props: MetricBaseProps) {
  return <MetricShell {...props} size="sm" />
}

export interface HealthScoreProps extends UiKitStateProps {
  label?: string
  score: number
  helperText?: string
  sx?: SxProps<Theme>
}

export function HealthScore({
  label = 'Health score',
  score,
  helperText,
  sx,
  ...state
}: HealthScoreProps) {
  const value = clampProgress(score)
  const tone: Tone = value >= 80 ? 'positive' : value >= 60 ? 'warning' : 'negative'
  return (
    <ExecutiveCard {...state} sx={sx} density="compact" elevation="flat">
      <Typography color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography fontWeight={800} sx={{ mt: 0.5, fontSize: '1.5rem', letterSpacing: -0.4, lineHeight: 1.15 }}>
        {Math.round(value)}
      </Typography>
      <Box sx={{ mt: 1.25 }}>
        <Progress value={value} tone={progressTone(tone)} />
      </Box>
      {helperText ? (
        <Typography color="text.secondary" sx={{ mt: 0.75, display: 'block', fontSize: 11 }}>
          {helperText}
        </Typography>
      ) : null}
    </ExecutiveCard>
  )
}

export interface ProgressMetricProps extends UiKitStateProps {
  label: string
  value: number
  helperText?: string
  sx?: SxProps<Theme>
}

export function ProgressMetric({
  label,
  value,
  helperText,
  sx,
  ...state
}: ProgressMetricProps) {
  const progress = clampProgress(value)
  return (
    <ExecutiveCard {...state} sx={sx} density="compact" elevation="flat">
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
          {label}
        </Typography>
        <Typography fontWeight={700} sx={{ fontSize: 13 }}>
          {Math.round(progress)}%
        </Typography>
      </Stack>
      <Box sx={{ mt: 1 }}>
        <Progress value={progress} />
      </Box>
      {helperText ? (
        <Typography color="text.secondary" sx={{ mt: 0.75, display: 'block', fontSize: 11 }}>
          {helperText}
        </Typography>
      ) : null}
    </ExecutiveCard>
  )
}

export interface StatusMetricProps extends UiKitStateProps {
  label: string
  status: string
  tone?: Tone
  icon?: ReactNode
  sx?: SxProps<Theme>
}

export function StatusMetric({
  label,
  status,
  tone = 'neutral',
  icon,
  sx,
  ...state
}: StatusMetricProps) {
  const badgeVariant =
    tone === 'positive'
      ? 'success'
      : tone === 'negative'
        ? 'destructive'
        : tone === 'warning'
          ? 'warning'
          : tone === 'info'
            ? 'info'
            : 'secondary'

  return (
    <ExecutiveCard {...state} sx={sx} density="compact" elevation="flat">
      <Stack direction="row" spacing={UI_KIT_SPACING.field} alignItems="center">
        {icon}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
            {label}
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <Badge variant={badgeVariant}>{status}</Badge>
          </Box>
        </Box>
      </Stack>
    </ExecutiveCard>
  )
}
