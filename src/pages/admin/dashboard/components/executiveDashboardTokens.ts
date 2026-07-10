import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'

export const EXECUTIVE_DASHBOARD_SPACING = {
  section: 3,
  card: 2,
  widget: 2.5,
} as const

export const EXECUTIVE_CHART_HEIGHT = 220
export const EXECUTIVE_CHART_PADDING = 2

export const EXECUTIVE_CARD_RADIUS = BORDER_RADIUS.xl

export function executiveCardLevel1Sx(colors: { border: string; white: string }) {
  return {
    border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
    borderRadius: EXECUTIVE_CARD_RADIUS,
    boxShadow: SHADOWS.xs,
    bgcolor: colors.white,
    transition: 'box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease',
    '&:hover': { boxShadow: SHADOWS.sm },
  } as const
}

export function executiveCardLevel2Sx(colors: { border: string; white: string }) {
  return {
    border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
    borderRadius: EXECUTIVE_CARD_RADIUS,
    boxShadow: publicShadows.card,
    bgcolor: colors.white,
    overflow: 'hidden',
  } as const
}

export function executiveCardLevel3Sx(colors: { border: string; white: string }, accent: string) {
  return {
    border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: EXECUTIVE_CARD_RADIUS,
    boxShadow: publicShadows.card,
    bgcolor: colors.white,
    transition: 'box-shadow 180ms ease, transform 180ms ease',
    '&:hover': { boxShadow: SHADOWS.md, transform: 'translateY(-1px)' },
  } as const
}

export const EXECUTIVE_TABLE_SX = {
  '& .MuiTableCell-root': {
    borderBottom: '1px solid',
    borderColor: 'divider',
    borderLeft: 'none',
    borderRight: 'none',
    py: 1.5,
    px: 2,
    fontSize: 13,
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
    bgcolor: 'background.paper',
    borderBottomWidth: 2,
  },
  '& .MuiTableRow-root:hover .MuiTableCell-root': {
    bgcolor: 'action.hover',
  },
} as const
