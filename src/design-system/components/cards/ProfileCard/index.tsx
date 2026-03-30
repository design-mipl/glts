import { Box, Typography, Avatar, Chip, Divider, Skeleton } from '@mui/material'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface ProfileStat {
  label: string
  value: string | number
}

export interface ProfileBadge {
  label: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'
}

export interface ProfileCardProps {
  name: string
  subtitle?: string
  description?: string
  avatarSrc?: string
  avatarFallback?: string
  headerColor?: string
  badges?: ProfileBadge[]
  actions?: ReactNode
  stats?: ProfileStat[]
  hoverable?: boolean
  onClick?: () => void
  loading?: boolean
  sx?: SxProps
}

const HEADER_HEIGHT = 72

export default function ProfileCard({
  name,
  subtitle,
  description,
  avatarSrc,
  avatarFallback,
  headerColor,
  badges,
  actions,
  stats,
  hoverable,
  onClick,
  loading = false,
  sx,
}: ProfileCardProps) {
  if (loading) {
    return (
      <BaseCard sx={sx}>
        <Box sx={{ height: HEADER_HEIGHT, bgcolor: 'action.hover' }} />
        <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={72} height={72} sx={{ mt: '-36px' }} />
          <Skeleton width={140} height={24} />
          <Skeleton width={100} height={18} />
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Skeleton variant="rounded" width={60} height={22} />
            <Skeleton variant="rounded" width={60} height={22} />
          </Box>
        </Box>
        {stats && (
          <>
            <Divider />
            <Box sx={{ display: 'flex' }}>
              {stats.map((_, i) => (
                <Box key={i} sx={{ flex: 1, py: 1.5, textAlign: 'center' }}>
                  <Skeleton width={40} height={22} sx={{ mx: 'auto' }} />
                  <Skeleton width={30} height={16} sx={{ mx: 'auto', mt: 0.5 }} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </BaseCard>
    )
  }

  return (
    <BaseCard
      headerColor={headerColor}
      hoverable={hoverable}
      onClick={onClick}
      sx={sx}
    >
      {/* Header band (fixed height for avatar overlap) */}
      {!headerColor && <Box sx={{ height: HEADER_HEIGHT, bgcolor: 'action.hover' }} />}
      {headerColor && <Box sx={{ height: HEADER_HEIGHT - 4 }} />}

      {/* Content */}
      <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
        {/* Avatar overlapping header */}
        <Avatar
          src={avatarSrc}
          sx={{
            width: 72,
            height: 72,
            mt: '-36px',
            border: '3px solid',
            borderColor: 'background.paper',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {avatarFallback ?? name[0]}
        </Avatar>

        {/* Name + Subtitle */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.3 }}>
            {name}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center', mt: 0.25 }}>
            {badges.map((badge, i) => (
              <Chip
                key={i}
                label={badge.label}
                size="small"
                color={badge.color ?? 'default'}
                sx={{ fontSize: 11 }}
              />
            ))}
          </Box>
        )}

        {/* Actions */}
        {actions && (
          <Box sx={{ mt: 0.5 }}>{actions}</Box>
        )}

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 0.5, lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Stats footer */}
      {stats && stats.length > 0 && (
        <>
          <Divider />
          <Box sx={{ display: 'flex', overflowX: { xs: 'auto', md: 'visible' } }}>
            {stats.map((stat, i) => (
              <Box
                key={i}
                sx={{
                  flex: '1 0 auto',
                  py: 1.5,
                  px: 1,
                  textAlign: 'center',
                  borderRight: i < stats.length - 1 ? '1px solid' : undefined,
                  borderColor: 'divider',
                  minWidth: 72,
                }}
              >
                <Typography variant="body1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </BaseCard>
  )
}
