import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Card, Separator } from '../shadcn'
import { UI_KIT_SPACING, UI_KIT_Z, uiKitPad } from '../tokens'
import { uiKitFadeInSx } from '../motion'
import type { UiKitDensity } from '../types'

export interface DashboardSpacingProps {
  size?: keyof typeof UI_KIT_SPACING
  children?: ReactNode
}

/** Vertical rhythm spacer using kit spacing scale. */
export function DashboardSpacing({ size = 'section', children }: DashboardSpacingProps) {
  if (children) {
    return <Stack spacing={UI_KIT_SPACING[size]}>{children}</Stack>
  }
  return <Box sx={{ height: (theme) => theme.spacing(UI_KIT_SPACING[size]) }} aria-hidden />
}

export interface ResponsiveContainerProps {
  children: ReactNode
  maxWidth?: number | string
  sx?: SxProps<Theme>
}

export function ResponsiveContainer({
  children,
  maxWidth = 1440,
  sx,
}: ResponsiveContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        px: { xs: 0, md: 0 },
        ...((sx as object) ?? {}),
      }}
    >
      {children}
    </Box>
  )
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  badge?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  sx?: SxProps<Theme>
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  badge,
  actions,
  meta,
  sx,
}: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: UI_KIT_SPACING.stack,
        mb: UI_KIT_SPACING.section,
        ...((sx as object) ?? {}),
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow ? (
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700, letterSpacing: 0.8 }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Stack direction="row" alignItems="center" spacing={1.25} useFlexGap flexWrap="wrap">
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={{ letterSpacing: -0.35 }}
          >
            {title}
          </Typography>
          {badge}
        </Stack>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.85, maxWidth: 720 }}>
            {subtitle}
          </Typography>
        ) : null}
        {meta ? <Box sx={{ mt: 1.5 }}>{meta}</Box> : null}
      </Box>
      {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
    </Box>
  )
}

export interface SectionHeaderProps {
  title?: string
  subtitle?: string
  /** Business question this section answers. */
  question?: string
  action?: ReactNode
  density?: UiKitDensity
}

export function SectionHeader({
  title,
  subtitle,
  question,
  action,
  density = 'comfortable',
}: SectionHeaderProps) {
  if (!title && !question && !action) return null
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={UI_KIT_SPACING.field}
      sx={{ mb: density === 'compact' ? UI_KIT_SPACING.tight : UI_KIT_SPACING.cluster }}
    >
      <Box sx={{ minWidth: 0 }}>
        {question ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
          >
            {question}
          </Typography>
        ) : null}
        {title ? (
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.primary"
            sx={{ letterSpacing: -0.25 }}
          >
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

export interface SectionDividerProps {
  label?: string
  sx?: SxProps<Theme>
}

export function SectionDivider({ label, sx }: SectionDividerProps) {
  return (
    <Box
      role="separator"
      sx={{
        my: UI_KIT_SPACING.section,
        position: 'relative',
        ...((sx as object) ?? {}),
      }}
    >
      <Separator />
      {label ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: 'absolute',
            top: -10,
            left: 0,
            px: 1,
            bgcolor: 'background.default',
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      ) : null}
    </Box>
  )
}

export interface StickySectionHeaderProps {
  children: ReactNode
  sx?: SxProps<Theme>
}

export function StickySectionHeader({ children, sx }: StickySectionHeaderProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: UI_KIT_Z.sticky,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.82)'
            : 'rgba(248, 250, 252, 0.86)',
        py: UI_KIT_SPACING.field,
        mb: UI_KIT_SPACING.cluster,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        ...((sx as object) ?? {}),
      }}
    >
      {children}
    </Box>
  )
}

export interface DashboardGridProps {
  children: ReactNode
  spacing?: number
  sx?: SxProps<Theme>
}

/** Responsive CSS grid for executive layouts. */
export function DashboardGrid({
  children,
  spacing = UI_KIT_SPACING.field,
  sx,
}: DashboardGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(12, minmax(0, 1fr))',
        },
        ...((sx as object) ?? {}),
      }}
    >
      {children}
    </Box>
  )
}

export interface ExecutiveGridProps {
  children: ReactNode
  /** Columns at large breakpoint (default 4). */
  columns?: 2 | 3 | 4 | 6
  spacing?: number
  sx?: SxProps<Theme>
}

export function ExecutiveGrid({
  children,
  columns = 4,
  spacing = UI_KIT_SPACING.field,
  sx,
}: ExecutiveGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: columns >= 4 ? 'repeat(2, minmax(0, 1fr))' : `repeat(${columns}, minmax(0, 1fr))`,
          lg: `repeat(${columns}, minmax(0, 1fr))`,
        },
        ...((sx as object) ?? {}),
      }}
    >
      {children}
    </Box>
  )
}

export interface ComparisonLayoutProps {
  left: ReactNode
  right: ReactNode
  sx?: SxProps<Theme>
}

export function ComparisonLayout({ left, right, sx }: ComparisonLayoutProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: UI_KIT_SPACING.field,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        ...((sx as object) ?? {}),
      }}
    >
      <Box sx={{ minWidth: 0 }}>{left}</Box>
      <Box sx={{ minWidth: 0 }}>{right}</Box>
    </Box>
  )
}

export interface InsightStackProps {
  children: ReactNode
  spacing?: number
}

export function InsightStack({
  children,
  spacing = UI_KIT_SPACING.stack,
}: InsightStackProps) {
  return <Stack spacing={spacing}>{children}</Stack>
}

interface StorySectionProps {
  title?: string
  subtitle?: string
  question?: string
  action?: ReactNode
  children: ReactNode
  density?: UiKitDensity
  reveal?: boolean
  id?: string
  sx?: SxProps<Theme>
  /** flat = no card chrome; raised = subtle surface */
  surface?: 'none' | 'subtle'
}

function StorySection({
  title,
  subtitle,
  question,
  action,
  children,
  density = 'comfortable',
  reveal = true,
  id,
  sx,
  surface = 'none',
}: StorySectionProps) {
  const body = (
    <>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        question={question}
        action={action}
        density={density}
      />
      {children}
    </>
  )

  if (surface === 'subtle') {
    return (
      <Card
        component="section"
        id={id}
        elevation="flat"
        aria-label={title ?? question}
        sx={{
          ...(reveal ? uiKitFadeInSx : {}),
          p: uiKitPad(density),
          mb: UI_KIT_SPACING.section,
          ...((sx as object) ?? {}),
        }}
      >
        {body}
      </Card>
    )
  }

  return (
    <Box
      component="section"
      id={id}
      aria-label={title ?? question}
      sx={{
        ...(reveal ? uiKitFadeInSx : {}),
        mb: UI_KIT_SPACING.section,
        ...((sx as object) ?? {}),
      }}
    >
      {body}
    </Box>
  )
}

export interface HeroSectionProps extends StorySectionProps {}
export function HeroSection(props: HeroSectionProps) {
  return <StorySection {...props} surface={props.surface ?? 'none'} />
}

export interface ExecutiveSectionProps extends StorySectionProps {}
export function ExecutiveSection(props: ExecutiveSectionProps) {
  return <StorySection {...props} />
}

export interface AnalyticsSectionProps extends StorySectionProps {}
export function AnalyticsSection(props: AnalyticsSectionProps) {
  return <StorySection {...props} />
}
