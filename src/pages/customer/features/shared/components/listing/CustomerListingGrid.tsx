import { Box, Typography, Card, Chip } from '@mui/material'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'

export interface CustomerListingGridItem {
  id: string
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusColor?: 'success' | 'warning' | 'info' | 'default'
}

interface CustomerListingGridProps {
  items: CustomerListingGridItem[]
  onItemClick?: (id: string) => void
}

export function CustomerListingGrid({ items, onItemClick }: CustomerListingGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 1.5,
        p: 2,
      }}
    >
      {items.map(item => (
        <Card
          key={item.id}
          elevation={0}
          onClick={() => onItemClick?.(item.id)}
          sx={{
            p: 2,
            cursor: onItemClick ? 'pointer' : 'default',
            border: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
            borderRadius: BORDER_RADIUS.md,
            '&:hover': onItemClick ? { borderColor: 'primary.main', boxShadow: 1 } : {},
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
            {item.title}
          </Typography>
          {item.subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {item.subtitle}
            </Typography>
          )}
          {item.meta && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {item.meta}
            </Typography>
          )}
          {item.status && (
            <Chip label={item.status} size="small" color={item.statusColor ?? 'default'} sx={{ mt: 1, height: 22, fontSize: 11 }} />
          )}
        </Card>
      ))}
    </Box>
  )
}
