import { Box, Typography } from '@mui/material'
import { ActivityFeed, BaseCard } from '@/design-system/UIComponents'
import type { DashboardActivityItem } from '../data/operationsDashboardMock'

export interface DashboardActivityPanelProps {
  items: DashboardActivityItem[]
}

export function DashboardActivityPanel({ items }: DashboardActivityPanelProps) {
  return (
    <BaseCard>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Recent activity
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Latest operations and finance events
        </Typography>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <ActivityFeed
          items={items.map((item) => ({
            id: item.id,
            user: item.user,
            action: item.action,
            target: item.target,
            timestamp: item.timestamp,
          }))}
          maxItems={6}
        />
      </Box>
    </BaseCard>
  )
}
