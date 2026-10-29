import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { aboutDifferentiators, aboutWhyGreenLight } from '../aboutPageData'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'

const SECTION_NAVY = '#0B1F45'

export function WhyGreenLightSection() {
  const colors = usePublicBrandColors()
  const { label, heading, description, image } = aboutWhyGreenLight

  return (
    <Box
      component="section"
      id="why-greenlight"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: landingSectionPy,
        bgcolor: SECTION_NAVY,
        minHeight: { md: 360, lg: 400 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Left visual — fades into navy */}
      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          inset: 0,
          width: { md: '40%', lg: '38%' },
          pointerEvents: 'none',
        }}
      >
        <Box
          component="img"
          src={image.src}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = image.fallback
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center left',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(90deg, rgba(11,31,69,0.35) 0%, transparent 28%, transparent 48%, ${SECTION_NAVY} 88%, ${SECTION_NAVY} 100%),
              linear-gradient(180deg, ${SECTION_NAVY} 0%, transparent 16%, transparent 84%, ${SECTION_NAVY} 100%)
            `,
          }}
        />
      </Box>

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 0.72fr) minmax(0, 1.48fr)',
            },
            gap: { xs: 3, md: 3.5 },
            alignItems: 'center',
          }}
        >
          {/* Mobile-only image */}
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              position: 'relative',
              height: 200,
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = image.fallback
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, transparent 40%, ${SECTION_NAVY} 100%)`,
              }}
            />
          </Box>

          {/* Spacer so content sits on the right over navy */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }} />

          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1.25,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 28,
                  height: 3,
                  borderRadius: 1,
                  bgcolor: colors.greenBright,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.greenBright,
                  lineHeight: 1.2,
                }}
              >
                {label}
              </Typography>
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '24px', sm: '28px', md: '30px', lg: '34px' },
                fontWeight: 800,
                color: colors.white,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                mb: 1.25,
              }}
            >
              {heading}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '14px', md: '15px' },
                color: 'rgba(255, 255, 255, 0.82)',
                lineHeight: 1.6,
                maxWidth: 560,
                mb: { xs: 3, md: 3.25 },
              }}
            >
              {description}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(5, minmax(0, 1fr))',
                },
                gap: { xs: 2.75, md: 3 },
              }}
            >
              {aboutDifferentiators.map(({ title, description: featureDescription, icon: Icon }) => (
                <Box
                  key={title}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'flex-start', lg: 'center' },
                    textAlign: { xs: 'left', lg: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      border: '1.75px solid rgba(255, 255, 255, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={28} color={colors.white} strokeWidth={1.65} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: publicFonts.heading,
                        fontSize: { xs: '15px', md: '16.5px' },
                        fontWeight: 700,
                        color: colors.white,
                        lineHeight: 1.3,
                        mb: 0.6,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '13px', md: '13.5px' },
                        color: 'rgba(255, 255, 255, 0.72)',
                        lineHeight: 1.5,
                      }}
                    >
                      {featureDescription}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
