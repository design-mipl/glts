import { Box, Tooltip } from '@mui/material'
import { Star } from 'lucide-react'

interface ApplicationVipStarProps {
  size?: number
}

/** Green Star VIP indicator for Application Management listings and detail headers. */
export function ApplicationVipStar({ size = 14 }: ApplicationVipStarProps) {
  return (
    <Tooltip title="VIP passenger" placement="top">
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#16A34A',
          lineHeight: 0,
          flexShrink: 0,
        }}
        aria-label="VIP passenger"
      >
        <Star size={size} fill="currentColor" strokeWidth={0} />
      </Box>
    </Tooltip>
  )
}
