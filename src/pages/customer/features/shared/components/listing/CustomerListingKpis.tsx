import { Box, Typography, Card } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { LucideIcon } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'

export interface CustomerKpiItem {
  id: string
  label: string
  value: string
  icon: LucideIcon
  color?: 'primary' | 'success' | 'warning' | 'info'
}

export function CustomerListingKpis({ items }: { items: CustomerKpiItem[] }) {
  const theme = useTheme()
  const colorMap = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: `repeat(${Math.min(items.length, 4)}, 1fr)` },
        gap: 1.5,
        mb: 3,
      }}
    >
      {items.map(kpi => {
        const mainColor = colorMap[kpi.color ?? 'primary']
        return (
          <Card
            key={kpi.id}
            elevation={0}
            sx={{
              p: 1.5,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: `${BORDER_WIDTH.thin} solid`,
              borderColor: 'divider',
              borderRadius: BORDER_RADIUS.lg,
              boxShadow: SHADOWS.sm,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                {kpi.label}
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.2, color: mainColor }}>
                {kpi.value}
              </Typography>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}
