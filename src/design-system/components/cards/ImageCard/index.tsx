import { Box, Typography, Chip, Skeleton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface ImageCardBadge {
  label: string
  color?: string
}

export interface ImageCardProps {
  image?: string
  imageFallbackColor?: string
  imageHeight?: number
  title: string
  subtitle?: string
  description?: string
  badges?: ImageCardBadge[]
  actions?: ReactNode
  overlay?: boolean
  hoverable?: boolean
  onClick?: () => void
  loading?: boolean
  sx?: SxProps
}

export default function ImageCard({
  image,
  imageFallbackColor,
  imageHeight = 180,
  title,
  subtitle,
  description,
  badges,
  actions,
  overlay = false,
  hoverable,
  onClick,
  loading = false,
  sx,
}: ImageCardProps) {
  const theme = useTheme()
  const fallbackBg = imageFallbackColor ?? alpha(theme.palette.primary.main, 0.12)
  const cardRadius = typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 8

  if (loading) {
    return (
      <BaseCard sx={sx}>
        <Skeleton variant="rectangular" width="100%" height={imageHeight} />
        <Box sx={{ p: 2 }}>
          <Skeleton width="70%" height={24} />
          <Skeleton width="45%" height={18} sx={{ mt: 0.5 }} />
          <Skeleton width="90%" height={16} sx={{ mt: 1 }} />
          <Skeleton width="80%" height={16} sx={{ mt: 0.5 }} />
        </Box>
      </BaseCard>
    )
  }

  const imageBlock = (
    <Box
      sx={{
        position: 'relative',
        height: imageHeight,
        overflow: 'hidden',
        borderRadius: overlay ? `${cardRadius * 1.5}px ${cardRadius * 1.5}px 0 0` : undefined,
        flexShrink: 0,
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', bgcolor: fallbackBg }} />
      )}

      {/* Overlay content */}
      {overlay && (
        <>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.72))',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ color: '#fff', lineHeight: 1.3 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
            {badges && badges.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.75 }}>
                {badges.map((badge, i) => (
                  <Chip
                    key={i}
                    label={badge.label}
                    size="small"
                    sx={{
                      bgcolor: badge.color ?? 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: 11,
                      backdropFilter: 'blur(4px)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  )

  return (
    <BaseCard hoverable={hoverable} onClick={onClick} sx={sx}>
      {imageBlock}
      {!overlay && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
              {description}
            </Typography>
          )}
          {badges && badges.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {badges.map((badge, i) => (
                <Chip
                  key={i}
                  label={badge.label}
                  size="small"
                  sx={{
                    bgcolor: badge.color,
                    fontSize: 11,
                  }}
                />
              ))}
            </Box>
          )}
          {actions && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
    </BaseCard>
  )
}
