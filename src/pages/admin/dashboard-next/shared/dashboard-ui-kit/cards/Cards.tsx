import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../shadcn'
import { UiKitStateFrame } from '../feedback'
import { useUiKitHoverElevationSx } from '../motion'
import { UI_KIT_SPACING, uiKitPad } from '../tokens'
import type { UiKitDensity, UiKitElevation, UiKitStateProps } from '../types'

export interface ExecutiveCardProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  density?: UiKitDensity
  elevation?: UiKitElevation
  hoverable?: boolean
  sx?: SxProps<Theme>
  'aria-label'?: string
}

export function ExecutiveCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
  density = 'comfortable',
  elevation = 'raised',
  hoverable = false,
  sx,
  loading,
  empty,
  error,
  permission,
  onRetry,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  'aria-label': ariaLabel,
}: ExecutiveCardProps) {
  const hoverSx = useUiKitHoverElevationSx(hoverable)
  const hasHeader = Boolean(title || actionLabel)

  return (
    <Card
      elevation={elevation}
      interactive={hoverable}
      aria-label={ariaLabel ?? title}
      sx={{
        p: 0,
        ...hoverSx,
        ...((sx as object) ?? {}),
      }}
    >
      {hasHeader ? (
        <CardHeader
          sx={{
            px: uiKitPad(density),
            pt: uiKitPad(density),
            pb: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          </Box>
          {actionLabel && onAction ? (
            <CardAction>
              <Button variant="ghost" size="sm" type="button" onClick={onAction}>
                {actionLabel}
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent
        sx={{
          px: uiKitPad(density),
          py: hasHeader ? UI_KIT_SPACING.cluster : uiKitPad(density),
          pt: hasHeader ? UI_KIT_SPACING.cluster : uiKitPad(density),
        }}
      >
        <UiKitStateFrame
          loading={loading}
          empty={empty}
          error={error}
          permission={permission}
          onRetry={onRetry}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          errorTitle={errorTitle}
          errorDescription={errorDescription}
        >
          {children}
        </UiKitStateFrame>
      </CardContent>
    </Card>
  )
}

export interface InsightCardProps extends ExecutiveCardProps {
  accent?: 'neutral' | 'info' | 'warning' | 'success' | 'error'
}

export function InsightCard({ accent = 'neutral', sx, ...rest }: InsightCardProps) {
  const theme = useTheme()
  const accentMap = {
    neutral: theme.palette.divider,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
  } as const

  return (
    <ExecutiveCard
      {...rest}
      sx={{
        borderLeft: '3px solid',
        borderLeftColor: accentMap[accent],
        ...((sx as object) ?? {}),
      }}
    />
  )
}

export interface FinancialCardProps extends ExecutiveCardProps {}
export function FinancialCard(props: FinancialCardProps) {
  return <ExecutiveCard {...props} />
}

export interface SegmentCardProps extends ExecutiveCardProps {
  icon?: ReactNode
}

export function SegmentCard({ icon, title, subtitle, children, ...rest }: SegmentCardProps) {
  return (
    <ExecutiveCard {...rest} title={undefined} subtitle={undefined}>
      <Stack direction="row" spacing={UI_KIT_SPACING.field} alignItems="flex-start">
        {icon ? (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {title ? (
            <Typography variant="subtitle2" fontWeight={700}>
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
          <Box sx={{ mt: UI_KIT_SPACING.field }}>{children}</Box>
        </Box>
      </Stack>
    </ExecutiveCard>
  )
}

export interface GlassCardProps extends ExecutiveCardProps {}
export function GlassCard({ sx, ...rest }: GlassCardProps) {
  return (
    <ExecutiveCard
      {...rest}
      elevation="flat"
      sx={{
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.78),
        backdropFilter: 'blur(12px)',
        ...((sx as object) ?? {}),
      }}
    />
  )
}

export interface SummaryCardProps extends ExecutiveCardProps {}
export function SummaryCard(props: SummaryCardProps) {
  return <ExecutiveCard {...props} density="compact" />
}

export interface HighlightCardProps extends ExecutiveCardProps {
  highlight?: string | number
  highlightLabel?: string
}

export function HighlightCard({
  highlight,
  highlightLabel,
  children,
  ...rest
}: HighlightCardProps) {
  return (
    <ExecutiveCard {...rest}>
      {highlight != null ? (
        <Box sx={{ mb: UI_KIT_SPACING.cluster }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ letterSpacing: -0.6, lineHeight: 1.1 }}
          >
            {highlight}
          </Typography>
          {highlightLabel ? (
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {highlightLabel}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
    </ExecutiveCard>
  )
}

export interface KitActionCardProps extends UiKitStateProps {
  title: string
  description?: string
  icon?: ReactNode
  badge?: string
  onClick?: () => void
  disabled?: boolean
  sx?: SxProps<Theme>
}

export function KitActionCard({
  title,
  description,
  icon,
  badge,
  onClick,
  disabled,
  sx,
  permission,
}: KitActionCardProps) {
  return (
    <UiKitStateFrame permission={permission} loading={false} empty={false} error={false}>
      <Card
        elevation="raised"
        interactive={!disabled}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          onClick && !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        sx={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
          ...((sx as object) ?? {}),
        }}
      >
        <CardContent sx={{ py: UI_KIT_SPACING.cluster }}>
          <Stack spacing={UI_KIT_SPACING.field}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {icon ? (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  }}
                >
                  {icon}
                </Box>
              ) : (
                <span />
              )}
              {badge ? <Badge variant="default">{badge}</Badge> : null}
            </Stack>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {title}
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </UiKitStateFrame>
  )
}

/** Alias kept for naming parity with the kit catalog (distinct from DS ActionCard). */
export { KitActionCard as ActionCard }

export interface RiskCardProps extends InsightCardProps {}
export function RiskCard(props: RiskCardProps) {
  return <InsightCard accent="error" {...props} />
}
