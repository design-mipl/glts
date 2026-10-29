import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { servicesAdditional } from '../servicesPageData'

const CARD_HEIGHT = { xs: 280, sm: 300, md: 320 }

function AdditionalCard({
  title,
  description,
  ctaLabel,
  href,
  image,
}: {
  title: string
  description: string
  ctaLabel: string
  href: string
  image: { src: string; fallback: string; alt: string }
}) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(image.src)

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: '18px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        bgcolor: colors.surfaceAlt,
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.14)',
          },
          '&:hover .additional-card-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <Box
        component="img"
        className="additional-card-image"
        src={imgSrc}
        alt={image.alt}
        loading="lazy"
        onError={() => setImgSrc(image.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'transform 0.4s ease',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,31,63,0.1) 0%, rgba(0,31,63,0.72) 100%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: { xs: 2.25, md: 2.5 },
          gap: 1,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '16px', md: '17px' },
            fontWeight: 700,
            color: colors.white,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '13.5px',
            color: 'rgba(255, 255, 255, 0.82)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          href={href}
          endIcon={<ArrowRight size={14} />}
          sx={{
            ...getMarketingPrimaryButtonSx(colors),
            alignSelf: 'flex-start',
            mt: 0.75,
            px: 2.25,
            minHeight: 36,
            height: 36,
            fontSize: '12px',
            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.95)`,
          }}
        >
          {ctaLabel}
        </Button>
      </Box>
    </Box>
  )
}

export function ServicesAdditionalSection() {
  const colors = usePublicBrandColors()
  const allCards = [servicesAdditional.featured, ...servicesAdditional.cards]

  return (
    <Box
      component="section"
      id="additional-services"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ mb: landingSectionHeaderMb, maxWidth: 640 }}>
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
            Additional Services
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              mb: 1.5,
            }}
          >
            Support beyond the visa application
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Documentation, compliance, insurance, and forex support that keep travel programs
            complete and travel-ready.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 2, md: 2.5 },
            alignItems: 'stretch',
          }}
        >
          {allCards.map((card) => (
            <AdditionalCard key={card.id} {...card} />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
