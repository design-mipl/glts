import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { PublicContainer } from '../PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../theme/publicSiteTokens'
import {
  publicHeroPaddingBottom,
  publicHeroPaddingTop,
  publicHeroSectionMinHeight,
} from '../../pages/LandingPage/landingPageSpacing'

interface SolutionHeroProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function SolutionHero({ title, subtitle, children }: SolutionHeroProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.surface,
        pt: publicHeroPaddingTop,
        pb: publicHeroPaddingBottom,
        minHeight: publicHeroSectionMinHeight,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 760 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '32px', md: '40px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              mb: subtitle ? 2 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ fontSize: { xs: '16px', md: '17px' }, color: colors.textSecondary, lineHeight: 1.65 }}>
              {subtitle}
            </Typography>
          ) : null}
          {children}
        </Box>
      </PublicContainer>
    </Box>
  )
}
