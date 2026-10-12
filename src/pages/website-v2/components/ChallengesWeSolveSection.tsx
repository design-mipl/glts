import { Box, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'
import { landingSectionPy } from '../pages/LandingPage/landingPageSpacing'

export interface ChallengeItem {
  title: string
  description: string
  icon: LucideIcon
}

interface ChallengesWeSolveSectionProps {
  id: string
  heading: string
  description?: string
  eyebrow?: string
  challenges: readonly ChallengeItem[]
}

export function ChallengesWeSolveSection({ id, heading, description, eyebrow, challenges }: ChallengesWeSolveSectionProps) {
  const colors = usePublicBrandColors()
  const cardTokens = ds.component.card.challenge

  return (
    <Box component="section" id={id} aria-labelledby={`${id}-heading`} sx={{ bgcolor: colors.white, py: landingSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 820, mx: 'auto', textAlign: 'center', mb: { xs: 4, lg: 4.5, desktopMd: 5 } }}>
          {eyebrow ? <Typography sx={{ color: colors.greenDark, fontFamily: ds.fonts.heading, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.4, textTransform: 'uppercase', mb: 1 }}>{eyebrow}</Typography> : null}
          <Typography component="h2" id={`${id}-heading`} sx={{ ...websiteHeadingSx.h2Compact, color: colors.navy, mb: 1 }}>{heading}</Typography>
          {description ? <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: 15, lg: 16 }, lineHeight: 1.5 }}>{description}</Typography> : null}
        </Box>

        <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))', desktopMd: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: '20px', lg: '24px' }, alignItems: 'stretch', listStyle: 'none', m: 0, p: 0 }}>
          {challenges.map(({ title, description: detail, icon: Icon }) => (
            <Box
              component="li"
              key={title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 2,
                minWidth: 0,
                minHeight: { lg: 220, desktopMd: 250 },
                p: { xs: `${cardTokens.padding.mobile + 4}px`, lg: `${cardTokens.padding.desktop + 4}px` },
                bgcolor: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: `${cardTokens.radius}px`,
                boxShadow: '0 6px 20px rgba(15, 35, 55, 0.055)',
                transition: `border-color ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease, transform ${ds.component.card.hoverDurationMs}ms ease`,
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: `rgba(${brandPrimaryGreenRgb}, 0.38)`,
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                },
              }}
            >
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: ds.color.successSurface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon size={28} color={colors.greenDark} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h3" sx={{ fontFamily: ds.fonts.heading, fontSize: 18, fontWeight: cardTokens.titleWeight, lineHeight: ds.component.text.cardTitle.lineHeight, color: colors.navy, mb: 0.6 }}>{title}</Typography>
                <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: 15, lineHeight: cardTokens.bodyLineHeight }}>{detail}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
