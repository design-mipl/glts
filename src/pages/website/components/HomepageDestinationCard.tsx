import { Box } from '@mui/material'
import type { Country } from '@/shared/types/visa'
import {
  DestinationImageCard,
  DESTINATION_CARD_HEIGHT,
} from './DestinationImageCard'

const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

interface HomepageDestinationCardProps {
  country: Country
  href?: string
  index?: number
}

export function HomepageDestinationCard({ country, href, index = 0 }: HomepageDestinationCardProps) {
  const staggerDelay = `${Math.min(index, 9) * 0.055}s`

  return (
    <Box
      sx={{
        height: DESTINATION_CARD_HEIGHT,
        animation: `destinationCardFadeUp 0.5s ${TRANSITION_EASE} ${staggerDelay} both`,
        '@keyframes destinationCardFadeUp': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <DestinationImageCard country={country} href={href} revealDetailsOnHover />
    </Box>
  )
}
