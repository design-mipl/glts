import { useId, useState } from 'react'
import { Box, Collapse, Typography, useMediaQuery } from '@mui/material'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import type { FAQItem } from '../../../components/FAQSection'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { landingSectionPy, landingSectionHeaderMb } from '../landingPageSpacing'

interface LandingFaqSectionProps {
  faqs: FAQItem[]
  displayOrder?: readonly number[]
  heading?: string
}

export function LandingFaqSection({ faqs, displayOrder, heading = 'Questions, answered.' }: LandingFaqSectionProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const idPrefix = useId().replace(/:/g, '')
  const orderedFaqs = faqs.map((item, sourceIndex) => ({ item, sourceIndex }))
  if (displayOrder) {
    orderedFaqs.sort((first, second) => {
      const firstPosition = displayOrder.indexOf(first.sourceIndex)
      const secondPosition = displayOrder.indexOf(second.sourceIndex)
      return (firstPosition < 0 ? faqs.length + first.sourceIndex : firstPosition)
        - (secondPosition < 0 ? faqs.length + second.sourceIndex : secondPosition)
    })
  }

  const toggle = (index: number) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <Box
      component="section"
      aria-labelledby={`${idPrefix}-heading`}
      sx={{
        bgcolor: ds.color.surface,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 3, md: 5 },
            mb: landingSectionHeaderMb,
          }}
        >
          <Box sx={{ maxWidth: 900 }}>
            <Typography
              component="p"
              sx={{
                color: ds.color.brandHover,
                fontSize: ds.type.eyebrow.size,
                fontWeight: ds.type.eyebrow.weight,
                lineHeight: ds.type.eyebrow.lineHeight,
                letterSpacing: ds.type.eyebrow.tracking,
                mb: 1.5,
              }}
            >
              FAQS
            </Typography>
            <Typography
              id={`${idPrefix}-heading`}
              component="h2"
              sx={{
                color: ds.color.navy,
                fontFamily: ds.fonts.display,
                fontSize: { xs: ds.type.h1.mobile, md: ds.type.h1.tablet, lg: ds.type.h1.size },
                fontWeight: ds.type.h1.weight,
                lineHeight: ds.type.h1.lineHeight,
                letterSpacing: ds.type.h1.tracking,
                mb: 2,
              }}
            >
              {heading}
            </Typography>
            <Typography
              component="p"
              sx={{
                color: ds.color.textSecondary,
                fontSize: { xs: ds.type.body.mobile, md: ds.type.body.size },
                lineHeight: ds.type.body.lineHeight,
              }}
            >
              Quick answers to common visa questions — or reach our specialists for personalized guidance.
            </Typography>
          </Box>

          <Box
            component="a"
            href="/enquiry"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              gap: 1,
              minHeight: 44,
              px: 2.5,
              color: ds.color.brandHover,
              bgcolor: ds.color.surface,
              border: `1px solid ${ds.color.brand}`,
              borderRadius: `${ds.radius.medium}px`,
              boxShadow: ds.shadow.subtle,
              textDecoration: 'none',
              fontFamily: ds.fonts.ui,
              fontSize: ds.type.button.size,
              fontWeight: ds.type.button.weight,
              lineHeight: ds.type.button.lineHeight,
              transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease',
              '&:hover': {
                color: ds.color.navy,
                bgcolor: ds.color.successSurface,
                borderColor: ds.color.brandHover,
              },
              '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
            }}
          >
            Talk to an Expert <ArrowRight size={18} aria-hidden="true" />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
            gap: { xs: 1.25, md: 1.5 },
          }}
        >
          {orderedFaqs.map(({ item: { q, a }, sourceIndex }) => {
            const isOpen = expanded.has(sourceIndex)
            const buttonId = `${idPrefix}-question-${sourceIndex}`
            const panelId = `${idPrefix}-answer-${sourceIndex}`

            return (
              <Box
                key={q}
                sx={{
                  alignSelf: 'start',
                  minWidth: 0,
                  bgcolor: ds.color.surface,
                  border: `1px solid ${ds.color.border}`,
                  borderRadius: `${ds.radius.medium}px`,
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.035)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  id={buttonId}
                  component="button"
                  type="button"
                  onClick={() => toggle(sourceIndex)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    width: '100%',
                    minHeight: { xs: 64, md: 60 },
                    px: { xs: 2.25, md: 3 },
                    py: 1.25,
                    color: ds.color.navy,
                    bgcolor: 'transparent',
                    border: 0,
                    textAlign: 'left',
                    fontFamily: ds.fonts.ui,
                    cursor: 'pointer',
                    transition: 'background-color 180ms ease',
                    '&:hover': { bgcolor: ds.color.surfaceMuted },
                    '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: -3 },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      minWidth: 0,
                      color: 'inherit',
                      fontSize: { xs: 15, md: 16 },
                      fontWeight: 700,
                      lineHeight: 1.35,
                    }}
                  >
                    {q}
                  </Typography>
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 auto',
                      width: 28,
                      height: 28,
                      color: isOpen ? ds.color.brandHover : ds.color.navy,
                    }}
                  >
                    {isOpen ? <Minus size={19} /> : <Plus size={19} />}
                  </Box>
                </Box>
                <Collapse
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  in={isOpen}
                  timeout={prefersReducedMotion ? 0 : 240}
                >
                  <Typography
                    sx={{
                      px: { xs: 2.25, md: 3 },
                      pb: { xs: 2.25, md: 2.5 },
                      color: ds.color.textSecondary,
                      fontSize: ds.type.bodySmall.size,
                      lineHeight: ds.type.bodySmall.lineHeight,
                    }}
                  >
                    {a}
                  </Typography>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </PublicContainer>
    </Box>
  )
}
