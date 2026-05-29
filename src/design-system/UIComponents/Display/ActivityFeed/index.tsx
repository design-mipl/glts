import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Avatar from '../Avatar'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

dayjs.extend(relativeTime)

interface ActivityItem {
  id: string
  user?: { name: string; avatarSrc?: string }
  action: string
  target?: string
  timestamp: Date | string
  icon?: ReactNode
  color?: string
  metadata?: Record<string, string>
}

export interface ActivityFeedProps {
  items: ActivityItem[]
  loading?: boolean
  maxItems?: number
  showLoadMore?: boolean
  onLoadMore?: () => void
  emptyText?: string
  sx?: SxProps<Theme>
}

export default function ActivityFeed({
  items,
  loading = false,
  maxItems,
  showLoadMore = false,
  onLoadMore,
  emptyText = 'No activity yet',
  sx,
}: ActivityFeedProps) {
  const theme = useTheme()
  const displayed = maxItems ? items.slice(0, maxItems) : items

  if (loading) {
    return (
      <Box sx={sx}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Skeleton variant="circular" width={36} height={36} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  if (!displayed.length) {
    return (
      <Box sx={[{ textAlign: 'center', py: 4 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={sx}>
      {displayed.map((item, idx) => {
        const isLast = idx === displayed.length - 1
        return (
          <Box key={item.id} sx={{ display: 'flex', gap: 1.5 }}>
            {/* Left column: icon/avatar + connector */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              {item.user ? (
                <Avatar name={item.user.name} src={item.user.avatarSrc} size="md" />
              ) : (
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: item.color ? `${item.color}1a` : 'action.hover',
                    color: item.color ?? 'text.secondary',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
              )}
              {!isLast && (
                <Box
                  sx={{
                    width: '2px',
                    flex: 1,
                    minHeight: '16px',
                    bgcolor: theme.palette.divider,
                    my: '4px',
                  }}
                />
              )}
            </Box>

            {/* Right column: content */}
            <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'baseline' }}>
                {item.user && (
                  <Typography variant="body2" fontWeight={600} component="span">
                    {item.user.name}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" component="span">
                  {item.action}
                </Typography>
                {item.target && (
                  <Typography variant="body2" fontWeight={500} component="span">
                    {item.target}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.25 }}>
                {dayjs(item.timestamp).fromNow()}
              </Typography>
              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <Box
                  sx={{
                    mt: 0.75,
                    p: 1,
                    borderRadius: '6px',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {Object.entries(item.metadata).map(([k, v]) => (
                    <Typography key={k} variant="caption" color="text.secondary">
                      <strong>{k}:</strong> {v}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}

      {showLoadMore && onLoadMore && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button variant="text" onClick={onLoadMore}>
            Load more
          </Button>
        </Box>
      )}
    </Box>
  )
}
