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
        width: { md: '100%' },
        justifyContent: { md: 'center' },
        m: 0,
        pr: { xs: 'var(--trusted-logo-gap)', md: 0 },
        pl: 0,
        listStyle: 'none',
      }}
    >
      {logos.map(({ name, src, alt, width, height = 76, crop }) => (
        <Box
          component="li"
          key={name}
          sx={{
            flexShrink: 0,
            width: {
              xs: 148,
              sm: 176,
              md: `calc((min(100vw - 96px, 1280px) - ${12 * (logos.length - 1)}px) / ${logos.length})`,
            },
            height: { xs: 64, md: 76 },
            px: 2,
            display: 'grid',
            placeItems: 'center',
            boxSizing: 'border-box',
            bgcolor: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
          }}
        >
          <Box
            component="img"
            src={src}
            alt={duplicate ? '' : (alt ?? name)}
            sx={{
              display: 'block',
              width: {
                xs: width ? Math.min(width, 160) : 'auto',
                md: crop ? '100%' : width ? Math.min(width, 160) : 'auto',
              },
              height: { xs: Math.min(height, 48), md: Math.min(height, 58) },
              maxWidth: '100%',
              objectFit: { xs: 'contain', md: crop ? 'cover' : 'contain' },
              objectPosition: 'center',
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
            overflow: { xs: 'hidden', md: 'visible' },
            maskImage: {
              xs: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              md: 'none',
            },
            WebkitMaskImage: {
              xs: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              md: 'none',
            },
            '--trusted-logo-gap': { xs: '32px', sm: '48px', md: '12px' },
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
              width: { xs: 'max-content', md: '100%' },
              animation: { xs: `trustedCompaniesScroll ${Math.max(1, durationSeconds)}s linear infinite`, md: 'none' },
              animationDirection: direction === 'right' ? 'reverse' : 'normal',
              '& > .trusted-companies-duplicate': { display: { md: 'none' } },
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
