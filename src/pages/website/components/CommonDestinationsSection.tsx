import { useMemo, useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import type { Country } from '@/shared/types/visa'
import { usePublicBrandColors } from '../theme/publicSiteTokens'
import { SolutionPageSection } from './solutionPage/SolutionPageSection'
import { HomepageDestinationCard } from './HomepageDestinationCard'
import { destinationCardCarouselItemWidth } from './destinationCardGrid'
import { useTheme } from '@mui/material/styles'

interface CommonDestinationsSectionProps {
  id?: string
  subtitle: string
  countries: Country[]
}

const SECONDS_PER_CARD = 4.2

export function CommonDestinationsSection({
  id = 'common-destinations',
  subtitle,
  countries,
}: CommonDestinationsSectionProps) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [isPaused, setIsPaused] = useState(false)

  const cardWidth = isLgUp
    ? destinationCardCarouselItemWidth.lg
    : isMdUp
      ? destinationCardCarouselItemWidth.md
      : isSmUp
        ? destinationCardCarouselItemWidth.sm
        : destinationCardCarouselItemWidth.xs
  const cardGap = isMdUp ? 26 : isSmUp ? 22 : 18
  const step = cardWidth + cardGap

  const loopItems = useMemo(
    () => (countries.length > 1 ? [...countries, ...countries] : countries),
    [countries],
  )

  const segmentWidth = countries.length * step - cardGap
  const scrollDuration = countries.length * SECONDS_PER_CARD
  const shouldAnimate = countries.length > 1 && !prefersReducedMotion

  return (
    <SolutionPageSection id={id} title="Common Destinations" subtitle={subtitle}>
      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsPaused(false)
          }
        }}
      >
        <Box
          role="region"
          aria-label="Destination cards"
          tabIndex={0}
          sx={{
            overflow: 'hidden',
            py: 1,
            '&:focus-visible': {
              outline: `2px solid ${colors.greenBright}`,
              outlineOffset: 4,
              borderRadius: '12px',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              gap: `${cardGap}px`,
              width: 'max-content',
              animation: shouldAnimate
                ? `destinationMarquee ${scrollDuration}s linear infinite`
                : 'none',
              animationPlayState: isPaused ? 'paused' : 'running',
              '@keyframes destinationMarquee': {
                from: { transform: 'translateX(0)' },
                to: { transform: `translateX(-${segmentWidth}px)` },
              },
            }}
          >
            {loopItems.map((country, index) => (
              <Box
                key={`${country.id}-${index}`}
                sx={{
                  flex: '0 0 auto',
                  width: cardWidth,
                }}
              >
                <HomepageDestinationCard country={country} index={index % countries.length} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </SolutionPageSection>
  )
}
