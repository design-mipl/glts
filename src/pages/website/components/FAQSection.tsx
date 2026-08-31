import { useState } from 'react'
import { Box, Typography, Collapse } from '@mui/material'
import { Minus, Plus } from 'lucide-react'
import { SiteSection, SiteSectionHeading } from './SiteSection'
import { site, siteFont, siteMotion, siteRadius, mrzSx } from '../theme/siteTheme'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

const DEFAULT_TITLE = 'Common questions'

/**
 * FAQ.
 *
 * Rebuilt as a single hairline-divided list. The previous version paired the accordion
 * with a large support photograph whose height was measured with a `ResizeObserver` and
 * mirrored onto the image on every expand — a layout read/write loop maintained purely so
 * a decorative image stayed the same height as the questions. The image is gone and so is
 * the observer.
 *
 * Each row is its own disclosure and several can be open at once: people scanning an FAQ
 * are usually comparing two answers, and an accordion that closes the previous one makes
 * that impossible.
 */
export function FAQSection({ faqs, title = DEFAULT_TITLE }: FAQSectionProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <SiteSection tone="canvas">
      <SiteSectionHeading
        eyebrow={`Questions · ${String(faqs.length).padStart(2, '0')}`}
        title={title}
        lead="Short answers to what people ask most. Anything not covered here, a specialist can answer directly."
      />

      <Box
        sx={{
          maxWidth: 860,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          backgroundColor: site.surface,
          overflow: 'hidden',
        }}
      >
        {faqs.map(({ q, a }, index) => {
          const isOpen = expanded.has(index)
          return (
            <Box
              key={q}
              sx={{
                borderBottom: `1px solid ${site.hairlineSoft}`,
                '&:last-of-type': { borderBottom: 'none' },
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  minHeight: 44,
                  py: 2.5,
                  px: { xs: 3, md: 3.5 },
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: `background-color 180ms ${siteMotion.easeOut}`,
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': { backgroundColor: site.canvas },
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: `inset 0 0 0 2px ${site.accent}`,
                  },
                }}
              >
                <Typography sx={{ ...mrzSx, fontSize: 9.5, flex: '0 0 auto', width: 24 }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>

                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: siteFont.body,
                    fontWeight: 600,
                    fontSize: { xs: 14, md: 15 },
                    color: site.ink,
                    lineHeight: 1.4,
                  }}
                >
                  {q}
                </Typography>

                <Box
                  aria-hidden
                  sx={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: siteRadius.chip,
                    border: `1px solid ${isOpen ? site.accentBorder : site.hairline}`,
                    backgroundColor: isOpen ? site.accentSoft : 'transparent',
                    color: isOpen ? site.accentInk : site.inkMuted,
                    transition: `background-color 180ms ${siteMotion.easeOut}, border-color 180ms ${siteMotion.easeOut}, color 180ms ${siteMotion.easeOut}`,
                  }}
                >
                  {isOpen ? <Minus size={14} strokeWidth={2.2} /> : <Plus size={14} strokeWidth={2.2} />}
                </Box>
              </Box>

              <Collapse in={isOpen} timeout={220}>
                <Typography
                  sx={{
                    pl: { xs: 3, md: '76px' },
                    pr: { xs: 3, md: 3.5 },
                    pb: 3,
                    fontFamily: siteFont.body,
                    color: site.inkMuted,
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    maxWidth: '72ch',
                  }}
                >
                  {a}
                </Typography>
              </Collapse>
            </Box>
          )
        })}
      </Box>
    </SiteSection>
  )
}
