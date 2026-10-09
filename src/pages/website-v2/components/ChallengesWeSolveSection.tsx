import { Box, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../pages/LandingPage/landingPageSpacing'

export interface ChallengeItem {
  title: string
  description: string
  icon: LucideIcon
}

interface ChallengesWeSolveSectionProps {
  id: string
  heading: string
  description?: string
  challenges: readonly ChallengeItem[]
  desktopColumns?: 2 | 4
  siteSpacing?: boolean
  readable?: boolean
}

export function ChallengesWeSolveSection({
  id,
  heading,
  description,
  challenges,
  desktopColumns = 4,
  siteSpacing = false,
  readable = false,
}: ChallengesWeSolveSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="section" id={id} sx={{ bgcolor: colors.white, py: landingSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 820, mx: 'auto', textAlign: 'center', mb: landingSectionHeaderMb }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: siteSpacing ? '28px' : { xs: '28px', sm: '32px', md: '36px' },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: colors.navy,
              mb: 1,
              ...(siteSpacing && {
                '@media (min-width: 600px)': { fontSize: '32px' },
                '@media (min-width: 1024px)': { fontSize: '36px' },
              }),
            }}
          >
            {heading}
          </Typography>
          {description ? (
            <Typography
              sx={{
                color: colors.textSecondary,
                fontFamily: publicFonts.body,
                fontSize: { xs: '15px', md: '17px' },
                lineHeight: 1.55,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            display: 'grid',
            ...(siteSpacing
              ? {
                  gridTemplateColumns: '1fr',
                  '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                  '@media (min-width: 1024px)': { gridTemplateColumns: `repeat(${desktopColumns}, minmax(0, 1fr))` },
                }
              : {
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: `repeat(${desktopColumns}, minmax(0, 1fr))` },
                }),
            gap: { xs: 1.75, md: 2 },
            alignItems: 'stretch',
          }}
        >
          {challenges.map(({ title, description: detail, icon: Icon }) => (
            <Box
              key={title}
              sx={{
                display: 'grid',
                gridTemplateColumns: '42px minmax(0, 1fr)',
                alignItems: 'start',
                gap: 1.5,
                p: { xs: 2, md: 2.25 },
                bgcolor: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.045)',
                transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: `rgba(${brandPrimaryGreenRgb}, 0.38)`,
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.10)`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={21} color={colors.greenDark} strokeWidth={2} aria-hidden="true" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: publicFonts.heading,
                    color: colors.navy,
                    fontSize: readable ? { xs: '17px', md: '18px' } : { xs: '16px', md: '17px' },
                    fontWeight: 700,
                    lineHeight: 1.3,
                    mb: 0.55,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    color: colors.textSecondary,
                    fontFamily: publicFonts.body,
                    fontSize: readable ? '16px' : '15px',
                    lineHeight: 1.5,
                  }}
                >
                  {detail}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
