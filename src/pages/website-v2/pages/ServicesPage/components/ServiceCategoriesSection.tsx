import { useState } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { ArrowRight, Check } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { serviceCategories } from '../servicesPageData'

function ServiceCategoryCard({
  title,
  description,
  highlights,
  ctaLabel,
  href,
  image,
}: (typeof serviceCategories)[number]) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(image.src)

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.07)',
        bgcolor: colors.white,
        overflow: 'hidden',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
          },
          '&:hover .service-category-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
        }}
      >
        <Box
          component="img"
          className="service-category-image"
          src={imgSrc}
          alt={image.alt}
          loading="lazy"
          onError={() => setImgSrc(image.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: image.objectPosition ?? 'center center',
            transition: 'transform 0.4s ease',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,20,40,0.02) 0%, rgba(0,20,40,0.28) 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h3"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '20px', md: '22px' },
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '14.5px',
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: 'none', flex: 1 }}>
          {highlights.map((item) => (
            <Box
              component="li"
              key={item}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.14)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: '1px',
                }}
              >
                <Check size={12} color={colors.greenBright} strokeWidth={3} />
              </Box>
              <Typography sx={{ fontSize: '14px', color: colors.text, lineHeight: 1.45 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          variant="contained"
          href={href}
          endIcon={<ArrowRight size={16} />}
          sx={{
            ...getMarketingPrimaryButtonSx(colors),
            alignSelf: 'flex-start',
            mt: 0.5,
            px: 2.75,
          }}
        >
          {ctaLabel}
        </Button>
      </Box>
    </Box>
  )
}

export function ServiceCategoriesSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id="service-categories"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        scrollMarginTop: 88,
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
            Service Categories
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              mb: 1.5,
            }}
          >
            Choose the path that fits your travel needs
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Clear entry points to Retail, Corporate, and Marine visa support — each built for a
            different traveler profile.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2.5, md: 3 },
            alignItems: 'stretch',
          }}
        >
          {serviceCategories.map((category) => (
            <ServiceCategoryCard key={category.id} {...category} />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
