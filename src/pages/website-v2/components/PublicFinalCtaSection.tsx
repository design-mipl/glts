import { useId, useState, type ReactNode } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { getMarketingPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { websiteSecondaryButtonSx } from '../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'
import { finalCtaSectionSx } from '../pages/LandingPage/landingPageSpacing'

export type PublicFinalCtaVariant = 'retail' | 'b2b' | 'editorial'

interface FinalCtaButton {
  label: string
  href: string
  icon?: ReactNode
}

interface PublicFinalCtaSectionProps {
  id: string
  variant: PublicFinalCtaVariant
  heading: string
  description: string
  image: { src: string; fallback: string }
  primaryButton: FinalCtaButton
  secondaryButton?: FinalCtaButton
  eyebrow?: string
  eyebrowRule?: boolean
  trustPoints?: readonly string[]
  trustPointIcon?: ReactNode
  imagePosition?: string | Record<string, string>
  overlay?: string | Record<string, string>
  decoration?: ReactNode
  sectionMinHeight?: { xs: number; sm: number; md: number }
  removeLastChildMargin?: boolean
}

/** Shared photo CTA shell and type/control treatment; page variants supply their content and art direction. */
export function PublicFinalCtaSection({
  id,
  variant,
  heading,
  description,
  image,
  primaryButton,
  secondaryButton,
  eyebrow,
  eyebrowRule = false,
  trustPoints,
  trustPointIcon,
  imagePosition = { xs: '70% 55%', md: 'center 55%' },
  overlay,
  decoration,
  sectionMinHeight,
  removeLastChildMargin = false,
}: PublicFinalCtaSectionProps) {
  const colors = usePublicBrandColors()
  const [backgroundSrc, setBackgroundSrc] = useState(image.src)
  const headingId = useId()
  const cta = ds.component.finalCta

  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={headingId}
      sx={{
        ...finalCtaSectionSx,
        ...(variant === 'retail' && { minHeight: cta.variant.retail.minHeight }),
        ...(sectionMinHeight && { minHeight: sectionMinHeight }),
        ...(removeLastChildMargin && { '&:last-child': { mb: 0 } }),
      }}
    >
      <Box
        component="img"
        src={backgroundSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={() => setBackgroundSrc(image.fallback)}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition }}
      />
      <Box
        aria-hidden="true"
        sx={{ position: 'absolute', inset: 0, background: overlay ?? cta.variant[variant].overlay }}
      />
      {decoration}
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Stack spacing={`${cta.variant[variant].contentGap}px`} sx={{ maxWidth: cta.contentMaxWidth }}>
          {eyebrow && (
            <Typography component="p" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.greenBright, fontSize: ds.type.eyebrow.size, fontWeight: ds.type.eyebrow.weight, lineHeight: ds.type.eyebrow.lineHeight, letterSpacing: ds.type.eyebrow.tracking, textTransform: 'uppercase', m: 0 }}>
              {eyebrowRule && <Box component="span" aria-hidden="true" sx={{ width: 26, height: 3, borderRadius: 1, bgcolor: 'currentColor' }} />}
              {eyebrow}
            </Typography>
          )}
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontFamily: ds.fonts.display,
              fontSize: { xs: cta.headingSize.mobile, sm: cta.headingSize.tablet, md: cta.headingSize.desktop },
              fontWeight: ds.type.h2.weight,
              lineHeight: cta.headingLineHeight,
              letterSpacing: ds.type.h2.tracking,
              color: colors.white,
              m: 0,
            }}
          >
            {heading}
          </Typography>
          <Typography sx={{ maxWidth: cta.descriptionMaxWidth, fontSize: { xs: cta.bodySize.mobile, md: cta.bodySize.desktop }, lineHeight: cta.bodyLineHeight, color: 'rgba(255,255,255,.9)' }}>
            {description}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={`${cta.actionGap}px`} sx={{ pt: `${cta.variant[variant].actionPaddingTop}px` }}>
            <Button
              variant="contained"
              href={primaryButton.href}
              endIcon={primaryButton.icon ?? <ArrowRight size={ds.component.button.marketing.iconSize} />}
              sx={{ ...getMarketingPrimaryButtonSx(colors), px: `${cta.primaryPaddingX}px`, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
            >
              {primaryButton.label}
            </Button>
            {secondaryButton && (
              <Button
                variant="outlined"
                href={secondaryButton.href}
                endIcon={secondaryButton.icon}
                sx={{
                  ...websiteSecondaryButtonSx,
                  borderColor: 'rgba(255,255,255,.45)',
                  color: colors.white,
                  bgcolor: 'rgba(255,255,255,.12)',
                  px: `${cta.secondaryPaddingX}px`,
                  alignSelf: { xs: 'stretch', sm: 'flex-start' },
                  '&:hover': { borderColor: colors.greenBright, bgcolor: 'rgba(255,255,255,.2)' },
                }}
              >
                {secondaryButton.label}
              </Button>
            )}
          </Stack>
          {trustPoints && trustPoints.length > 0 && (
            <Stack component="ul" aria-label="Trust points" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} sx={{ m: 0, p: 0, pt: 1, listStyle: 'none' }}>
              {trustPoints.map((point) => (
                <Box key={point} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,.9)', fontSize: ds.type.caption.size, fontWeight: 600 }}>
                  {trustPointIcon ?? <Box aria-hidden="true" sx={{ width: 8, height: 8, flex: '0 0 auto', borderRadius: '50%', bgcolor: colors.greenBright }} />}
                  {point}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </PublicContainer>
    </Box>
  )
}
