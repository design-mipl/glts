import type { ElementType, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { websiteHeadingSx } from '../../theme/websiteComponentStyles'

export interface ProcessTimelineStep {
  title: string
  description: string
  icon: ElementType
  id?: string
  number?: string | number
}

export type ProcessTimelineVariant = 'journey' | 'visa-journey' | 'partnership' | 'illustrated'

interface ResponsiveProcessTimelineProps<T extends ProcessTimelineStep> {
  steps: readonly T[]
  ariaLabel: string
  variant: ProcessTimelineVariant
  horizontalAt: number
  desktopColumns?: number
  tabletColumns?: number
  listSx?: SxProps<Theme>
  itemSx?: SxProps<Theme>
  getItemSx?: (step: T, index: number) => SxProps<Theme>
  renderStep: (step: T, index: number, horizontalAt: number) => ReactNode
}

/** Shared accessible list and responsive grid for public process timelines. */
export function ResponsiveProcessTimeline<T extends ProcessTimelineStep>({
  steps,
  ariaLabel,
  variant,
  horizontalAt,
  desktopColumns = steps.length,
  tabletColumns,
  listSx,
  itemSx,
  getItemSx,
  renderStep,
}: ResponsiveProcessTimelineProps<T>) {
  const layout = variant === 'illustrated' ? 'grid' : 'linear'
  return (
    <Box
      component="ol"
      aria-label={ariaLabel}
      data-timeline-variant={variant}
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: layout === 'grid' ? { xs: 5, sm: 6 } : { xs: 0, desktop: 3 },
        listStyle: 'none',
        m: 0,
        p: 0,
        ...(layout === 'grid' && tabletColumns ? {
          [`@media (min-width: ${ds.breakpoint.mobileMedium}px)`]: {
            gridTemplateColumns: `repeat(${tabletColumns}, minmax(0, 1fr))`,
          },
        } : {}),
        [`@media (min-width: ${horizontalAt}px)`]: {
          gridTemplateColumns: `repeat(${desktopColumns}, minmax(0, 1fr))`,
        },
        ...listSx as object,
      }}
    >
      {steps.map((step, index) => (
        <Box component="li" key={step.id ?? step.title} sx={getItemSx?.(step, index) ?? itemSx}>
          {renderStep(step, index, horizontalAt)}
        </Box>
      ))}
    </Box>
  )
}

interface ProcessTimelineMarkerProps {
  icon: ElementType
  number?: string | number
  iconSize?: number
  containerSize?: number | Record<string, number>
  numberSize?: number
  background?: string
  borderColor?: string
  color?: string
  numberBackground?: string
  numberColor?: string
  numberPlacement?: 'corner' | 'topCenter'
  borderWidth?: number
  strokeWidth?: number
  sx?: SxProps<Theme>
  containerSx?: SxProps<Theme>
  numberSx?: SxProps<Theme>
}

/** Token-based marker used by the public process timeline variants. */
export function ProcessTimelineMarker({
  icon: Icon,
  number,
  iconSize = ds.icon.process,
  containerSize = ds.icon.processContainer,
  numberSize = 26,
  background = ds.color.white,
  borderColor = ds.color.border,
  color = ds.color.brandHover,
  numberBackground = ds.color.brandHover,
  numberColor = ds.color.white,
  numberPlacement = 'corner',
  borderWidth = 2,
  strokeWidth = ds.icon.strokeWidth,
  sx,
  containerSx,
  numberSx,
}: ProcessTimelineMarkerProps) {
  return (
    <Box aria-hidden="true" sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...sx as object }}>
      <Box
        sx={{
          width: containerSize,
          height: containerSize,
          borderRadius: '50%',
          bgcolor: background,
          border: `${borderWidth}px solid ${borderColor}`,
          display: 'grid',
          placeItems: 'center',
          color,
          ...containerSx as object,
        }}
      >
        <Icon size={iconSize} color="currentColor" strokeWidth={strokeWidth} aria-hidden="true" />
      </Box>
      {number !== undefined && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            top: numberPlacement === 'topCenter' ? -8 : -6,
            right: numberPlacement === 'topCenter' ? 'auto' : -8,
            left: numberPlacement === 'topCenter' ? '50%' : 'auto',
            transform: numberPlacement === 'topCenter' ? 'translate(-50%, -50%)' : 'none',
            minWidth: numberSize,
            height: numberSize,
            px: 0.25,
            borderRadius: '50%',
            bgcolor: numberBackground,
            color: numberColor,
            fontSize: ds.type.caption.size,
            fontWeight: 700,
            lineHeight: 1,
            display: 'grid',
            placeItems: 'center',
            ...numberSx as object,
          }}
        >
          {number}
        </Box>
      )}
    </Box>
  )
}

interface ProcessTimelineCopyProps {
  title: ReactNode
  description: ReactNode
  number?: ReactNode
  titleComponent?: ElementType
  titleClassName?: string
  titleSx?: SxProps<Theme>
  descriptionSx?: SxProps<Theme>
  numberSx?: SxProps<Theme>
  sx?: SxProps<Theme>
}

/** Shared type roles for step labels and supporting copy, with page-level color/layout overrides. */
export function ProcessTimelineCopy({
  title,
  description,
  number,
  titleComponent = 'h3',
  titleClassName,
  titleSx,
  descriptionSx,
  numberSx,
  sx,
}: ProcessTimelineCopyProps) {
  return (
    <Box sx={sx}>
      {number !== undefined && (
        <Typography component="span" sx={{ display: 'block', fontSize: ds.type.caption.size, fontWeight: 700, lineHeight: ds.type.caption.lineHeight, ...numberSx as object }}>
          {number}
        </Typography>
      )}
      <Typography component={titleComponent} className={titleClassName} sx={{ ...websiteHeadingSx.cardTitle, mb: 0.75, ...titleSx as object }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: ds.type.bodySmall.size, lineHeight: ds.type.bodySmall.lineHeight, ...descriptionSx as object }}>
        {description}
      </Typography>
    </Box>
  )
}
