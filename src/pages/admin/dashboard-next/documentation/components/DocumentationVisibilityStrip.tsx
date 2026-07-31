import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { CheckCircle2, Package, Truck } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import type { DashboardKpiItem } from '../../shared/types'
import { DASHBOARD_SPACING } from '../../shared/constants'

const ICONS: Record<string, ReactNode> = {
  vfs_submitted: <CheckCircle2 size={14} />,
  collection_pending: <Package size={14} />,
  collected: <Package size={14} />,
  dispatched: <Truck size={14} />,
}

export interface DocumentationVisibilityStripProps {
  items: DashboardKpiItem[]
  loading?: boolean
  onItemClick?: (kpiId: string) => void
}

/**
 * Compact post-submit visibility row — view-only counts that open Application Management.
 * Kept out of the hero so Work / Performance / Reports tabs stay above the fold.
 */
export function DocumentationVisibilityStrip({
  items,
  loading,
  onItemClick,
}: DocumentationVisibilityStripProps) {
  const colors = usePublicBrandColors()

  if (!items.length) return null

  return (
    <Box
      sx={{
        ...executiveCardLevel2Sx(colors),
        px: 2,
        py: 1.25,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box minWidth={0}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
            Post-submission visibility
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            View only — opens Application Management (no Docs Work listing).
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={DASHBOARD_SPACING.dense}
          flexWrap="wrap"
          useFlexGap
          sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`${item.label}: ${item.value} — open in Application Management`}
              onClick={() => onItemClick?.(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onItemClick?.(item.id)
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.75,
                borderRadius: '10px',
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: 'pointer',
                minWidth: 0,
                opacity: loading ? 0.6 : 1,
                outline: 'none',
                '&:hover': { borderColor: 'primary.main' },
                '&:focus-visible': {
                  boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  color: 'text.secondary',
                  flexShrink: 0,
                }}
              >
                {ICONS[item.id] ?? <Package size={14} />}
              </Box>
              <Box minWidth={0}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11, display: 'block', lineHeight: 1.2 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14, lineHeight: 1.2 }}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
