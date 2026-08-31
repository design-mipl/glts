import { useCallback, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius, mrzSx } from '@/pages/website/theme/siteTheme'
import { howItWorksSteps } from '../landingWorkflowContent'

const STEP_COUNT = howItWorksSteps.length

/**
 * How it works — the checkpoint spine.
 *
 * Numbering is kept here because this content genuinely is a sequence: the order is the
 * information. (Elsewhere on the site, 01/02/03 markers were decoration and have been
 * dropped.) The spine replaces the previous treatment — masked map-pin PNGs sliding along
 * a rounded green progress bar — with the same checkpoint device the apply flow uses for
 * phase navigation, so "where am I in the process" looks identical before and after signup.
 *
 * The active step is driven by hover/focus and reverts to step one on leave. Nodes are
 * square, not circular: a stamp, not a bubble.
 */
export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % STEP_COUNT) + STEP_COUNT) % STEP_COUNT)
  }, [])

  return (
    <SiteSection id="how-it-works" tone="canvas">
      <Box onMouseLeave={() => goTo(0)}>
        <SiteSectionHeading
          eyebrow={`Process · ${String(STEP_COUNT).padStart(2, '0')} stages`}
          title="How it works"
          lead="Every application runs the same route: check what is required, file it correctly, and clear each gate with an expert watching. No step is left to guesswork."
        />

        {/* The spine. One hairline rail, one node per stage, filled to the active step. */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', sm: 'block' },
            position: 'relative',
            height: 12,
            mx: `calc(100% / ${STEP_COUNT} / 2)`,
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 5,
              height: '1px',
              backgroundColor: site.hairlineStrong,
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${STEP_COUNT <= 1 ? 100 : (activeIndex / (STEP_COUNT - 1)) * 100}%`,
                backgroundColor: site.accent,
                transition: `width 260ms ${siteMotion.easeInOut}`,
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            />
          </Box>

          {howItWorksSteps.map((step, index) => {
            const reached = index <= activeIndex
            return (
              <Box
                key={`node-${step.id}`}
                sx={{
                  position: 'absolute',
                  left: `${(index / Math.max(STEP_COUNT - 1, 1)) * 100}%`,
                  top: 0,
                  width: 11,
                  height: 11,
                  transform: 'translateX(-50%) rotate(45deg)',
                  backgroundColor: reached ? site.accent : site.surface,
                  border: `1px solid ${reached ? site.accent : site.hairlineStrong}`,
                  transition: `background-color 260ms ${siteMotion.easeOut}, border-color 260ms ${siteMotion.easeOut}`,
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              />
            )
          })}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: `repeat(${STEP_COUNT}, minmax(0, 1fr))` },
            gap: { xs: 1, sm: 2 },
          }}
        >
          {howItWorksSteps.map((step, index) => {
            const isActive = index === activeIndex
            const Icon = step.icon
            return (
              <Box
                key={step.id}
                component="button"
                type="button"
                onMouseEnter={() => goTo(index)}
                onFocus={() => goTo(index)}
                onClick={() => goTo(index)}
                aria-pressed={isActive}
                aria-label={`Stage ${step.number}: ${step.title}`}
                sx={{
                  m: 0,
                  p: { xs: 2.5, sm: 2.5, md: 3 },
                  minHeight: 44,
                  border: `1px solid ${isActive ? site.hairlineStrong : 'transparent'}`,
                  borderRadius: siteRadius.control,
                  backgroundColor: isActive ? site.surface : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  alignItems: 'flex-start',
                  gap: { xs: 2.5, sm: 2 },
                  fontFamily: 'inherit',
                  transition: `background-color 220ms ${siteMotion.easeOut}, border-color 220ms ${siteMotion.easeOut}`,
                  '&:focus-visible': {
                    outline: 'none',
                    borderColor: site.accent,
                    boxShadow: `0 0 0 3px ${site.accentRing}`,
                  },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                {/* One neutral icon treatment for every stage — no per-step colour. */}
                <Box
                  aria-hidden
                  sx={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: siteRadius.chip,
                    border: `1px solid ${isActive ? site.accentBorder : site.hairline}`,
                    backgroundColor: isActive ? site.accentSoft : site.canvas,
                    color: isActive ? site.accentInk : site.inkMuted,
                    transition: `border-color 220ms ${siteMotion.easeOut}, background-color 220ms ${siteMotion.easeOut}, color 220ms ${siteMotion.easeOut}`,
                  }}
                >
                  <Icon size={16} strokeWidth={1.9} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ ...mrzSx, fontSize: 9.5, mb: 1.25 }}>
                    Stage {step.number}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: siteFont.display,
                      fontSize: { xs: 15, md: 16 },
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: site.ink,
                      lineHeight: 1.25,
                      mb: 1,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: siteFont.body,
                      fontSize: 13,
                      color: site.inkMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </SiteSection>
  )
}
