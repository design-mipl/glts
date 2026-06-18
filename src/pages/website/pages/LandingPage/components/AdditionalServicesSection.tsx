import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../../theme/publicSiteTokens'
import { additionalTravelServices } from '../../../assets/landingPageImages'

const IMAGE_RADIUS = '22px'
const THUMB_RADIUS = '14px'
const TRANSITION_MS = 0.4

function ServiceImage({
  src,
  fallback,
  alt,
  sx,
}: {
  src: string
  fallback: string
  alt: string
  sx?: object
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...sx,
      }}
    />
  )
}

function ServiceThumbnails({
  activeIndex,
  onSelect,
}: {
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.25, sm: 1.5 }}
      role="tablist"
      aria-label="Additional travel services"
      sx={{
        overflowX: 'auto',
        width: '100%',
        pt: { xs: 2.5, md: 3 },
        pb: 0.5,
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: colors.border,
          borderRadius: 2,
        },
      }}
    >
      {additionalTravelServices.map((service, index) => {
        const isActive = index === activeIndex

        return (
          <Box
            key={service.id}
            component="button"
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={service.title}
            onClick={() => onSelect(index)}
            sx={{
              flex: '1 1 0',
              minWidth: { xs: 72, sm: 80, md: 88 },
              maxWidth: { xs: 130, md: 140 },
              p: 0,
              border: 'none',
              cursor: 'pointer',
              bgcolor: 'transparent',
              borderRadius: THUMB_RADIUS,
              overflow: 'hidden',
              position: 'relative',
              outline: isActive ? `2px solid ${colors.greenBright}` : `2px solid transparent`,
              outlineOffset: 2,
              boxShadow: isActive
                ? `0 8px 24px rgba(${brandPrimaryGreenRgb}, 0.28)`
                : '0 4px 14px rgba(15, 23, 42, 0.08)',
              opacity: isActive ? 1 : 0.72,
              transform: isActive ? 'scale(1)' : 'scale(0.98)',
              transition:
                'opacity 280ms ease, transform 280ms ease, outline-color 280ms ease, box-shadow 280ms ease',
              '@media (hover: hover)': {
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.02)',
                  boxShadow: '0 10px 28px rgba(15, 23, 42, 0.14)',
                },
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 96, sm: 104, md: 112 },
                overflow: 'hidden',
              }}
            >
              <ServiceImage src={service.image.src} fallback={service.image.fallback} alt="" />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: isActive ? 'transparent' : 'rgba(0, 31, 63, 0.22)',
                  transition: 'background-color 280ms ease',
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export function AdditionalServicesSection() {
  const colors = usePublicBrandColors()
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = additionalTravelServices[activeIndex]
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: TRANSITION_MS, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            Beyond Visas
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '26px', md: '36px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            Additional Travel Services
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            Supporting services that keep your entire trip compliant and coordinated — not just the
            visa filing.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: { xs: 3, md: 5, lg: 8 },
            alignItems: 'stretch',
            minHeight: { lg: 440 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 'auto', lg: '100%' },
              minHeight: { xs: 260, sm: 300, md: 340, lg: '100%' },
              borderRadius: IMAGE_RADIUS,
              overflow: 'hidden',
              boxShadow: '0 20px 56px rgba(15, 23, 42, 0.12)',
              border: `1px solid ${colors.borderSoft}`,
              bgcolor: colors.surfaceAlt,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <ServiceImage
                  src={activeService.image.src}
                  fallback={activeService.image.fallback}
                  alt={activeService.image.alt}
                />
              </motion.div>
            </AnimatePresence>
          </Box>

          <Stack
            spacing={0}
            sx={{
              minWidth: 0,
              height: { lg: '100%' },
              minHeight: { lg: 440 },
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ pt: { xs: 0, lg: 0 } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                  transition={transition}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '28px', md: '34px', lg: '38px' },
                      fontWeight: 800,
                      color: colors.navy,
                      lineHeight: 1.12,
                      letterSpacing: '-0.5px',
                      mb: 2,
                    }}
                  >
                    {activeService.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: '16px', md: '17px' },
                      color: colors.textSecondary,
                      lineHeight: 1.7,
                      maxWidth: 520,
                    }}
                  >
                    {activeService.description}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <ServiceThumbnails activeIndex={activeIndex} onSelect={setActiveIndex} />
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
