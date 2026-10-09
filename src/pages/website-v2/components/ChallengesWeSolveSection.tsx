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

type ChallengeVariant = 'corporate' | 'travelAgents' | 'marine'

interface ChallengesWeSolveSectionProps {
  id: string
  heading: string
  description?: string
  eyebrow?: string
  challenges: readonly ChallengeItem[]
  desktopColumns?: 2 | 4
  variant?: ChallengeVariant
}

function ChallengeDecorations({ variant }: { variant: ChallengeVariant }) {
  if (variant === 'corporate') return null

  if (variant === 'marine') {
    return (
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: 24, left: 28, width: 132, height: 100, opacity: 0.28, backgroundImage: 'radial-gradient(circle, #A7C4D8 2px, transparent 2.5px)', backgroundSize: '26px 26px' }} />
        <Box component="svg" viewBox="0 0 1440 120" preserveAspectRatio="none" sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: { xs: 46, tablet: 90 }, opacity: 0.65 }}>
          <path d="M0 25 C220 100 380 110 620 82 C870 50 1020 112 1220 72 C1330 50 1395 42 1440 55 L1440 120 L0 120 Z" fill="#EDF5F8" />
        </Box>
      </Box>
    )
  }

  const dotPatternId = 'travel-agent-challenge-map-dots'
  return (
    <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Box component="svg" viewBox="0 0 520 390" sx={{ position: 'absolute', top: { tablet: 8, desktopMd: 4 }, left: { tablet: -140, desktopMd: -42 }, width: { tablet: 450, desktopMd: 520 }, height: 'auto', display: { xs: 'none', tablet: 'block' }, opacity: 0.28 }}>
        <defs><pattern id={dotPatternId} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r="1.2" fill="#64BC85" /></pattern></defs>
        <g fill={`url(#${dotPatternId})`}>
          <path d="M25 75 65 52 113 58 128 37 181 33 206 56 190 77 155 83 142 110 117 120 100 154 74 145 65 111 37 107Z" />
          <path d="M92 167 126 160 143 178 155 203 139 226 141 258 121 289 111 337 88 312 85 269 64 237 67 195Z" />
          <path d="M205 78 235 56 267 60 282 49 329 45 345 58 396 51 449 68 487 91 461 110 419 113 390 132 356 127 333 150 302 145 284 122 251 116 226 101Z" />
          <path d="M255 142 295 140 324 157 333 185 313 215 306 249 282 270 259 247 248 213 228 194 234 165Z" />
          <path d="M398 247 440 239 469 251 481 278 457 299 416 293 392 272Z" />
        </g>
        <path d="M45 239 C105 279 145 196 186 216 C217 237 192 263 178 249 C157 226 205 188 257 171 C302 159 313 141 330 126 C362 99 385 80 427 63" fill="none" stroke="#48AC72" strokeWidth="2" strokeDasharray="8 7" strokeLinecap="round" />
        <path d="m433 42 8 14 19-2 8 5-21 6-8 15-6 1 4-17-15-10 2-5 15 7Z" fill="#48AC72" />
      </Box>
      <Box component="svg" viewBox="0 0 320 320" sx={{ position: 'absolute', right: { tablet: -125, desktopMd: -45 }, top: { tablet: 48, desktopMd: 24 }, width: { tablet: 260, desktopMd: 320 }, height: 'auto', display: { xs: 'none', tablet: 'block' }, opacity: 0.13 }}>
        <circle cx="160" cy="160" r="147" fill="none" stroke="#5CB985" strokeWidth="8" />
        <ellipse cx="160" cy="160" rx="77" ry="147" fill="none" stroke="#5CB985" strokeWidth="6" />
        <path d="M160 13v294M13 160h294M37 91c68 28 178 28 246 0M37 229c68-28 178-28 246 0" fill="none" stroke="#5CB985" strokeWidth="6" />
      </Box>
    </Box>
  )
}

export function ChallengesWeSolveSection({ id, heading, description, eyebrow, challenges, desktopColumns = 4, variant = 'corporate' }: ChallengesWeSolveSectionProps) {
  const colors = usePublicBrandColors()
  const cardTokens = ds.component.card.challenge
  const isTravelAgents = variant === 'travelAgents'
  const iconContainerSize = isTravelAgents ? 60 : 56

  return (
    <Box component="section" id={id} aria-labelledby={`${id}-heading`} sx={{ position: 'relative', overflow: 'hidden', bgcolor: isTravelAgents ? ds.color.challengeSurface : colors.white, py: landingSectionPy }}>
      <ChallengeDecorations variant={variant} />
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: ds.container.max, mx: 'auto' }}>
          <Box sx={{ maxWidth: 820, mx: 'auto', textAlign: 'center', mb: { xs: 4, tablet: 4.5, desktopMd: 5 } }}>
            {eyebrow ? <Typography sx={{ color: colors.greenDark, fontFamily: ds.fonts.heading, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.4, textTransform: 'uppercase', mb: 1 }}>{eyebrow}</Typography> : null}
            <Typography component="h2" id={`${id}-heading`} sx={{ ...websiteHeadingSx.h2Compact, color: colors.navy, mb: 1 }}>{heading}</Typography>
            {description ? <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: 15, tablet: 16 }, lineHeight: 1.5 }}>{description}</Typography> : null}
          </Box>
          <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', tablet: 'repeat(2, minmax(0, 1fr))', desktopMd: `repeat(${desktopColumns}, minmax(0, 1fr))` }, gap: { xs: 2, tablet: 2.5 }, alignItems: 'stretch', listStyle: 'none', m: 0, p: 0 }}>
            {challenges.map(({ title, description: detail, icon: Icon }) => (
              <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: `${iconContainerSize}px minmax(0, 1fr)`, alignItems: 'start', gap: { xs: 1.75, tablet: 2 }, minWidth: 0, minHeight: { tablet: isTravelAgents ? 120 : 176, desktopMd: isTravelAgents ? 120 : 188 }, p: { xs: `${cardTokens.padding.mobile + 4}px`, tablet: `${cardTokens.padding.desktop + 4}px` }, bgcolor: colors.white, border: `1px solid ${colors.border}`, borderRadius: `${cardTokens.radius}px`, boxShadow: '0 6px 20px rgba(15, 35, 55, 0.055)', transition: `border-color ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease, transform ${ds.component.card.hoverDurationMs}ms ease`, '@media (prefers-reduced-motion: reduce)': { transition: 'none' }, '@media (hover: hover)': { '&:hover': { borderColor: `rgba(${brandPrimaryGreenRgb}, 0.38)`, boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)', transform: 'translateY(-2px)' } } }}>
                <Box sx={{ width: iconContainerSize, height: iconContainerSize, borderRadius: '50%', bgcolor: ds.color.successSurface, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={isTravelAgents ? 29 : 28} color={colors.greenDark} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" /></Box>
                <Box sx={{ minWidth: 0, pt: 0.25 }}>
                  <Typography component="h3" sx={{ fontFamily: ds.fonts.heading, fontSize: { xs: 18, tablet: isTravelAgents ? 20 : 18 }, fontWeight: cardTokens.titleWeight, lineHeight: ds.component.text.cardTitle.lineHeight, color: colors.navy, mb: 0.6 }}>{title}</Typography>
                  <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: 15, tablet: isTravelAgents ? 16 : 15 }, lineHeight: cardTokens.bodyLineHeight }}>{detail}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
