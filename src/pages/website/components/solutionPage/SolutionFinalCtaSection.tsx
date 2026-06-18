import { useState, type ReactNode } from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { PublicContainer } from '../PublicContainer'
import { solutionCtaBackgroundImages } from '../../assets/solutionCtaImages'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '@/shared/theme/publicBrand'
import { MarineCtaBackgroundPattern } from './finalCta/MarineCtaBackgroundPattern'
import { CorporateCtaBackgroundPattern } from './finalCta/CorporateCtaBackgroundPattern'

export type SolutionFinalCtaVariant = 'marine' | 'corporate'

interface SolutionFinalCtaSectionProps {
  id?: string
  variant: SolutionFinalCtaVariant
  heading: string
  description: string
  primaryButton: { label: string; href: string }
  secondaryButton: { label: string; href: string }
}

const patternByVariant: Record<SolutionFinalCtaVariant, ReactNode> = {
  marine: <MarineCtaBackgroundPattern />,
  corporate: <CorporateCtaBackgroundPattern />,
}

export function SolutionFinalCtaSection({
  id = 'final-cta',
  variant,
  heading,
  description,
  primaryButton,
  secondaryButton,
}: SolutionFinalCtaSectionProps) {
  const colors = usePublicBrandColors()
  const backgroundAsset = solutionCtaBackgroundImages[variant]
  const [backgroundSrc, setBackgroundSrc] = useState<string>(backgroundAsset.src)

  return (
    <Box
      component="section"
      id={id}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 240, sm: 272, md: 304, lg: 320 },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 5.5, md: 8, lg: 9 },
      }}
    >
      <Box
        component="img"
        src={backgroundSrc}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setBackgroundSrc(backgroundAsset.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: variant === 'marine' ? 'center 55%' : 'center 40%',
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,31,63,0.88) 0%, rgba(0,31,63,0.78) 42%, rgba(0,31,63,0.62) 100%)',
        }}
      />

      {patternByVariant[variant]}

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Stack spacing={2.5} sx={{ maxWidth: 720 }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '28px', sm: '32px', md: '40px' },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.7px',
              color: colors.white,
            }}
          >
            {heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 0.5 }}>
            <Button
              variant="contained"
              href={primaryButton.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {primaryButton.label}
            </Button>
            <Button
              variant="outlined"
              href={secondaryButton.href}
              endIcon={<CalendarDays size={16} />}
              sx={{
                ...getOutlinedButtonSx(),
                borderColor: 'rgba(255, 255, 255, 0.45)',
                color: colors.white,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                px: 3.5,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                '&:hover': {
                  borderColor: colors.greenBright,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {secondaryButton.label}
            </Button>
          </Stack>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
