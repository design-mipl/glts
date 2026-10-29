import { Box, Button, Typography, keyframes } from '@mui/material'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb, getMarketingPrimaryButtonSx } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

type HeroInfoItem = { icon: LucideIcon } & (
  | { value: string; label: string; footnote?: string }
  | { title: string; description?: string }
)

interface ServiceHeroContentProps {
  headingId: string
  eyebrow: string
  heading: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
  items: readonly HeroInfoItem[]
  itemsLabel: string
  animate?: boolean
  compactSpacing?: boolean
  prominentItems?: boolean
  spacious?: boolean
  unframedItems?: boolean
}

const fadeInContent = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export function ServiceHeroContent({
  headingId,
  eyebrow,
  heading,
  description,
  primaryAction,
  secondaryAction,
  items,
  itemsLabel,
  animate = false,
  compactSpacing = false,
  prominentItems = false,
  spacious = false,
  unframedItems = false,
}: ServiceHeroContentProps) {
  const colors = usePublicBrandColors()

  return (
    <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: compactSpacing ? 'flex-start' : 'space-between', animation: animate ? `${fadeInContent} 0.85s ease-out both` : undefined, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
        <Box sx={{ maxWidth: 720 }}>
          <Typography
            component="p"
            sx={{
              mb: spacious ? { xs: 2, lg: 2.5 } : { xs: 1.5, lg: 2 },
              fontFamily: publicFonts.heading,
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.greenBright,
            }}
          >
            {eyebrow}
          </Typography>

          <Typography
            id={headingId}
            component="h1"
            sx={{
              ...websiteHeadingSx.display,
              fontSize: { xs: ds.type.display.mobile, lg: ds.type.display.tablet, desktopMd: ds.type.display.size },
              color: colors.white,
              maxWidth: 680,
              mb: spacious ? { xs: 2.5, lg: 3 } : { xs: 1.75, lg: 2 },
            }}
          >
            {heading}
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: 16, lg: 17, desktopMd: 18 },
              lineHeight: 1.55,
              maxWidth: 620,
              mb: spacious ? { xs: 3.5, lg: 4.5 } : { xs: 3, lg: 3.5 },
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'stretch', lg: 'center' }, flexWrap: 'wrap', gap: spacious ? { xs: 1.5, lg: 2.5 } : { xs: 1, lg: 2 } }}>
            <Button
              variant="contained"
              href={primaryAction.href}
              endIcon={<ArrowRight size={18} aria-hidden="true" />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                minHeight: 48,
                px: { xs: 2, lg: 3.5 },
                fontSize: { xs: 14, lg: 16 },
                width: { xs: '100%', lg: 'auto' },
                whiteSpace: 'normal',
                lineHeight: 1.3,
              }}
            >
              {primaryAction.label}
            </Button>
            <Button
              variant="text"
              href={secondaryAction.href}
              endIcon={<ArrowRight size={18} aria-hidden="true" />}
              sx={{
                minHeight: 48,
                alignSelf: { xs: 'flex-start', lg: 'center' },
                px: { xs: 0, lg: 1.5 },
                color: colors.white,
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent', color: colors.greenBright, textDecoration: 'underline' },
                '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
              }}
            >
              {secondaryAction.label}
            </Button>
          </Box>
        </Box>

        <Box
          component="ul"
          aria-label={itemsLabel}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            '@media (min-width: 360px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
            columnGap: { xs: 1.5, lg: 2, desktopMd: 0 },
            rowGap: prominentItems ? { xs: 2.5, lg: 3 } : { xs: 2, lg: 2.5 },
            listStyle: 'none',
            m: 0,
            mt: spacious
              ? { xs: '72px', lg: '80px', desktopMd: '88px' }
              : compactSpacing
                ? { xs: '36px', lg: '44px', desktopMd: '48px' }
                : { xs: 4.5, lg: 5.5, desktopMd: 7 },
            px: unframedItems ? 0 : prominentItems ? { xs: 2, lg: 3 } : { xs: 1.75, lg: 2.5 },
            py: unframedItems ? 0 : prominentItems ? { xs: 2.5, lg: 3 } : { xs: 2, lg: 2.5 },
            width: '100%',
            bgcolor: unframedItems ? 'transparent' : 'rgba(0, 31, 63, 0.36)',
            borderRadius: unframedItems ? 0 : `${ds.radius.medium}px`,
            '@media (min-width: 360px) and (max-width: 1279px)': {
              '& > li:nth-of-type(2n)': { borderLeft: '1px solid rgba(255,255,255,0.28)', pl: { xs: 1.5, lg: 2 } },
            },
            [`@media (min-width: ${ds.breakpoint.desktop}px)`]: {
              gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
              '& > li:not(:first-of-type)': { borderLeft: '1px solid rgba(255,255,255,0.28)', pl: 2.25 },
            },
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const headline = 'value' in item ? item.value : item.title
            const detail = 'label' in item ? item.label : item.description
            return (
              <Box
                component="li"
                key={headline}
                sx={{
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  alignItems: { xs: 'flex-start', lg: 'center' },
                  gap: prominentItems ? { xs: 1.25, lg: 1.5 } : { xs: 1, lg: 1.5 },
                }}
              >
                <Box sx={{ width: prominentItems ? { xs: 48, lg: 54 } : { xs: 40, lg: 44 }, height: prominentItems ? { xs: 48, lg: 54 } : { xs: 40, lg: 44 }, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`, border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.45)` }}>
                  <Icon size={prominentItems ? 28 : 22} color={colors.greenBright} strokeWidth={1.8} aria-hidden="true" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontFamily: publicFonts.heading, fontSize: prominentItems ? { xs: 20, lg: 23, desktopMd: 24 } : { xs: 16, lg: 18, desktopMd: 19 }, fontWeight: 800, color: colors.white, lineHeight: 1.2, mb: 0.35 }}>
                    {headline}
                  </Typography>
                  {detail && (
                    <Typography sx={{ fontSize: prominentItems ? { xs: 14, lg: 15 } : { xs: 12, lg: 13 }, fontWeight: prominentItems ? 600 : 500, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.4 }}>
                      {detail}
                    </Typography>
                  )}
                  {'footnote' in item && item.footnote && (
                    <Typography sx={{ mt: 0.6, fontSize: 10.5, color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.4 }}>
                      {item.footnote}
                    </Typography>
                  )}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </PublicContainer>
  )
}
