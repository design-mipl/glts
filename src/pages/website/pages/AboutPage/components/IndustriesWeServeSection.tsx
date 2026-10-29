import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '../../../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { aboutIndustries } from '../aboutPageData'

const CARD_RADIUS = '18px'

function IndustryCard({
  title,
  description,
  href,
  image,
}: (typeof aboutIndustries)[number]) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(image.src)

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: CARD_RADIUS,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
          },
          '&:hover .industry-card-image': {
            transform: 'scale(1.05)',
          },
          '&:hover .industry-card-arrow': {
            color: colors.greenBright,
            transform: 'translateX(3px)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
        }}
      >
        <Box
          component="img"
          className="industry-card-image"
          src={imgSrc}
          alt={image.alt}
          loading="lazy"
          onError={() => setImgSrc(image.fallback)}
          sx={{
            display: 'block',
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
              'linear-gradient(180deg, rgba(0,20,40,0.05) 0%, rgba(0,20,40,0.35) 100%)',
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 2.25, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '17px', md: '18px' },
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <ArrowRight
            className="industry-card-arrow"
            size={18}
            color={colors.textMuted}
            style={{ flexShrink: 0, transition: 'color 0.2s ease, transform 0.2s ease' }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: '14px',
            color: colors.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export function IndustriesWeServeSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id="industries-we-serve"
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
            Industries We Serve
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
            Expertise across every travel segment
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Purpose-built support for the travelers and teams GreenLight serves every day.
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
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {aboutIndustries.map((industry) => (
            <IndustryCard key={industry.title} {...industry} />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
