import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Button, Separator } from '../shadcn'
import { ExecutiveCard } from '../cards'
import { UI_KIT_SPACING } from '../tokens'
import type { UiKitStateProps, UiKitWidth } from '../types'

export interface ChartHeaderProps {
  title?: string
  subtitle?: string
  action?: ReactNode
}

export function ChartHeader({ title, subtitle, action }: ChartHeaderProps) {
  if (!title && !action) return null
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={UI_KIT_SPACING.field}
      sx={{ mb: UI_KIT_SPACING.cluster }}
    >
      <Box sx={{ minWidth: 0 }}>
        {title ? (
          <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: -0.2 }}>
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Stack>
  )
}

export interface ChartToolbarProps {
  children: ReactNode
}

export function ChartToolbar({ children }: ChartToolbarProps) {
  return (
    <Stack
      direction="row"
      spacing={UI_KIT_SPACING.field}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{ mb: UI_KIT_SPACING.cluster }}
    >
      {children}
    </Stack>
  )
}

export interface ChartContainerProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  toolbar?: ReactNode
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  /** Large visualizations should use `hero` or `full`. */
  width?: UiKitWidth
  minHeight?: number
  sx?: SxProps<Theme>
}

export function ChartContainer({
  title,
  subtitle,
  toolbar,
  actionLabel,
  onAction,
  children,
  width = 'full',
  minHeight = 280,
  sx,
  ...state
}: ChartContainerProps) {
  return (
    <Box
      sx={{
        width: width === 'auto' ? 'auto' : '100%',
        gridColumn: width === 'hero' || width === 'full' ? '1 / -1' : undefined,
        ...((sx as object) ?? {}),
      }}
    >
      <ExecutiveCard
        {...state}
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        onAction={onAction}
      >
        {toolbar ? (
          <>
            {toolbar}
            <Box sx={{ my: UI_KIT_SPACING.field }}>
              <Separator />
            </Box>
          </>
        ) : null}
        <Box sx={{ minHeight, width: '100%', minWidth: 0 }}>{children}</Box>
      </ExecutiveCard>
    </Box>
  )
}

export function HeroChart(props: ChartContainerProps) {
  return <ChartContainer {...props} width="hero" minHeight={props.minHeight ?? 360} />
}

export function AnalyticsChart(props: ChartContainerProps) {
  return <ChartContainer {...props} width="full" />
}

export function TrendContainer(props: ChartContainerProps) {
  return <ChartContainer {...props} width="hero" minHeight={props.minHeight ?? 320} />
}

export function FullWidthChart(props: ChartContainerProps) {
  return <ChartContainer {...props} width="full" />
}

export function FunnelContainer(props: ChartContainerProps) {
  return <ChartContainer {...props} width="hero" minHeight={props.minHeight ?? 300} />
}

export function HeatmapContainer(props: ChartContainerProps) {
  return <ChartContainer {...props} width="full" minHeight={props.minHeight ?? 340} />
}

export interface ChartActionProps {
  label: string
  onClick?: () => void
}

export function ChartAction({ label, onClick }: ChartActionProps) {
  return (
    <Button variant="ghost" size="sm" type="button" onClick={onClick}>
      {label}
    </Button>
  )
}
