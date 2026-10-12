import { Box, Button, Chip, Typography, keyframes } from '@mui/material'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb, getMarketingPrimaryButtonSx } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

type HeroInfoItem = { icon: LucideIcon } & (
  | { value: string; label: string; footnote?: string }
  | { title: string; description: string }
)

interface ServiceHeroContentProps {
  headingId: string
  eyebrow: string
  eyebrowIcon: LucideIcon
  heading: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
  items: readonly HeroInfoItem[]
  itemsLabel: string
  animate?: boolean
}

const fadeInContent = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export function ServiceHeroContent({
  headingId,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  heading,
  description,
  primaryAction,
  secondaryAction,
  items,
  itemsLabel,
  animate = false,
}: ServiceHeroContentProps) {
  const colors = usePublicBrandColors()

  return (
    <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <Box sx={{ width: '100%', animation: animate ? `${fadeInContent} 0.85s ease-out both` : undefined, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
        <Box sx={{ maxWidth: 720 }}>
          <Chip
            icon={<EyebrowIcon size={14} aria-hidden="true" />}
            label={eyebrow}
            sx={{
              height: 28,
              mb: { xs: 2.5, lg: 3 },
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
              color: colors.greenBright,
              border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.35)`,
              '& .MuiChip-icon': { color: colors.greenBright, ml: 1 },
            }}
          />

          <Typography
            id={headingId}
            component="h1"
            sx={{
              ...websiteHeadingSx.display,
              color: colors.white,
              maxWidth: 680,
              mb: { xs: 2, lg: 2.5 },
            }}
          >
            {heading}
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: 16, lg: 18, desktopMd: 19 },
              lineHeight: 1.6,
              maxWidth: 640,
              mb: { xs: 3, lg: 4 },
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
            <Button
              variant="contained"
              href={primaryAction.href}
              endIcon={<ArrowRight size={18} aria-hidden="true" />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                minHeight: 48,
                px: { xs: 2, sm: 3.5 },
                fontSize: { xs: 14, sm: 16 },
                width: { xs: '100%', sm: 'auto' },
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
                alignSelf: { xs: 'flex-start', sm: 'center' },
                px: { xs: 0, sm: 1.5 },
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
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))', desktopMd: `repeat(${items.length}, minmax(0, 1fr))` },
            gap: { xs: 1, lg: 1.5 },
            listStyle: 'none',
            m: 0,
            mt: { xs: 5, lg: 7 },
            p: 0,
            width: '100%',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const headline = 'value' in item ? item.value : item.title
            const detail = 'label' in item ? item.label : item.description
            return (
              <Box
                component="li"
                key={detail}
                sx={{
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: { xs: 1.5, lg: 1.75 },
                  bgcolor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                }}
              >
                <Box sx={{ width: 44, height: 44, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '12px', bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)` }}>
                  <Icon size={24} color={colors.greenBright} strokeWidth={1.8} aria-hidden="true" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontFamily: publicFonts.heading, fontSize: { xs: 18, desktopMd: 20 }, fontWeight: 800, color: colors.white, lineHeight: 1.15, mb: 0.4 }}>
                    {headline}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.35 }}>
                    {detail}
                  </Typography>
                  {'footnote' in item && item.footnote && (
                    <Typography sx={{ mt: 0.75, fontSize: 11, color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.4 }}>
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
