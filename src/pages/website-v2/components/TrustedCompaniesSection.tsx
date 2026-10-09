import { Box, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'
import { compactSectionPy } from '../pages/LandingPage/landingPageSpacing'

export interface TrustedCompanyLogo {
  name: string
  src: string
  alt?: string
  width?: number
  height?: number
  crop?: boolean
}

interface TrustedCompaniesSectionProps {
  id: string
  heading: string
  logos: readonly TrustedCompanyLogo[]
  durationSeconds?: number
  direction?: 'left' | 'right'
  previewOnly?: boolean
}

export function TrustedCompaniesSection({
  id,
  heading,
  logos,
  durationSeconds = 36,
  direction = 'left',
  previewOnly = false,
}: TrustedCompaniesSectionProps) {
  const colors = usePublicBrandColors()

  if (previewOnly && !import.meta.env.DEV) return null
  if (logos.length === 0) return null

  const renderLogos = (duplicate: boolean) => (
    <Box
      component="ul"
      aria-hidden={duplicate ? true : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: 'var(--trusted-logo-gap)',
        m: 0,
        pr: 'var(--trusted-logo-gap)',
        pl: 0,
        listStyle: 'none',
      }}
    >
      {logos.map(({ name, src, alt, width, height = 76, crop = false }) => (
        <Box component="li" key={name} sx={{ flexShrink: 0 }}>
          <Box
            component="img"
            src={src}
            alt={duplicate ? '' : (alt ?? name)}
            sx={{
              display: 'block',
              width: width ? { xs: Math.round(width * 0.8), sm: width } : 'auto',
              height: { xs: Math.round(height * 0.8), sm: Math.round(height * 0.9), md: height },
              maxWidth: 'none',
              objectFit: crop ? 'cover' : 'contain',
            }}
          />
        </Box>
      ))}
    </Box>
  )

  return (
    <Box component="section" id={id} aria-labelledby={`${id}-heading`} sx={{ bgcolor: colors.white, py: compactSectionPy }}>
      <PublicContainer variant="hero">
        <Typography
          component="h2"
          id={`${id}-heading`}
          sx={{
            textAlign: 'center',
            fontFamily: publicFonts.display,
            color: colors.navy,
            fontSize: { xs: '22px', md: '28px' },
            fontWeight: 700,
            lineHeight: 1.25,
            mb: { xs: 2, md: 2.5 },
          }}
        >
          {heading}
        </Typography>

        <Box
          sx={{
            '--trusted-logo-gap': { xs: '32px', sm: '48px', md: '72px' },
            overflow: 'hidden',
            maskImage: {
              xs: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              md: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
            },
            WebkitMaskImage: {
              xs: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              md: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
            },
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover .trusted-companies-track': { animationPlayState: 'paused' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              overflowX: 'auto',
              '& .trusted-companies-track': { animation: 'none' },
              '& .trusted-companies-duplicate': { display: 'none' },
            },
          }}
        >
          <Box
            className="trusted-companies-track"
            sx={{
              display: 'flex',
              width: 'max-content',
              animation: `trustedCompaniesScroll ${Math.max(1, durationSeconds)}s linear infinite`,
              animationDirection: direction === 'right' ? 'reverse' : 'normal',
              '@keyframes trustedCompaniesScroll': {
                from: { transform: 'translate3d(0, 0, 0)' },
                to: { transform: 'translate3d(-50%, 0, 0)' },
              },
            }}
          >
            {renderLogos(false)}
            <Box className="trusted-companies-duplicate" sx={{ display: 'flex' }}>
              {renderLogos(true)}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
