import { Box, Grid, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ActionCard, BaseCard } from '@/design-system/UIComponents'
import type { DashboardQuickActionItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'
import { BusinessWidgetFrame } from './common/BusinessWidgetFrame'

export interface QuickActionsProps {
  items: DashboardQuickActionItem[]
  loading?: boolean
  permission?: boolean
  columns?: 1 | 2 | 3
  /** `tiles` matches compact icon grid; `cards` keeps ActionCard rows. */
  variant?: 'cards' | 'tiles'
  title?: string
  subtitle?: string
}

export function QuickActions({
  items,
  loading = false,
  permission,
  columns = 1,
  variant = 'cards',
  title,
  subtitle,
}: QuickActionsProps) {
  const theme = useTheme()

  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const lgSpan = 12 / columns
  const displayItems: DashboardQuickActionItem[] =
    loading && items.length === 0
      ? Array.from({ length: Math.max(columns, 2) }, (_, i) => ({
          id: `action-skeleton-${i}`,
          title: '—',
        }))
      : items

  const body =
    variant === 'tiles' ? (
      <Grid container spacing={DASHBOARD_SPACING.field}>
        {displayItems.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 4, lg: lgSpan }}>
            <BaseCard
              hoverable={!item.disabled && !loading}
              onClick={item.disabled || loading ? undefined : item.onClick}
              sx={{
                height: '100%',
                opacity: item.disabled ? 0.5 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                  minHeight: 96,
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.16),
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.3 }}>
                  {item.title}
                </Typography>
              </Box>
            </BaseCard>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Grid container spacing={DASHBOARD_SPACING.field}>
        {displayItems.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: columns > 1 ? 6 : 12, lg: lgSpan }}>
            <ActionCard
              title={item.title}
              description={item.description}
              icon={item.icon}
              badge={item.badge}
              onClick={item.onClick}
              disabled={item.disabled}
              loading={loading}
              sx={{ height: '100%' }}
            />
          </Grid>
        ))}
      </Grid>
    )

  if (title) {
    return (
      <BusinessWidgetFrame title={title} subtitle={subtitle} loading={false} card>
        {body}
      </BusinessWidgetFrame>
    )
  }

  return body
}
