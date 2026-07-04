import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'

export const ADMIN_DASHBOARD_CARD_RADIUS = BORDER_RADIUS.xl
export const ADMIN_DASHBOARD_ICON_RADIUS = BORDER_RADIUS.lg

export function adminDashboardCardSx(colors: { border: string; white: string }, featured = false) {
  return {
    border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
    borderRadius: ADMIN_DASHBOARD_CARD_RADIUS,
    boxShadow: publicShadows.card,
    bgcolor: colors.white,
    overflow: 'hidden',
    ...(featured
      ? {
          borderLeftWidth: 3,
          borderLeftColor: colors.border,
        }
      : {}),
  } as const
}

export function adminDashboardIconBoxSx(colors: { greenMuted: string; greenDark: string }) {
  return {
    width: 42,
    height: 42,
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    bgcolor: colors.greenMuted,
    color: colors.greenDark,
    flexShrink: 0,
  } as const
}
