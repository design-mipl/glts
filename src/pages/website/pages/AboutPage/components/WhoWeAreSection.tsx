import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { aboutWhoWeAre } from '../aboutPageData'

export function WhoWeAreSection() {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(aboutWhoWeAre.image.src)

  return (
    <Box
      component="section"
      id="who-we-are"
      sx={{
        bgcolor: colors.surface,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: { xs: 420, md: 480, lg: 520 },
            bgcolor: colors.surface,
            boxShadow: '0 18px 44px rgba(15, 23, 42, 0.1)',
          }}
        >
          <Box
            component="img"
            src={imgSrc}
            alt={aboutWhoWeAre.image.alt}
            loading="lazy"
            onError={() => setImgSrc(aboutWhoWeAre.image.fallback)}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              display: 'block',
            }}
          />

          {/* Soft left wash so text stays readable on all breakpoints */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background: {
                xs: `linear-gradient(90deg, ${colors.surface} 0%, ${colors.surface} 42%, rgba(248,250,252,0.82) 58%, rgba(248,250,252,0.2) 72%, transparent 88%)`,
                md: `linear-gradient(90deg, ${colors.surface} 0%, ${colors.surface} 28%, rgba(248,250,252,0.55) 40%, transparent 52%)`,
              },
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: { xs: '100%', md: '42%', lg: '40%' },
              maxWidth: 520,
              minHeight: { xs: 420, md: 480, lg: 520 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 3, md: 4, lg: 5 },
              py: { xs: 4, md: 5 },
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.greenBright,
                mb: 1.5,
              }}
            >
              Our Company
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '28px', md: '34px', lg: '36px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                mb: 2.25,
              }}
            >
              {aboutWhoWeAre.heading}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {aboutWhoWeAre.paragraphs.map((paragraph) => (
                <Typography
                  key={paragraph.slice(0, 32)}
                  sx={{
                    fontSize: { xs: '14.5px', md: '15.5px' },
                    color: colors.textSecondary,
                    lineHeight: 1.7,
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
