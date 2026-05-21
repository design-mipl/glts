import {
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Chip, Button, Divider, Skeleton,
} from '@mui/material'
import { ChevronRight } from 'lucide-react'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface ListCardItem {
  id: string
  primary: string
  secondary?: string
  icon?: ReactNode
  avatar?: string
  badge?: { label: string; color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' }
  actions?: ReactNode
  onClick?: () => void
}

export interface ListCardProps {
  title?: string
  subtitle?: string
  items: ListCardItem[]
  maxItems?: number
  showMoreLabel?: string
  onShowMore?: () => void
  loading?: boolean
  emptyText?: string
  headerColor?: string
  dividers?: boolean
  sx?: SxProps
}

export default function ListCard({
  title,
  subtitle,
  items,
  maxItems,
  showMoreLabel = 'View all',
  onShowMore,
  loading = false,
  emptyText = 'No items',
  headerColor,
  dividers = true,
  sx,
}: ListCardProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const hasMore = maxItems !== undefined && items.length > maxItems

  if (loading) {
    return (
      <BaseCard headerColor={headerColor} sx={sx}>
        <Box sx={{ p: 2 }}>
          {title && <Skeleton width="45%" height={22} sx={{ mb: 0.5 }} />}
          {subtitle && <Skeleton width="30%" height={16} sx={{ mb: 1.5 }} />}
        </Box>
        <Divider />
        <List disablePadding>
          {[...Array(maxItems ?? 3)].map((_, i) => (
            <ListItem key={i} sx={{ py: 1.25, px: 2 }}>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="55%" height={18} />}
                secondary={<Skeleton width="70%" height={14} />}
              />
            </ListItem>
          ))}
        </List>
      </BaseCard>
    )
  }

  return (
    <BaseCard headerColor={headerColor} sx={sx}>
      {/* Header */}
      {(title || subtitle) && (
        <>
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            {title && (
              <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
          </Box>
          <Divider />
        </>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">{emptyText}</Typography>
        </Box>
      )}

      {/* List */}
      {items.length > 0 && (
        <List disablePadding>
          {displayItems.map((item, i) => (
            <Box key={item.id}>
              {i > 0 && dividers && <Divider />}
              <ListItem
                onClick={item.onClick}
                sx={{
                  py: 1.25,
                  px: 2,
                  cursor: item.onClick ? 'pointer' : 'default',
                  '&:hover': item.onClick ? { bgcolor: 'action.hover' } : undefined,
                  alignItems: 'center',
                }}
                secondaryAction={
                  item.actions ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {item.badge && (
                        <Chip
                          label={item.badge.label}
                          size="small"
                          color={item.badge.color ?? 'default'}
                          sx={{ fontSize: 11 }}
                        />
                      )}
                      {item.actions}
                    </Box>
                  ) : item.badge ? (
                    <Chip
                      label={item.badge.label}
                      size="small"
                      color={item.badge.color ?? 'default'}
                      sx={{ fontSize: 11 }}
                    />
                  ) : undefined
                }
              >
                {(item.icon !== undefined || item.avatar !== undefined) && (
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      src={item.avatar}
                      sx={{ width: 36, height: 36, fontSize: 14 }}
                    >
                      {!item.avatar && item.icon}
                    </Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={item.primary}
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                      {item.secondary}
                    </Typography>
                  }
                  slotProps={{
                    primary: { variant: 'body2', fontWeight: 500 },
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}

      {/* Show more */}
      {hasMore && onShowMore && (
        <>
          <Divider />
          <Box sx={{ p: 1.5, textAlign: 'center' }}>
            <Button
              size="small"
              endIcon={<ChevronRight size={16} />}
              onClick={onShowMore}
              sx={{ fontSize: 13 }}
            >
              {showMoreLabel}
            </Button>
          </Box>
        </>
      )}
    </BaseCard>
  )
}
